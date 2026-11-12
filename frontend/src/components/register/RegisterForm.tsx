import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  User,
} from "lucide-react";
import { TermsAgreementModal } from "/@/components/legal/TermsAgreementModal";
import { TextField, focusRing, getIdError } from "/@/components/register/authShared";
import { IdDropZone } from "/@/components/register/IdDropZone";

type ExtractedId = {
  idNumber?: string;
  fullName?: string;
  birthdate?: string;
  course?: string;
  address?: string;
};

type Values = {
  idNumber: string;
  fullName: string;
  birthdate: string;
  course: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  email: string;
  password: string;
  confirm: string;
};

const EMPTY_VALUES: Values = {
  idNumber: "",
  fullName: "",
  birthdate: "",
  course: "",
  address: "",
  emergencyName: "",
  emergencyPhone: "",
  email: "",
  password: "",
  confirm: "",
};

const ACCEPTED_ID_TYPES = /^(image\/.+|application\/pdf)$/;

function isValidPhone(value: string) {
  return /^\+?[\d\s-]+$/.test(value.trim()) && value.replace(/\D/g, "").length >= 7;
}

async function extractStudentId(front: File, back: File): Promise<ExtractedId> {
  const body = new FormData();
  body.append("front", front);
  body.append("back", back);
  const res = await fetch("/api/ocr/student-id", { method: "POST", body });
  if (!res.ok) throw new Error("Could not read the ID.");
  return (await res.json()) as ExtractedId;
}

type Step = "upload" | "review";
type ScanState = "idle" | "scanning" | "done" | "error";

type RegisterFormProps = {
  onSuccess: (message: string) => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [step, setStep] = useState<Step>("upload");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
    };
  }, [frontPreview]);

  useEffect(() => {
    return () => {
      if (backPreview) URL.revokeObjectURL(backPreview);
    };
  }, [backPreview]);

  const update = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const selectSide = (side: "front" | "back", selected: File) => {
    if (!ACCEPTED_ID_TYPES.test(selected.type)) {
      setUploadError("Upload an image or PDF of your ID.");
      return;
    }
    setUploadError(null);
    const url = selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null;

    if (side === "front") {
      setFrontFile(selected);
      setFrontPreview(url);
    } else {
      setBackFile(selected);
      setBackPreview(url);
    }
  };

  const readId = async () => {
    if (!frontFile || !backFile) {
      setUploadError("Upload both the front and back of your ID to continue.");
      return;
    }

    setUploadError(null);
    setScanState("scanning");
    setScanMessage(null);

    try {
      const data = await extractStudentId(frontFile, backFile);
      const validId =
        data.idNumber && !getIdError(data.idNumber) ? data.idNumber.trim() : undefined;

      setValues((prev) => ({
        ...prev,
        idNumber: validId ?? prev.idNumber,
        fullName: data.fullName?.trim() || prev.fullName,
        birthdate: data.birthdate || prev.birthdate,
        course: data.course?.trim() || prev.course,
        address: data.address?.trim() || prev.address,
      }));

      setScanState("done");
      setScanMessage(
        validId
          ? "We filled in your details from the ID. Check them before continuing."
          : "We could not find a valid ID number. Please type it in."
      );
    } catch {
      setScanState("error");
      setScanMessage("We could not read this ID. Please fill in your details.");
    }

    setStep("review");
  };

  const changeIdPhotos = () => {
    setStep("upload");
    setScanState("idle");
    setScanMessage(null);
    setUploadError(null);
  };

  const errors = {
    idNumber: getIdError(values.idNumber),
    fullName: values.fullName.trim() ? null : "Enter your full name.",
    birthdate: values.birthdate ? null : "Enter your birthdate.",
    course: values.course.trim() ? null : "Enter your course or office.",
    address: values.address.trim() ? null : "Enter your address.",
    emergencyName: values.emergencyName.trim() ? null : "Enter an emergency contact name.",
    emergencyPhone: isValidPhone(values.emergencyPhone)
      ? null
      : "Enter a valid emergency contact phone number.",
    email: /^\S+@\S+\.\S+$/.test(values.email) ? null : "Enter a valid email address.",
    password: values.password.length >= 8 ? null : "Use at least 8 characters.",
    confirm:
      values.confirm && values.confirm === values.password ? null : "Passwords do not match.",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const shown = (key: keyof typeof errors) => (submitAttempted ? errors[key] : null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);
    if (!frontFile || !backFile) {
      setSubmitError("Upload both the front and back of your ID before creating an account.");
      return;
    }
    if (hasErrors) return;
    setIsAgreementOpen(true);
  };

  const handleAgreementAccepted = async () => {
    setIsAgreementOpen(false);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const body = new FormData();
      body.append("idFront", frontFile as File);
      body.append("idBack", backFile as File);
      body.append(
        "data",
        JSON.stringify({
          idNumber: values.idNumber.trim(),
          fullName: values.fullName.trim(),
          birthdate: values.birthdate,
          course: values.course.trim(),
          address: values.address.trim(),
          emergencyContact: {
            name: values.emergencyName.trim(),
            phone: values.emergencyPhone.trim(),
          },
          email: values.email.trim(),
          password: values.password,
          accepted_terms: true,
          accepted_at: new Date().toISOString(),
        })
      );
      const res = await fetch("/api/patients/register", { method: "POST", body });
      if (!res.ok) throw new Error("Registration failed. Please try again.");
      onSuccess("Your account has been created. Sign in with your ID number and password.");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isScanning = scanState === "scanning";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative mt-8 flex w-full flex-col gap-5 text-left"
      >
        {submitError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
            <span>{submitError}</span>
          </div>
        ) : null}

        {step === "upload" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <IdDropZone
                label="Front"
                hint="Required"
                file={frontFile}
                preview={frontPreview}
                disabled={isScanning}
                invalid={Boolean(uploadError) && !frontFile}
                onSelect={(f) => selectSide("front", f)}
              />
              <IdDropZone
                label="Back"
                hint="Required"
                file={backFile}
                preview={backPreview}
                disabled={isScanning}
                invalid={Boolean(uploadError) && !backFile}
                onSelect={(f) => selectSide("back", f)}
              />
            </div>

            {uploadError ? (
              <p role="alert" className="text-sm text-danger">
                {uploadError}
              </p>
            ) : null}

            {isScanning ? (
              <p className="flex items-center justify-center gap-2 text-sm text-textMuted">
                <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                Reading your ID...
              </p>
            ) : (
              <p className="text-xs leading-relaxed text-textMuted">
                Upload both sides of your school ID. Photo or PDF. We use it to fill in your
                details.
              </p>
            )}

            <button
              type="button"
              onClick={readId}
              disabled={!frontFile || !backFile || isScanning}
              className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-primaryDark hover:shadow-lg active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {isScanning ? "Reading..." : "Continue"}
              {!isScanning && (
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </button>
          </>
        )}

        {step === "review" && (
          <>
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="grid grid-cols-2 gap-3">
                <IdThumb label="Front" file={frontFile} preview={frontPreview} />
                <IdThumb label="Back" file={backFile} preview={backPreview} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p
                  className={`flex items-center gap-1.5 text-xs leading-relaxed ${
                    scanState === "error" ? "text-danger" : "text-success"
                  }`}
                >
                  {scanState === "error" ? (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {scanMessage}
                </p>

                <button
                  type="button"
                  onClick={changeIdPhotos}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded text-sm font-semibold text-primary transition-colors duration-200 hover:text-primaryDark ${focusRing}`}
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2} />
                  Change
                </button>
              </div>
            </div>

            <SectionTitle>Personal details</SectionTitle>

            <TextField
              id="reg-fullName"
              label="Full name"
              value={values.fullName}
              onChange={(v) => update("fullName", v)}
              icon={User}
              autoComplete="name"
              error={shown("fullName")}
            />

            <TextField
              id="reg-idNumber"
              label="Student, faculty, or staff ID"
              value={values.idNumber}
              onChange={(v) => update("idNumber", v)}
              icon={IdCard}
              placeholder="e.g. 202XXXXX-S"
              autoComplete="off"
              error={shown("idNumber")}
              hint="Format: 8-digit number + suffix -S, -F, or -U."
            />

            <TextField
              id="reg-course"
              label="Course or office"
              value={values.course}
              onChange={(v) => update("course", v)}
              icon={FileText}
              placeholder="e.g. BS Nursing"
              error={shown("course")}
            />

            <TextField
              id="reg-birthdate"
              label="Birthdate"
              type="date"
              value={values.birthdate}
              onChange={(v) => update("birthdate", v)}
              icon={Calendar}
              error={shown("birthdate")}
            />

            <TextField
              id="reg-address"
              label="Address"
              value={values.address}
              onChange={(v) => update("address", v)}
              icon={MapPin}
              autoComplete="street-address"
              placeholder="House no., street, barangay, city"
              error={shown("address")}
            />

            <SectionTitle>Emergency contact</SectionTitle>

            <TextField
              id="reg-emergencyName"
              label="Contact name"
              value={values.emergencyName}
              onChange={(v) => update("emergencyName", v)}
              icon={User}
              error={shown("emergencyName")}
            />

            <TextField
              id="reg-emergencyPhone"
              label="Contact phone"
              type="tel"
              inputMode="numeric"
              value={values.emergencyPhone}
              onChange={(v) => update("emergencyPhone", v)}
              icon={Phone}
              autoComplete="tel"
              placeholder="e.g. 0917 123 4567"
              error={shown("emergencyPhone")}
            />

            <SectionTitle>Account</SectionTitle>

            <p className="-mt-2 text-xs leading-relaxed text-textMuted">
              You can complete the rest of your profile after your account is created.
            </p>

            <TextField
              id="reg-email"
              label="Email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={(v) => update("email", v)}
              icon={Mail}
              autoComplete="email"
              placeholder="you@example.com"
              error={shown("email")}
            />

            <TextField
              id="reg-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(v) => update("password", v)}
              icon={Lock}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={shown("password")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 rounded text-textMuted transition-colors duration-200 hover:text-primary ${focusRing}`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2} />
                  )}
                </button>
              }
            />

            <TextField
              id="reg-confirm"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={values.confirm}
              onChange={(v) => update("confirm", v)}
              icon={Lock}
              autoComplete="new-password"
              error={shown("confirm")}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-primaryDark hover:shadow-lg active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
              {isSubmitting ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </button>
          </>
        )}
      </form>

      {isAgreementOpen && (
        <TermsAgreementModal
          onAccept={handleAgreementAccepted}
          onCancel={() => setIsAgreementOpen(false)}
        />
      )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mb-1 mt-2 border-t border-border pt-4">
      <p className="text-sm font-semibold text-textPrimary">{children}</p>
    </div>
  );
}

function IdThumb({
  label,
  file,
  preview,
}: {
  label: string;
  file: File | null;
  preview: string | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">{label}</p>
      <div className="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-surface">
        {preview ? (
          <img src={preview} alt={`${label} of ID`} className="h-full w-full object-contain" />
        ) : file ? (
          <FileText className="h-8 w-8 text-primary" strokeWidth={2} />
        ) : (
          <span className="text-xs text-textMuted">Not added</span>
        )}
      </div>
    </div>
  );
}