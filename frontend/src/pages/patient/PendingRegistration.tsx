import { Link } from "react-router-dom";
import { ROUTES } from "/@/config/RoutePaths";

export default function PendingRegistration() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Registration Pending</h1>
        <p className="text-textSecondary">
          Your application has been submitted and is awaiting admin approval. You will be notified once approved.
        </p>
        <Link to={ROUTES.patient.login} className="text-primary font-semibold">Back to sign in</Link>
      </div>
    </div>
  );
}