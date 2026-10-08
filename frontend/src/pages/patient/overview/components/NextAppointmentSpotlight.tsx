import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock } from "lucide-react";
import { ROUTES } from "/@/config/RoutePaths";
import { formatDate } from "/@/utils/FormatDate";
import { daysUntil } from "/@/utils/DateUtils";
import type { Appointment } from "../../appointments/appointmentsData";

interface NextAppointmentSpotlightProps {
  appointment: Appointment | null;
}

export default function NextAppointmentSpotlight({ appointment }: NextAppointmentSpotlightProps) {
  if (!appointment) {
    return (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed border-border bg-surface p-6">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <CalendarClock className="h-4 w-4" strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wide">Next Appointment</span>
          </div>
          <p className="mt-4 text-sm text-textMuted">
            You don't have anything scheduled. Booking takes less than a minute.
          </p>
        </div>

        <Link
          to={ROUTES.patient.appointment.bookAppointment}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primaryDark"
        >
          Book an appointment
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  const days = daysUntil(appointment.date);
  const countdownLabel = days <= 0 ? (days === 0 ? "Today" : "Past") : "days away";

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-primaryDark p-4 text-white shadow-card">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/75">
          <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
          Next Appointment
        </span>

        <div className="mt-4 flex items-baseline gap-2">
          {days > 0 ? (
            <>
              <span className="font-heading text-4xl font-bold leading-none">{days}</span>
              <span className="text-sm font-medium text-white/80">{countdownLabel}</span>
            </>
          ) : (
            <span className="font-heading text-2xl font-bold leading-none">{countdownLabel}</span>
          )}
        </div>

        <p className="mt-3 font-heading text-lg font-semibold">{appointment.type}</p>
        <p className="mt-0.5 text-sm text-white/85">
          {formatDate(appointment.date)} · {appointment.time}
        </p>
      </div>

      <Link
        to={ROUTES.patient.appointment.viewAppointment}
        className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80"
      >
        View details
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </Link>
    </div>
  );
}
