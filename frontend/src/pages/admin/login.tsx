import React from "react";
import {
    ShieldCheck,
    User,
} from "lucide-react";
import {ROUTES} from "/@/config/RoutePaths.js";
import {Logo} from "/@/components/Logo.jsx";
import {useLogin, useLoginForm} from "/@/hooks/UseLogin.js";
import {useNavigate} from "react-router-dom";
import {FormInput, PasswordInput} from "/@/components/InputCollection";
import {LoginButton} from "/@/components/Button"

interface LoginFormProps {
  credentials: {
    email: string;
    password: string;
  };

  validationErrors: {
    email?: string;
    password?: string;
  };

  isLoading: boolean;
  isError: boolean;
  error?: string;

  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function LoginForm({
                            credentials,
                            validationErrors,
                            isLoading,
                            isError,
                            error,
                            onChange,
                            onSubmit,
                          }: LoginFormProps) {
  return (
      <form
          onSubmit={onSubmit}
          className="relative p-8"
      >
        {isError && error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
        )}

        <FormInput
            label="Staff ID"
            id="email"
            name="email"
            type="text"
            autoComplete="username"
            value={credentials.email}
            onChange={onChange}
            placeholder="e.g. UCC-2481"
            error={validationErrors.email}
            icon={
              <User
                  className="h-4 w-4"
                  strokeWidth={2}
              />
            }
        />

        <div className="mt-5">

          <PasswordInput
              value={credentials.password}
              onChange={onChange}
              error={validationErrors.password}
          />

          <div className="mb-1.5 flex items-center justify-end">
            <a
                href="#forgot-password"
                className="text-xs font-medium text-primary transition-colors duration-200 hover:text-primaryDark"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-textSecondary">
          <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />

          Keep me signed in on this device
        </label>

        <LoginButton isLoading={isLoading} />

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-textMuted">
          <ShieldCheck
              className="h-3.5 w-3.5 text-primary"
              strokeWidth={2}
          />

          Records are encrypted and scoped to your role.
        </p>
      </form>
  );
}
interface AdminLoginLayoutProps {
    children: React.ReactNode;
}

export function AdminLoginLayout({
                                     children,
                                 }: AdminLoginLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <main className="flex min-h-screen items-center justify-center py-10">
                <div className="relative w-full max-w-md px-6">
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
                        <div
                            className="h-1 w-full bg-primary"
                            aria-hidden="true"
                        />

                        {children}
                    </div>

                    <p className="mt-6 text-center text-xs text-textMuted">
                        Access is limited to registered clinic staff. Contact
                        your administrator if you need an account.
                    </p>
                </div>
            </main>
        </div>
    );
}

export function LoginHeader() {
    return (
        <div className="flex flex-col items-center px-8 pt-8 text-center">
            <a href={ROUTES.staff.dashboard.overview}>
                <Logo className="h-11"/>
            </a>

            <h1 className="mt-6 font-heading text-2xl font-semibold leading-tight tracking-tight text-textPrimary">
                Clinical Staff Login
            </h1>

            <p className="mt-2 max-w-xs text-xs leading-relaxed text-textSecondary">
                Sign in with your Staff ID to access appointments, queues, and
                student medical records.
            </p>
        </div>
    );
}

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const {
    credentials,
    handleChange,
    validationErrors,
    validate,
  } = useLoginForm();

  const {
    login,
    isLoading,
    isError,
    error,
  } = useLogin();

  const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await login(credentials);

      navigate(
          ROUTES.staff.dashboard.overview
      );
    } catch {
      // useLogin exposes the error
    }
  };

  return (
      <AdminLoginLayout>
        <LoginHeader />

        <LoginForm
            credentials={credentials}
            validationErrors={validationErrors}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
      </AdminLoginLayout>
  );
}