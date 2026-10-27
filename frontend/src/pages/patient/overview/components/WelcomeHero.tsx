import { Link } from "react-router-dom";
import { CalendarPlus, FileText } from "lucide-react";
import { ROUTES } from "/@/config/RoutePaths";
import { todayLabel } from "/@/utils/DateUtils";

interface WelcomeHeroProps {
  name: string;
  studentId: string;
  isLoading?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
};

const dotPatternStyle = {
  backgroundImage: "radial-gradient(circle, rgba(20, 184, 166, 0.45) 1.5px, transparent 1.5px)",
  backgroundSize: "16px 16px",
  maskImage: "linear-gradient(to left, black 20%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to left, black 20%, transparent 100%)",
} as const;

export default function WelcomeHero({ name, studentId, isLoading = false }: WelcomeHeroProps) {
  const showSkeleton = isLoading || !name || !studentId;
  const firstName = name?.split(" ")[0];

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
      aria-busy={showSkeleton}
    >
      {showSkeleton && <span className="sr-only">Loading profile…</span>}

      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
        style={dotPatternStyle}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {showSkeleton ? (
            <div className="h-4 w-40 animate-pulse rounded bg-border" aria-hidden="true" />
          ) : (
            <p className="text-xs font-medium text-textMuted">
              {studentId} · {todayLabel()}
            </p>
          )}

          {showSkeleton ? (
            <div className="mt-3 h-8 w-64 animate-pulse rounded-lg bg-border" aria-hidden="true" />
          ) : (
            <h1 className="mt-2 font-heading text-2xl font-semibold text-primaryDark sm:text-3xl">
              {getGreeting()}, {firstName}
            </h1>
          )}

          <p className="mt-1.5 text-sm text-textSecondary">
            Your health records and upcoming visits are up to date.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to={ROUTES.patient.appointment.bookAppointment}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primaryDark"
          >
            <CalendarPlus className="h-4 w-4" strokeWidth={2} />
            Book appointment
          </Link>

          <Link
            to={ROUTES.patient.dashboard.medical}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-textPrimary transition-colors hover:border-primary/40"
          >
            <FileText className="h-4 w-4 text-textMuted" strokeWidth={2} />
            My records
          </Link>
        </div>
      </div>
    </section>
  );
}