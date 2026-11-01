import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { generateTermsPdf } from "/@/components/legal/termsandconditionpdf";

const BRIEF_TEXT =
  "Access is limited to registered students, faculty, and staff, so keep your login private. Health risk predictions and vital sign summaries are estimates, not a diagnosis, so consult a licensed doctor or dentist for medical advice. Your personal, medical, and dental information is used to provide clinic services, kept confidential, and not sold to third parties. Only authorized clinic staff and your treating professionals can view your records, unless the law requires otherwise.";

interface TermsAgreementModalProps {
  onAccept: () => void;
  onCancel: () => void;
}

export function TermsAgreementModal({ onAccept, onCancel }: TermsAgreementModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateTermsPdf();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-agreement-title"
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-surface shadow-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id="terms-agreement-title" className="font-heading text-base font-semibold text-primaryDark">
              Before you sign in
            </h2>
            <p className="mt-0.5 text-xs text-textMuted">
              Please review the key points below before continuing.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-textSecondary hover:bg-surfaceMuted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm leading-relaxed text-textSecondary">{BRIEF_TEXT}</p>
        </div>

        <div className="space-y-4 border-t border-border px-6 py-4">
          <label className="flex items-start gap-3 text-sm text-textPrimary">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  handleDownload();
                }}
                disabled={isDownloading}
                className="font-medium text-primary underline underline-offset-4 hover:text-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                Terms and Conditions
              </button>{" "}
              and the{" "}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  handleDownload();
                }}
                disabled={isDownloading}
                className="font-medium text-primary underline underline-offset-4 hover:text-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isChecked}
              onClick={onAccept}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Agree and sign in
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}