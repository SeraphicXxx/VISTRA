import React, { useState, useMemo, type ChangeEvent, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
  ShieldCheck,
  IdCard,
} from "lucide-react";
import { ROUTES } from "/@/config/RoutePaths.js";
import { Logo } from "/@/components/Logo.jsx";
import { useLogin, useLoginForm } from "/@/hooks/UseLogin.js";

const ID_PATTERN = /^\d{8}-[SFA]$/i;

const ROLE_LABELS: Record<string, string> = {
  S: "Student",
  F: "Faculty",
  A: "Admin",
};

function getRoleFromId(id: string): string | null {
  const match = id.trim().match(ID_PATTERN);
  if (!match) return null;
  const suffix = id.trim().slice(-1).toUpperCase();
  return ROLE_LABELS[suffix] ?? null;
}

export default function AdminLoginPage() {
  const { credentials, handleChange } = useLoginForm();
  const { login, isLoading, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [idTouched, setIdTouched] = useState(false);

  const idNumber: string = credentials.idNumber ?? credentials.staffId ?? "";
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
    await login(credentials);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen items-center justify-center py-10">
        <div className="relative w-full max-w-md px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="h-1 w-full bg-primary" aria-hidden="true"></div>

            <div className="flex flex-col items-center px-8 pt-8 text-center">
              <a href={ROUTES.admin.dashboard.overview}>
                <Logo className="h-11" />
              </a>

              <h1 className="mt-6 font-heading text-2xl font-semibold leading-tight tracking-tight text-textPrimary">
                Campus Login
              </h1>

              <p className="mt-2 max-w-xs text-xs leading-relaxed text-textSecondary">
                Sign in with your Student, Faculty, or Admin Number to access appointments, queues, and medical records.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="relative p-8">
              {error ? (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                  <span>{error}</span>
                </div>
              ) : null}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="idNumber"
                    className="block text-xs font-semibold uppercase tracking-wide text-textMuted"
                  >
                    ID Number
                  </label>

                  {detectedRole ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {detectedRole}
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <IdCard
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                    strokeWidth={2}
                  />
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
                    className={`w-full rounded-xl border bg-background py-3 pl-10 pr-3.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:outline-none focus:ring-2 ${
                      idTouched && !isIdValid
                        ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
                        : "border-border focus:border-primary/50 focus:ring-primary/20"
                    }`}
                  />
                </div>

                <p
                  id="idNumber-hint"
                  className={`mt-1.5 text-xs leading-relaxed ${
                    idTouched && !isIdValid ? "text-danger" : "text-textMuted"
                  }`}
                >
                  {idTouched && !isIdValid
                    ? "Enter an 8-digit ID followed by -S (Student), -F (Faculty), or -A (Admin)."
                    : "Format: 8-digit number + campus suffix  — -S, -C, or -N."}
                </p>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wide text-textMuted"
                  >
                    Password
                  </label>

                  <a
                    href="#forgot-password"
                    className="text-xs font-medium text-primary transition-colors duration-200 hover:text-primaryDark"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                    strokeWidth={2}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-10 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted transition-colors duration-200 hover:text-textSecondary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-textSecondary">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                />
                Keep me signed in on this device
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-colors duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}

                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>

              <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-textMuted">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                Records are encrypted and scoped to your role.
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-textMuted">
            Access is limited to registered students, faculty, and admins. Contact your administrator if you need an account.
          </p>
        </div>
      </main>
    </div>
  );
}