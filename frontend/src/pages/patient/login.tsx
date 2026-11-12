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
import { useNavigate } from "react-router-dom";
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
import { AuthModal, SuccessModal } from "/@/components/register/AuthModal";
import { RegisterForm } from "/@/components/register/RegisterForm";
import { PreRegisterForm } from "/@/components/register/PreRegisterForm";

type FormModal = "register" | "preregister";

type SuccessState = { title: string; message: string } | null;

const switchButtonClass = `rounded font-semibold text-primary transition-colors duration-200 hover:text-primaryDark ${focusRing}`;

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
  const [openModal, setOpenModal] = useState<FormModal | null>(null);
  const [success, setSuccess] = useState<SuccessState>(null);

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

  const handleFormSuccess = (title: string, message: string) => {
    setOpenModal(null);
    setSuccess({ title, message });
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Use your Student, Faculty, or University Staff number."
    >
      <form onSubmit={handleSubmit} noValidate className="form-stagger relative mt-8 w-full text-left">
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
            <label htmlFor="idNumber" className="block text-sm font-semibold uppercase tracking-wide text-textMuted">
              ID Number
            </label>

            {detectedRole ? (
              <span key={detectedRole} className="row-in rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
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
            {showIdError ? idMessage : "Format: 8-digit number + suffix -S, -F, or -U."}
          </p>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-semibold uppercase tracking-wide text-textMuted">
              Password
            </label>

            <a href="#forgot-password" className={`link-underline rounded text-sm font-medium text-primary hover:text-primaryDark ${focusRing}`}>
              Forgot password?
            </a>
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
              {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2} /> : <Eye className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>

          {showPasswordError ? (
            <p id="password-error" role="alert" className="mt-2 text-left text-sm text-danger">
              {passwordMessage}
            </p>
          ) : null}
        </div>

        <label className="group mt-5 flex w-fit cursor-pointer items-center gap-2.5 text-base text-textSecondary transition-colors duration-200 hover:text-textPrimary">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-border text-primary transition-transform duration-200 focus:ring-primary/30 group-hover:scale-110"
          />
          Keep me signed in on this device
        </label>

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

      <p className="mt-8 text-sm text-textSecondary">
        Don't have an account?{" "}
        <button type="button" onClick={() => setOpenModal("register")} className={switchButtonClass}>
          Register
        </button>
        {" · "}
        <button type="button" onClick={() => setOpenModal("preregister")} className={switchButtonClass}>
          Pre-register
        </button>
      </p>

      {openModal === "register" && (
        <AuthModal
          title="Create your account"
          subtitle="Upload your school ID and we will fill in your details."
          onClose={() => setOpenModal(null)}
        >
          <RegisterForm
            onSuccess={(message) => handleFormSuccess("Account created", message)}
          />
        </AuthModal>
      )}

      {openModal === "preregister" && (
        <AuthModal
          title="Pre-register"
          subtitle="Reserve your account before your first clinic visit."
          onClose={() => setOpenModal(null)}
        >
          <PreRegisterForm
            onSuccess={(message) => handleFormSuccess("Pre-registration received", message)}
          />
        </AuthModal>
      )}

      {success && (
        <SuccessModal
          title={success.title}
          message={success.message}
          actionLabel="Continue"
          onClose={() => setSuccess(null)}
        />
      )}

      {isAgreementOpen && (
        <TermsAgreementModal
          onAccept={handleAgreementAccepted}
          onCancel={() => setIsAgreementOpen(false)}
        />
      )}
    </AuthLayout>
  );
}