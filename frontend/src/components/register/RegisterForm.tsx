import { useEffect, useRef, useState, type FormEvent } from "react";
import { TermsAgreementModal } from "/@/components/legal/TermsAgreementModal";
import { focusRing } from "/@/components/register/authShared";
import { primaryButton, secondaryButton } from "/@/components/button";
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
import RegistrationPreview, {
  buildSummarySections,
} from "/@/components/register/RegistrationPreview";
import { addPending } from "/@/components/register/pendingStore";
import {
  Reveal,
  ScrollReveal,
  scrollStair,
} from "/@/components/landinganim";

// TEMP: set to false, or delete this flag and the skip button below, when testing is done.
const SHOW_SKIP_UPLOAD = true;

const DRAFT_KEY = "register-draft-v1";
const MEDICAL_KEY = "register-medical-v1";

function readStorage<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked. The form still works without saving.
  }
}

const STEPS = [
  "Application form",
  ...DETAIL_GROUPS.map((group) => group.title),
  "Medical history",
];

const MEDICAL_STEP = STEPS.length - 1;

// Must match the fields in MedicalHistoryForm, or submission is blocked.
const REQUIRED_MEDICAL = [
  "smoking",
  "vaping",
  "alcohol_intake",
  "heart_rate",
  "temperature",
  "spo2",
  "weight",
  "height",
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
  const res = await fetch("/api/ocr/application-form", { method: "POST", body });
  if (!res.ok) throw new Error("Could not read the form.");
  return (await res.json()) as ExtractedForm;
}

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
          <ScrollReveal key={step} as="li" variants={scrollStair} custom={index}>
            {step}
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}

type RegisterFormProps = {
  onSuccess: (message: string) => void;
  onReviewChange?: (inReview: boolean) => void;
};

export function RegisterForm({ onSuccess, onReviewChange }: RegisterFormProps) {
  const [draft] = useState(() =>
    readStorage<{ stepIndex: number; values: DetailValues; skipped: boolean }>(DRAFT_KEY)
  );

  const formRef = useRef<HTMLFormElement>(null);

  const [stepIndex, setStepIndex] = useState(draft?.stepIndex ?? 0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(draft?.skipped ?? false);
  const [readStatus, setReadStatus] = useState<ReadStatus>("idle");
  const [readMessage, setReadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [values, setValues] = useState<DetailValues>(draft?.values ?? EMPTY_DETAIL_VALUES);
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingMedical, setPendingMedical] = useState<MedicalValues | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Report review state to the parent so it can update the page heading.
  useEffect(() => {
    onReviewChange?.(showPreview);
  }, [showPreview, onReviewChange]);

  // Save the step, details, and upload flag whenever they change.
  useEffect(() => {
    writeStorage(DRAFT_KEY, { stepIndex, values, skipped });
  }, [stepIndex, values, skipped]);

  // Restore medical answers when that step appears, since its inputs mount only then.
  useEffect(() => {
    if (stepIndex !== MEDICAL_STEP || !formRef.current) return;
    const saved = readStorage<MedicalValues>(MEDICAL_KEY);
    if (!saved) return;

    Object.entries(saved).forEach(([name, saidValue]) => {
      const answers = Array.isArray(saidValue) ? saidValue : [saidValue];
      formRef.current
        ?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          `[name="${name}"]`
        )
        .forEach((el) => {
          if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox")) {
            el.checked = answers.includes(el.value);
          } else {
            el.value = answers[0] ?? "";
          }
        });
    });
  }, [stepIndex]);

  // Save medical answers as the user types or picks an option.
  const saveMedical = () => {
    if (!formRef.current) return;
    writeStorage(MEDICAL_KEY, formDataToMedical(new FormData(formRef.current)));
  };

  const isLastStep = stepIndex === MEDICAL_STEP;
  const currentGroup =
    stepIndex >= 1 && stepIndex < MEDICAL_STEP ? DETAIL_GROUPS[stepIndex - 1] : null;
  const isReading = readStatus === "reading";
  const canContinueFromUpload =
    skipped || (Boolean(file) && readStatus === "done" && !isReading);

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
          "We could not find a valid student ID on this form. Upload a clearer photo or PDF."
        );
      }
    } catch {
      setReadStatus("error");
      setReadMessage("We could not read this form. Upload a clearer photo or PDF.");
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

    // Save the answers, then show the review screen. Terms come after the review.
    setPendingMedical(formDataToMedical(fd));
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditPreview = () => {
    setSubmitError(null);
    setShowPreview(false);
  };

  const handleConfirmPreview = () => {
    setIsAgreementOpen(true);
  };

  const handleAgreementAccepted = () => {
    setIsAgreementOpen(false);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const details = resolveDetails(values);
      addPending(
        {
          ...details,
          age: calculateAge(values.birthday),
          accepted_terms: true,
          accepted_at: new Date().toISOString(),
        },
        pendingMedical ?? {}
      );

      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.removeItem(MEDICAL_KEY);

      onSuccess(
        `Your application was submitted. We will email ${details.email} once an admin approves your account.`
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const summarySections = showPreview
    ? buildSummarySections(resolveDetails(values), pendingMedical ?? {})
    : [];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={saveMedical}
      noValidate
      className="relative mt-8 flex w-full flex-col gap-6 text-left"
    >
      {submitError ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger"
        >
          {submitError}
        </p>
      ) : null}

      {/* Stays mounted while the review shows, so the medical answers are kept. */}
      <div className={showPreview ? "hidden" : "flex flex-col gap-6"}>
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
            />
          )}

          {isLastStep && <MedicalHistoryForm sex={values.sex} />}
        </Reveal>

        <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-border bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
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
            <button type="submit" className={primaryButton}>
              Review application
            </button>
          )}
        </div>
      </div>

      {showPreview && (
        <RegistrationPreview
          sections={summarySections}
          onEdit={handleEditPreview}
          onConfirm={handleConfirmPreview}
          isSubmitting={isSubmitting}
        />
      )}

      {isAgreementOpen && (
        <TermsAgreementModal
          onAccept={handleAgreementAccepted}
          onCancel={() => setIsAgreementOpen(false)}
        />
      )}
    </form>
  );
}