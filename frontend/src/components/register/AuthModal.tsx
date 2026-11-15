import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";
import { focusRing } from "/@/components/register/authShared";

function useModalBehavior(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);
}

type AuthModalProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export function AuthModal({ title, subtitle, onClose, children }: AuthModalProps) {
  useModalBehavior(onClose);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-textPrimary/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface px-6 py-10 shadow-card sm:px-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-4 top-4 rounded-md p-1 text-textMuted transition-colors duration-200 hover:text-textPrimary ${focusRing}`}
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="text-center">
          <h2
            id="auth-modal-title"
            className="font-heading text-3xl font-semibold leading-tight tracking-tight text-primaryDark"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-base leading-relaxed text-textSecondary">{subtitle}</p>
          ) : null}
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}

type SuccessModalProps = {
  title: string;
  message: string;
  actionLabel: string;
  onClose: () => void;
};

export function SuccessModal({ title, message, actionLabel, onClose }: SuccessModalProps) {
  useModalBehavior(onClose);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-textPrimary/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-message"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-surface p-8 text-center shadow-card"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-4 top-4 rounded-md p-1 text-textMuted transition-colors duration-200 hover:text-textPrimary ${focusRing}`}
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={2} />
        </span>

        <h2
          id="success-modal-title"
          className="mt-5 font-heading text-2xl font-semibold text-textPrimary"
        >
          {title}
        </h2>

        <p id="success-modal-message" className="mt-3 text-base leading-relaxed text-textSecondary">
          {message}
        </p>

        <button
          type="button"
          autoFocus
          onClick={onClose}
          className={`mt-8 w-full rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-card transition-colors duration-200 hover:bg-primaryDark ${focusRing}`}
        >
          {actionLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}