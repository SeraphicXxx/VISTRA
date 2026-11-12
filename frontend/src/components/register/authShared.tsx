import type { ReactNode } from "react";
import { Calendar, FileText, Users, type LucideIcon } from "lucide-react";
import { ROUTES } from "/@/config/RoutePaths.js";
import { Logo } from "/@/components/Logo.jsx";
import { PATIENT_ID_PATTERN } from "/@/hooks/UsePatientLogin";
import { AdminAnimStyles, HeartbeatLine, LiveDot } from "/@/components/adminanim";
import campusImage from "/@/assets/images/campus-background.jpg";

const ROLE_LABELS: Record<string, string> = {
  S: "Student",
  F: "Faculty",
  U: "University Staff",
};

const panelPoints = [
  { icon: Calendar, label: "Book and track appointments" },
  { icon: Users, label: "See your place in the queue" },
  { icon: FileText, label: "View your medical records" },
];

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const fieldClass =
  "w-full rounded-xl border bg-background py-3.5 text-base text-textPrimary placeholder:text-textMuted transition-all duration-200 hover:border-primary/30 focus:outline-none focus:ring-2";

export const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-textMuted transition-colors duration-200 group-focus-within/field:text-primary";

export function getRoleFromId(id: string): string | null {
  const match = id.trim().match(PATIENT_ID_PATTERN);
  if (!match) return null;
  const suffix = id.trim().slice(-1).toUpperCase();
  return ROLE_LABELS[suffix] ?? null;
}

export function getIdError(id: string): string | null {
  const value = id.trim();
  if (!value) return "Enter your ID number.";
  if (!PATIENT_ID_PATTERN.test(value)) {
    return "Enter an 8-digit ID followed by -S (Student), -F (Faculty), or -U (University Staff).";
  }
  return null;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  error?: string | null;
  hint?: string;
  trailing?: ReactNode;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  error,
  hint,
  trailing,
}: TextFieldProps) {
  const showError = Boolean(error);
  const message = showError ? error : hint;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-left text-sm font-semibold uppercase tracking-wide text-textMuted"
      >
        {label}
      </label>
      <div className="group/field relative">
        <Icon className={iconClass} strokeWidth={2} />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={showError}
          aria-describedby={message ? `${id}-msg` : undefined}
          className={`${fieldClass} pl-12 ${trailing ? "pr-12" : "pr-4"} ${
            showError
              ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
              : "border-border focus:border-primary/50 focus:ring-primary/20"
          }`}
        />
        {trailing}
      </div>
      {message ? (
        <p
          id={`${id}-msg`}
          role={showError ? "alert" : undefined}
          className={`mt-2 text-left text-sm leading-relaxed ${
            showError ? "text-danger" : "text-textMuted"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
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
          <li key={label} className="flex items-center gap-4 text-base text-white/90">
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
          <HeartbeatLine className="text-white" heightClass="h-16" delay={-1.4} />
        </div>
      </div>
    </aside>
  );
}

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const homeHref = ROUTES.patient?.dashboard?.overview ?? "/";

  return (
    <div className="page-in min-h-screen bg-[linear-gradient(135deg,#e3f6f2_0%,#f3fafa_45%,#e6f1fb_100%)]">
      <AdminAnimStyles />

      <main className="relative flex min-h-screen w-full items-stretch overflow-hidden">
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-surface lg:grid lg:grid-cols-[2fr_3fr]">
          <LoginPanel />

          <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden lg:order-1">
            <div className="bar-grow absolute inset-x-0 top-0 h-1 bg-primary lg:hidden" aria-hidden="true" />

            <div className="relative flex w-full max-w-md flex-col items-center px-8 py-12 text-center sm:px-10">
              <div className="reveal-group flex flex-col items-center">
                <a href={homeHref} className={`hover-pop rounded-md ${focusRing}`}>
                  <Logo className="h-12" />
                </a>

                <h1 className="mt-8 font-heading text-4xl font-semibold leading-tight tracking-tight text-textPrimary">
                  {title}
                </h1>

                <p className="mt-3 text-base leading-relaxed text-textSecondary">{subtitle}</p>
              </div>

              {children}

              <p className="fade-in-up -mx-12 mt-10 text-xs leading-relaxed text-textMuted [animation-delay:1.1s] sm:-mx-14">
                Access is limited to registered students, faculty, and university staff.
                Contact your administrator if you need an account.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}