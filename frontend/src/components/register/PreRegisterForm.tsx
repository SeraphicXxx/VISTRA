import { useMemo, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, IdCard, LoaderCircle, Mail, User } from "lucide-react";
import {
  TextField,
  focusRing,
  getIdError,
  getRoleFromId,
} from "/@/components/register/authShared";

type PreRegisterFormProps = {
  onSuccess: (message: string) => void;
};

export function PreRegisterForm({ onSuccess }: PreRegisterFormProps) {
  const [idNumber, setIdNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const role = useMemo(() => getRoleFromId(idNumber), [idNumber]);

  const errors = {
    idNumber: getIdError(idNumber),
    fullName: fullName.trim() ? null : "Enter your full name.",
    email: /^\S+@\S+\.\S+$/.test(email) ? null : "Enter a valid email address.",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const shown = (key: keyof typeof errors) => (submitAttempted ? errors[key] : null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);
    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/patients/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber: idNumber.trim(),
          fullName: fullName.trim(),
          email: email.trim(),
        }),
      });
      if (!res.ok) throw new Error("Pre-registration failed. Please try again.");
      onSuccess("You will get an email once your account is ready.");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Pre-registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      <TextField
        id="pre-idNumber"
        label="ID Number"
        value={idNumber}
        onChange={setIdNumber}
        icon={IdCard}
        placeholder="e.g. 202XXXXX-S"
        autoComplete="off"
        error={shown("idNumber")}
        hint={role ? `Detected: ${role}` : "Format: 8-digit number + suffix -S, -F, or -U."}
      />

      <TextField
        id="pre-fullName"
        label="Full name"
        value={fullName}
        onChange={setFullName}
        icon={User}
        autoComplete="name"
        error={shown("fullName")}
      />

      <TextField
        id="pre-email"
        label="Email"
        type="email"
        inputMode="email"
        value={email}
        onChange={setEmail}
        icon={Mail}
        autoComplete="email"
        placeholder="you@example.com"
        error={shown("email")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`group mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-primaryDark hover:shadow-lg active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
      >
        {isSubmitting ? "Submitting..." : "Pre-register"}
        {isSubmitting ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
        )}
      </button>
    </form>
  );
}