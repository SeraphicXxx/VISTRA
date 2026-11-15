import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "/@/config/RoutePaths.js";
import { usePatientLogin, usePatientLoginForm } from "/@/hooks/UsePatientLogin";
import { TermsAgreementModal } from "/@/components/legal/TermsAgreementModal";
import {
  AuthLayout,
  fieldClass,
  focusRing,
  getIdError,
  getRoleFromId,
  iconClass,
} from "/@/components/register/authShared";

const switchLinkClass = `rounded font-semibold text-primary transition-colors duration-200 hover:text-primaryDark ${focusRing}`;

export default function PatientLoginPage() {
  const navigate = useNavigate();
  const { credentials, handleChange, toRequest } = usePatientLoginForm();
  const { login, isLoading, isError, error } = usePatientLogin();

  const homeHref = ROUTES.patient?.dashboard?.overview ?? "/";

  const idInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [idTouched, setIdTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  const idNumber: string = credentials.idNumber ?? "";
  const idMessage = getIdError(idNumber);
  const passwordMessage = credentials.password ? null : "Enter your password.";
  const showIdError = Boolean(idMessage) && (idTouched || submitAttempted);
  const showPasswordError = Boolean(passwordMessage) && submitAttempted;
  const detectedRole = useMemo(() => getRoleFromId(idNumber), [idNumber]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setIdTouched(true);

    if (idMessage) {
      idInputRef.current?.focus();
      return;
    }
    if (passwordMessage) {
      passwordInputRef.current?.focus();
      return;
    }
    setIsAgreementOpen(true);
  };

  const handleAgreementAccepted = async () => {
    setIsAgreementOpen(false);
    try {
      await login({
        ...toRequest(),
        accepted_terms: true,
        accepted_at: new Date().toISOString(),
      });
      navigate(homeHref);
    } catch {}
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Use your Student, Faculty, or University Staff number."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="form-stagger relative mt-8 w-full text-left"
      >
        {isError && error ? (
          <div
            key={String(error)}
            role="alert"
            className="shake mb-6 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        ) : null}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="idNumber"
              className="block text-sm font-semibold uppercase tracking-wide text-textMuted"
            >
              ID Number
            </label>

            {detectedRole ? (
              <span
                key={detectedRole}
                className="row-in rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {detectedRole}
              </span>
            ) : null}
          </div>

          <div className="group/field relative">
            <IdCard className={iconClass} strokeWidth={2} />
            <input
              ref={idInputRef}
              id="idNumber"
              name="idNumber"
              type="text"
              inputMode="text"
              autoComplete="username"
              value={idNumber}
              onChange={handleChange}
              onBlur={() => setIdTouched(true)}
              placeholder="e.g. 202XXXXX-S"
              aria-invalid={showIdError}
              aria-describedby="idNumber-hint"
              className={`${fieldClass} pl-12 pr-4 ${
                showIdError
                  ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
                  : "border-border focus:border-primary/50 focus:ring-primary/20"
              }`}
            />
          </div>

          <p
            id="idNumber-hint"
            role={showIdError ? "alert" : undefined}
            className={`mt-2 text-left text-sm leading-relaxed transition-colors duration-200 ${
              showIdError ? "text-danger" : "text-textMuted"
            }`}
          >
            {showIdError
              ? idMessage
              : "Format: 8-digit number + suffix -S, -F, or -U."}
          </p>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold uppercase tracking-wide text-textMuted"
            >
              Password
            </label>
          </div>

          <div className="group/field relative">
            <Lock className={iconClass} strokeWidth={2} />
            <input
              ref={passwordInputRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              aria-invalid={showPasswordError}
              aria-describedby="password-error"
              className={`${fieldClass} pl-12 pr-12 ${
                showPasswordError
                  ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
                  : "border-border focus:border-primary/50 focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 rounded text-textMuted transition-all duration-200 hover:scale-110 hover:text-primary ${focusRing}`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>

          {showPasswordError ? (
            <p
              id="password-error"
              role="alert"
              className="mt-2 text-left text-sm text-danger"
            >
              {passwordMessage}
            </p>
          ) : null}
        </div>
        <div className="mt-3 flex flex-col items-center justify-between gap-2 sm:flex-row ">
          <label className="group flex w-fit cursor-pointer select-none items-center gap-3">
            <div className="relative h-5 w-5">
              <input
                type="checkbox"
                className="peer absolute inset-0 z-10 h-4 w-4 cursor-pointer opacity-0"
              />

              <div className="absolute inset-0 flex items-center justify-center rounded-md border-2 border-border bg-white transition-all duration-200 group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20"></div>

              <svg
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-75 text-white opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10l4 4 8-8" />
              </svg>
            </div>

            <span className="text-xs text-textSecondary transition-colors duration-200 group-hover:text-textPrimary">
              Keep me signed in on this device
            </span>
          </label>
          <div className="flex items-end justify-end">
            <a
              href="#forgot-password"
              className={`link rounded text-xs font-medium text-primary hover:text-primaryDark ${focusRing}`}
            >
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn-shine group mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-primaryDark hover:shadow-lg active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
        >
          {isLoading ? "Signing in..." : "Sign in"}
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </button>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-textMuted">
          <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2} />
          Records are encrypted and scoped to your role.
        </p>
      </form>

      <p className="mt-6 text-sm text-textSecondary">
        Don't have an account?{" "}
        <Link to={ROUTES.patient.register} className={switchLinkClass}>
          Register
        </Link>
      </p>

      {isAgreementOpen && (
        <TermsAgreementModal
          onAccept={handleAgreementAccepted}
          onCancel={() => setIsAgreementOpen(false)}
        />
      )}
    </AuthLayout>
  );
}
