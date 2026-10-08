import { Link } from "react-router-dom";
import { CalendarPlus, FileText } from "lucide-react";
import { ROUTES } from "/@/config/RoutePaths";
import { todayLabel } from "/@/utils/DateUtils";

interface WelcomeHeroProps {
  name: string;
  studentId: string;
  isLoading?: boolean;
}

export default function WelcomeHero({ name, studentId, isLoading = false }: WelcomeHeroProps) {
  const showSkeleton = isLoading || !name || !studentId;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-primary/5x to-white shadow-card"
      aria-busy={showSkeleton}
    >
      {showSkeleton && <span className="sr-only">Loading profile…</span>}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_100%_at_0%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-24 -left-10 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {showSkeleton ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1"
                aria-hidden="true"
              >
                <span className="h-3 w-20 animate-pulse rounded bg-primary/20" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-primary">
                {studentId}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-textMuted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {todayLabel()}
            </span>
          </div>

          {showSkeleton ? (
            <div
              className="mt-3 h-8 w-56 animate-pulse rounded-lg bg-border sm:h-9 sm:w-72"
              aria-hidden="true"
            />
          ) : (
            <h1 className="mt-3 font-heading text-2xl font-semibold leading-tight text-primaryDark sm:text-3xl">
              Welcome back, {name.split(" ")[0]}.
            </h1>
          )}

          <p className="mt-1.5 max-w-l text-sm text-textSecondary">
            Here's what's happening with your health records and upcoming visits.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            to={ROUTES.patient.appointment.bookAppointment}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02] hover:bg-primaryDark"
          >
            <CalendarPlus className="h-4 w-4" strokeWidth={2} />
            Book Appointment
          </Link>

          <Link
            to={ROUTES.patient.dashboard.medical}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-textPrimary transition-colors hover:border-primary/40"
          >
            <FileText className="h-4 w-4" strokeWidth={2} />
            My Records
          </Link>
        </div>
      </div>
    </section>
  );
}
