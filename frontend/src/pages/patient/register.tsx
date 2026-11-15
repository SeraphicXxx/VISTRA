import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "/@/components/Logo.jsx";
import { ROUTES } from "/@/config/RoutePaths.js";
import { SuccessModal } from "/@/components/register/AuthModal";
import { RegisterForm } from "/@/components/register/RegisterForm";
import { focusRing } from "/@/components/register/authShared";

export default function PatientRegisterPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const goToSignIn = () => navigate(ROUTES.patient.login);

  return (
    <div className="page-in min-h-screen bg-[linear-gradient(135deg,#e3f6f2_0%,#f3fafa_45%,#e6f1fb_100%)] px-6 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-surface p-8 shadow-card sm:p-10">
        <div className="flex items-center justify-between">
          <Link
            to={ROUTES.patient.login}
            className={`rounded text-sm font-semibold text-primary transition-colors duration-200 hover:text-primaryDark ${focusRing}`}
          >
            Back to sign in
          </Link>
          <Logo className="h-10" />
        </div>

        <h1 className="mt-8 font-heading text-3xl font-semibold leading-tight tracking-tight text-textPrimary sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-base leading-relaxed text-textSecondary">
          Upload your application form and we will fill in your details.
        </p>

        <RegisterForm onSuccess={setSuccessMessage} />
      </div>

      {successMessage && (
        <SuccessModal
          title="Application submitted"
          message={successMessage}
          actionLabel="Back to sign in"
          onClose={goToSignIn}
        />
      )}
    </div>
  );
}