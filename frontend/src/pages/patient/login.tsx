import React, {
  useState,
  useMemo,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Eye,
  EyeOff,
  FileText,
  Lock,
  LoaderCircle,
  ShieldCheck,
  IdCard,
  Users,
} from "lucide-react";
import { ROUTES } from "/@/config/RoutePaths.js";
import { Logo } from "/@/components/Logo.jsx";
import {
  PATIENT_ID_PATTERN,
  usePatientLogin,
  usePatientLoginForm,
} from "/@/hooks/UsePatientLogin";
import { useNavigate } from "react-router-dom";
import {
  AdminAnimStyles,
  HeartbeatLine,
  LiveDot,
} from "/@/components/adminanim";
import campusImage from "/@/assets/images/campus-background.jpg";

const ID_PATTERN = PATIENT_ID_PATTERN;

const ROLE_LABELS: Record<string, string> = {
  S: "Student",
  F: "Faculty",
  A: "Admin",
};

const panelPoints = [
  { icon: Calendar, label: "Book and track appointments" },
  { icon: Users, label: "See your place in the queue" },
  { icon: FileText, label: "View your medical records" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const fieldClass =
  "w-full rounded-xl border bg-background py-3.5 text-base text-textPrimary placeholder:text-textMuted transition-all duration-200 hover:border-primary/30 focus:outline-none focus:ring-2";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-textMuted transition-colors duration-200 group-focus-within/field:text-primary";

function getRoleFromId(id: string): string | null {
  const match = id.trim().match(ID_PATTERN);
  if (!match) return null;
  const suffix = id.trim().slice(-1).toUpperCase();
  return ROLE_LABELS[suffix] ?? null;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function LoginPanel() {
  return (
    <aside className="panel-in relative hidden overflow-hidden bg-primaryDark text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-[position:center] opacity-[0.3]"
        style={{ backgroundImage: `url(${campusImage})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primaryDark/90 via-primaryDark/85 to-primaryDark/95" />
      <div className="bg-grid grid-drift pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_20%_20%,black,transparent)]" />
      <div className="glow-pulse pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

      <div className="reveal-group relative p-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
          <LiveDot className="bg-white" />
          Clinic is open
        </span>

        <h2 className="mt-8 font-heading text-4xl font-semibold leading-[1.1] tracking-tight">
          {greeting()}.
          <br />
          Your health, in one place.
        </h2>

        <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80">
          Sign in to book a visit, check the queue, and see your records.
        </p>
      </div>

      <ul className="stagger-group relative space-y-4 px-12">
        {panelPoints.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-4 text-base text-white/90"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <div className="relative pb-8 pt-12" aria-hidden="true">
        <HeartbeatLine className="text-white" heightClass="h-16" delay={0} />
        <div className="-mt-6 opacity-50">
          <HeartbeatLine
            className="text-white"
            heightClass="h-16"
            delay={-1.4}
          />
        </div>
      </div>
    </aside>
  );
}

export default function PatientLoginPage() {
  const navigate = useNavigate();
  const { credentials, handleChange, toRequest } = usePatientLoginForm();
  const { login, isLoading, isError, error } = usePatientLogin();

  const homeHref = ROUTES.patient?.dashboard?.overview ?? "/";

  const [showPassword, setShowPassword] = useState(false);
  const [idTouched, setIdTouched] = useState(false);

  const idNumber: string = credentials.idNumber ?? "";
  const isIdValid = idNumber.length === 0 || ID_PATTERN.test(idNumber.trim());
  const detectedRole = useMemo(() => getRoleFromId(idNumber), [idNumber]);

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };

  const handleIdBlur = () => setIdTouched(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIdTouched(true);
    if (!ID_PATTERN.test(idNumber.trim())) return;
    if (!credentials.password) return;
    try {
      // Auth: POST /auth/login/ with { identifier, password }.
      await login(toRequest());
      navigate(homeHref);
    } catch {}
  };

  return (
    <div className="page-in min-h-screen bg-[linear-gradient(135deg,#e3f6f2_0%,#f3fafa_45%,#e6f1fb_100%)]">
      <AdminAnimStyles />

      <main className="relative flex min-h-screen w-full items-stretch overflow-hidden">
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-surface lg:grid lg:grid-cols-[2fr_3fr]">
          <LoginPanel />

          <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden lg:order-1">
            <div
              className="bar-grow absolute inset-x-0 top-0 h-1 bg-primary lg:hidden"
              aria-hidden="true"
            />

            <div className="relative flex w-full max-w-md flex-col items-center px-8 py-12 text-center sm:px-10">
              <div className="reveal-group flex flex-col items-center">
                <a
                  href={homeHref}
                  className={`hover-pop rounded-md ${focusRing}`}
                >
                  <Logo className="h-12" />
                </a>

                <h1 className="mt-8 font-heading text-4xl font-semibold leading-tight tracking-tight text-textPrimary">
                  Sign in to your account
                </h1>

                <p className="mt-3 text-base leading-relaxed text-textSecondary">
                  Use your Student, Faculty, or Admin number.
                </p>
              </div>

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
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 shrink-0"
                      strokeWidth={2}
                    />
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
                      id="idNumber"
                      name="idNumber"
                      type="text"
                      inputMode="text"
                      autoComplete="username"
                      value={idNumber}
                      onChange={handleIdChange}
                      onBlur={handleIdBlur}
                      placeholder="e.g. 20230518-S"
                      aria-invalid={idTouched && !isIdValid}
                      aria-describedby="idNumber-hint"
                      className={`${fieldClass} pl-12 pr-4 ${
                        idTouched && !isIdValid
                          ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
                          : "border-border focus:border-primary/50 focus:ring-primary/20"
                      }`}
                    />
                  </div>

                  <p
                    id="idNumber-hint"
                    className={`mt-2 text-sm leading-relaxed transition-colors duration-200 ${
                      idTouched && !isIdValid ? "text-danger" : "text-textMuted"
                    }`}
                  >
                    {idTouched && !isIdValid
                      ? "Enter an 8-digit ID followed by -S (Student), -F (Faculty), or -A (Admin)."
                      : "Format: 8-digit number + suffix -S, -F, or -A."}
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

                    <a
                      href="#forgot-password"
                      className={`link-underline rounded text-sm font-medium text-primary hover:text-primaryDark ${focusRing}`}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <div className="group/field relative">
                    <Lock className={iconClass} strokeWidth={2} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`${fieldClass} border-border pl-12 pr-12 focus:border-primary/50 focus:ring-primary/20`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 rounded text-textMuted transition-all duration-200 hover:scale-110 hover:text-primary ${focusRing}`}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" strokeWidth={2} />
                      ) : (
                        <Eye className="h-5 w-5" strokeWidth={2} />
                      )}
                    </button>
                  </div>
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
                  <ShieldCheck
                    className="h-4 w-4 text-primary"
                    strokeWidth={2}
                  />
                  Records are encrypted and scoped to your role.
                </p>
              </form>
              <p className="fade-in-up -mx-12 mt-10 text-xs text-textMuted [animation-delay:1.1s] sm:-mx-14">
                Access is limited to registered students, faculty, and admins.
                Contact your administrator if you need an account.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
