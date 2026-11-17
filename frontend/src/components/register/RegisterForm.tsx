import { useEffect, useState, type FormEvent } from "react";
import { TermsAgreementModal } from "/@/components/legal/TermsAgreementModal";
import { focusRing } from "/@/components/register/authShared";
import { API_ENDPOINTS, getApiUrl } from "/@/config/ApiConfig";
import { apiClient } from "/@/api/axios_client";
import {
  ACCEPTED_FORM_TYPES,
  ApplicationFormUpload,
  type ReadStatus,
} from "/@/components/register/ApplicationFormUpload";
import {
  DETAIL_GROUPS,
  DETAIL_KEYS,
  EMPTY_DETAIL_VALUES,
  RegisterDetailsStep,
  calculateAge,
  getGroupErrors,
  getStudentIdError,
  hasGroupErrors,
  mergeExtracted,
  resolveDetails,
  type DetailKey,
  type DetailValues,
  type ExtractedForm,
} from "/@/components/register/RegisterDetails";
import MedicalHistoryForm from "/@/components/MedicalHistoryForm";
import {
  Reveal,
  ScrollReveal,
  scrollStair,
} from "/@/components/landinganim";

// TEMP: set to false, or delete this flag and the skip button below, when testing is done.
const SHOW_SKIP_UPLOAD = true;

const STEPS = [
  "Application form",
  ...DETAIL_GROUPS.map((group) => group.title),
  "Medical history",
];

const MEDICAL_STEP = STEPS.length - 1;

const REQUIRED_MEDICAL = [
  "smoking",
  "vaping",
  "alcohol_intake",
  "temperature",
  "blood_pressure",
  "heart_rate",
  "respiratory_rate",
  "eyes",
  "chest_xray",
  "cbc",
  "urinalysis",
  "recommendation",
];

type MedicalValues = Record<string, string | string[]>;

const DETAIL_KEY_SET = new Set<string>(DETAIL_KEYS);

function formDataToMedical(fd: FormData): MedicalValues {
  const out: MedicalValues = {};
  fd.forEach((value, key) => {
    if (DETAIL_KEY_SET.has(key) || typeof value !== "string") return;
    const existing = out[key];
    if (existing === undefined) out[key] = value;
    else out[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  });
  return out;
}

async function readApplicationForm(file: File): Promise<ExtractedForm> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${getApiUrl()}${API_ENDPOINTS.ocr.application_form}`, { method: "POST", body });
  if (!res.ok) throw new Error("Could not read the form.");
  return (await res.json()) as ExtractedForm;
}

const primaryButton = `rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-card transition-colors duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

const secondaryButton = `rounded-xl px-5 py-3 text-sm font-semibold text-textSecondary transition-colors duration-200 hover:text-textPrimary ${focusRing}`;

const UPLOAD_STEPS = [
  "Log in to the UCC AIMS - Student Portal.",
  "Open the Profile tab.",
  "Click Printer-friendly format. The application form will appear.",
  "Download it, or take a screenshot of it.",
  "Upload it below.",
];

function UploadInstructions() {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-textPrimary">
        Where to find your application form
      </h3>
      <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-textSecondary marker:text-textMuted">
        {UPLOAD_STEPS.map((step, index) => (
          <ScrollReveal key={step} as="li" variants={scrollStair as any} custom={index}>
            {step}
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}

type RegisterFormProps = {
  onSuccess: (message: string) => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [readStatus, setReadStatus] = useState<ReadStatus>("idle");
  const [readMessage, setReadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [values, setValues] = useState<DetailValues>(EMPTY_DETAIL_VALUES);
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingMedical, setPendingMedical] = useState<MedicalValues | null>(null);
  const [pendingResultFiles, setPendingResultFiles] = useState<File[]>([]);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmCooldown, setConfirmCooldown] = useState(0);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (confirmCooldown <= 0) return;
    const timer = setInterval(() => {
      setConfirmCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [confirmCooldown]);

  const isLastStep = stepIndex === MEDICAL_STEP;
  const currentGroup =
    stepIndex >= 1 && stepIndex < MEDICAL_STEP ? DETAIL_GROUPS[stepIndex - 1] : null;
  const isReading = readStatus === "reading";
  const canContinueFromUpload =
    skipped || (Boolean(file) && (readStatus === "done" || readStatus === "error") && !isReading);

  const update = (key: DetailKey, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const moveTo = (index: number) => {
    setSubmitError(null);
    setShowErrors(false);
    setStepIndex(index);
  };

  const handleFile = async (selected: File) => {
    if (!ACCEPTED_FORM_TYPES.test(selected.type)) {
      setUploadError("Upload an image or PDF of the application form.");
      return;
    }

    setUploadError(null);
    setSkipped(false);
    setFile(selected);
    setPreview(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null);
    setReadStatus("reading");
    setReadMessage(null);

    try {
      const data = await readApplicationForm(selected);
      setValues((prev) => mergeExtracted(prev, data));

      const extractedId = data.patient_id?.trim() ?? "";
      const hasValidId = extractedId !== "" && getStudentIdError(extractedId) === null;

      if (hasValidId) {
        setReadStatus("done");
        setReadMessage("We filled in your details from the form. Check them on the next steps.");
      } else {
        setReadStatus("error");
        setReadMessage(
          "We could not find a valid student ID on this form. You can continue and enter your details manually, or upload a clearer photo or PDF."
        );
      }
    } catch {
      setReadStatus("error");
      setReadMessage("We could not read this form. You can continue and enter your details manually, or upload a clearer photo or PDF.");
    }
  };

  // TEMP: skips the upload so the rest of the form can be tested.
  const skipUpload = () => {
    setSkipped(true);
    setUploadError(null);
    moveTo(1);
  };

  const goNext = () => {
    if (stepIndex === 0) {
      if (canContinueFromUpload) moveTo(1);
      return;
    }
    if (currentGroup) {
      if (hasGroupErrors(currentGroup, values)) {
        setShowErrors(true);
        return;
      }
      moveTo(stepIndex + 1);
    }
  };

  const goBack = () => moveTo(Math.max(0, stepIndex - 1));

  const handleConfirmEmail = async () => {
    const email = values.email?.trim();
    if (!email) return;
    setConfirming(true);
    try {
      await apiClient(API_ENDPOINTS.patient.confirm_email, {
        method: "POST",
        data: new URLSearchParams({ email }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setConfirmCooldown(60);
    } catch (e) {
      // ignore; cooldown not started
    } finally {
      setConfirming(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastStep) return;
    setSubmitError(null);

    if (!skipped && !file) {
      setSubmitError("Upload the application form before submitting.");
      moveTo(0);
      return;
    }

    const invalidIndex = DETAIL_GROUPS.findIndex((group) => hasGroupErrors(group, values));
    if (invalidIndex >= 0) {
      moveTo(invalidIndex + 1);
      setShowErrors(true);
      setSubmitError("Some details are missing. Complete them before submitting.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const missing = REQUIRED_MEDICAL.filter((name) => !String(fd.get(name) ?? "").trim());
    if (missing.length > 0) {
      setSubmitError("Complete the required items in Medical history.");
      return;
    }

    setPendingMedical(formDataToMedical(fd));
    const resultFiles = fd.getAll("result_attachments").filter(
      (v): v is File => v instanceof File
    );
    setPendingResultFiles(resultFiles);
    setIsAgreementOpen(true);
  };

  const handleAgreementAccepted = async () => {
    setIsAgreementOpen(false);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const details = resolveDetails(values);
      const body = new FormData();
      if (file) body.append("application_form", file);
      pendingResultFiles.forEach((f) => body.append("result_attachments", f));
      body.append(
        "data",
        JSON.stringify({
          ...details,
          age: calculateAge(values.birthday),
          medical_history: pendingMedical ?? {},
          accepted_terms: true,
          accepted_at: new Date().toISOString(),
        })
      );
      const res = await fetch(`${getApiUrl()}${API_ENDPOINTS.patient.pre_register}`, { method: "POST", body });
      if (!res.ok) throw new Error("Submission failed. Please try again.");
      onSuccess(
        `Your application was submitted. We will email ${details.email} once an admin approves your account.`
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative mt-8 flex w-full flex-col gap-6 text-left"
    >
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-textMuted">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span className="font-medium text-textPrimary">{STEPS[stepIndex]}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {submitError ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger"
        >
          {submitError}
        </p>
      ) : null}

      <Reveal key={stepIndex} className="flex flex-col gap-6">
        {stepIndex === 0 && (
          <>
            <UploadInstructions />

            <ApplicationFormUpload
              file={file}
              preview={preview}
              status={readStatus}
              message={readMessage}
              error={uploadError}
              onSelect={handleFile}
            />

            {SHOW_SKIP_UPLOAD && !file && (
              <button
                type="button"
                onClick={skipUpload}
                className={`self-start rounded text-sm font-medium text-textMuted underline underline-offset-4 transition-colors duration-200 hover:text-primary ${focusRing}`}
              >
                Skip upload
              </button>
            )}
          </>
        )}

        {currentGroup && (
          <RegisterDetailsStep
            group={currentGroup}
            values={values}
            errors={getGroupErrors(currentGroup, values)}
            showErrors={showErrors}
            onChange={update}
            onConfirmEmail={handleConfirmEmail}
            confirmCooldown={confirmCooldown}
            confirming={confirming}
          />
        )}

        {isLastStep && <MedicalHistoryForm sex={values.sex} />}
      </Reveal>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {stepIndex > 0 ? (
          <button type="button" onClick={goBack} className={secondaryButton}>
            Back
          </button>
        ) : (
          <span />
        )}

        {!isLastStep ? (
          <button
            type="button"
            onClick={goNext}
            disabled={stepIndex === 0 && !canContinueFromUpload}
            className={primaryButton}
          >
            Next
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className={primaryButton}>
            {isSubmitting ? "Submitting..." : "Submit application"}
          </button>
        )}
      </div>

      {isAgreementOpen && (
        <TermsAgreementModal
          onAccept={handleAgreementAccepted}
          onCancel={() => setIsAgreementOpen(false)}
        />
      )}
    </form>
  );
}