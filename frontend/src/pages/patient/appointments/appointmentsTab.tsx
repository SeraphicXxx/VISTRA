import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CalendarPlus, CalendarX, ChevronRight, Clock, RotateCcw } from "lucide-react";

import {
  getMyAppointments,
  Appointment,
  AppointmentStatus,
  STATUS_META,
  daysUntilLabel,
  getDateParts,
  getEffectiveSlot,
  getViewPath,
  isUpcoming,
  resolveStudentId,
} from "./appointmentsData";
import { sessionManager } from "/@/utils/SessionManager.ts";
import { ROUTES } from "/@/config/RoutePaths.js";

const STATUS_KEYS: AppointmentStatus[] = ["pending", "approved", "rescheduled", "rejected"];

type UpcomingFilter = "all" | Exclude<AppointmentStatus, "rejected">;

const UPCOMING_FILTERS: { key: UpcomingFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rescheduled", label: "Rescheduled" },
];

interface FilterOption<T extends string> {
  key: T;
  label: string;
  count: number;
  dot?: string;
}

function FilterBar<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: FilterOption<T>[];
  value: T;
  onChange: (key: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.key)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              active
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-textSecondary hover:bg-surfaceMuted/60 hover:text-textPrimary"
            }`}
          >
            {option.dot && <span className={`h-2 w-2 rounded-full ${option.dot}`} />}
            {option.label}
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] leading-none ${
                active ? "bg-white/20 text-white" : "bg-surfaceMuted text-textMuted"
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AppointmentCard({ appointment, onOpen }: { appointment: Appointment; onOpen: () => void }) {
  const meta = STATUS_META[appointment.status];
  const slot = getEffectiveSlot(appointment);
  const date = getDateParts(slot.date);
  const original = appointment.status === "rescheduled" ? getDateParts(appointment.date) : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-sm transition-all hover:border-textMuted/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-surfaceMuted">
        <span className="text-[11px] font-medium uppercase leading-none tracking-wide text-textMuted">
          {date?.monthShort}
        </span>
        <span className="mt-1 font-heading text-xl font-semibold leading-none text-textPrimary">
          {date?.day}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-textPrimary">{appointment.type}</p>
        <p className="mt-0.5 text-xs text-textMuted">
          {date?.weekdayShort}, {slot.time}
        </p>
        {original && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-textMuted">
            <RotateCcw className="h-3 w-3 shrink-0" strokeWidth={2} />
            Originally {original.short}, {appointment.time}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-textPrimary">
          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
          <span className="hidden sm:inline">{meta.label}</span>
        </span>
        <ChevronRight
          className="h-4 w-4 text-textMuted transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </div>
    </button>
  );
}

function Column({
  title,
  items,
  emptyText,
  onOpen,
  toolbar,
}: {
  title: string;
  items: Appointment[];
  emptyText: string;
  onOpen: (id: string) => void;
  toolbar: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 px-1">
        <h3 className="font-heading text-base font-semibold text-textPrimary">{title}</h3>
        <span className="rounded-md bg-surfaceMuted px-1.5 py-0.5 text-[11px] font-semibold text-textSecondary">
          {items.length}
        </span>
      </div>

      <div className="mb-3 flex min-h-[34px] items-center">{toolbar}</div>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {items.map((appointment) => (
            <li key={appointment.id}>
              <AppointmentCard appointment={appointment} onOpen={() => onOpen(appointment.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
          <CalendarX className="h-5 w-5 text-textMuted" strokeWidth={2} />
          <p className="mt-3 text-sm text-textMuted">{emptyText}</p>
        </div>
      )}
    </section>
  );
}

export default function PatientAppointmentsTab() {
  const navigate = useNavigate();
  const studentId = resolveStudentId(sessionManager.getUser());
  const [upcomingFilter, setUpcomingFilter] = useState<UpcomingFilter>("all");

  const { upcoming, history, counts } = useMemo(() => {
    const all = getMyAppointments(studentId);
    const upcomingList = all
      .filter(isUpcoming)
      .sort((a, b) => getEffectiveSlot(a).date.localeCompare(getEffectiveSlot(b).date));
    const historyList = all
      .filter((appointment) => !isUpcoming(appointment))
      .sort((a, b) => getEffectiveSlot(b).date.localeCompare(getEffectiveSlot(a).date));
    const statusCounts: Record<AppointmentStatus, number> = {
      pending: 0,
      approved: 0,
      rescheduled: 0,
      rejected: 0,
    };
    all.forEach((appointment) => {
      statusCounts[appointment.status] += 1;
    });
    return { upcoming: upcomingList, history: historyList, counts: statusCounts };
  }, [studentId]);

  const filterOptions = useMemo<FilterOption<UpcomingFilter>[]>(
    () =>
      UPCOMING_FILTERS.map((filter) => ({
        key: filter.key,
        label: filter.label,
        count:
          filter.key === "all"
            ? upcoming.length
            : upcoming.filter((appointment) => appointment.status === filter.key).length,
        dot: filter.key === "all" ? undefined : STATUS_META[filter.key].dot,
      })),
    [upcoming]
  );

  const filteredUpcoming =
    upcomingFilter === "all"
      ? upcoming
      : upcoming.filter((appointment) => appointment.status === upcomingFilter);

  const activeFilterLabel = UPCOMING_FILTERS.find((filter) => filter.key === upcomingFilter)?.label.toLowerCase();

  const next = upcoming[0];
  const nextSlot = next ? getEffectiveSlot(next) : null;
  const nextDate = nextSlot ? getDateParts(nextSlot.date) : null;
  const nextMeta = next ? STATUS_META[next.status] : null;
  const countdown = nextSlot ? daysUntilLabel(nextSlot.date) : "";

  const goToBook = () => navigate(ROUTES.patient.appointment.bookAppointment);
  const goToView = (id: string) => navigate(getViewPath(id));

  return (
    <div className="w-full">
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary/15 to-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          {next && nextSlot && nextMeta ? (
            <>
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/50 bg-background text-primary">
                  <span className="text-xs font-semibold uppercase leading-none tracking-wide text-primary">
                    {nextDate?.monthShort}
                  </span>
                  <span className="mt-1.5 font-heading text-3xl font-semibold leading-none text-textPrimary">
                    {nextDate?.day}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-textMuted">
                      Next appointment
                    </span>
                    {countdown && (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primaryDark">
                        {countdown}
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 truncate font-heading text-2xl font-semibold tracking-tight text-primaryDark">
                    {next.type}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-textSecondary">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-textMuted" strokeWidth={2} />
                      {nextDate?.weekday}, {nextDate?.short}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-textMuted" strokeWidth={2} />
                      {nextSlot.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => goToView(next.id)}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primaryDark"
                >
                  View details
                </button>

                <button
                  type="button"
                  onClick={goToBook}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-textPrimary transition-colors hover:bg-background"
                >
                  <CalendarPlus className="h-4 w-4 text-primary" strokeWidth={2} />
                  Book appointment
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-primary">
                  <CalendarPlus className="h-7 w-7" strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <p className="font-heading text-2xl font-semibold tracking-tight text-textPrimary">
                    Nothing scheduled
                  </p>
                  <p className="mt-1 text-sm text-textSecondary">
                    Book an appointment and the clinic will confirm your slot.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={goToBook}
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primaryDark"
              >
                <CalendarPlus className="h-4 w-4" strokeWidth={2} />
                Book appointment
              </button>
            </>
          )}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <Column
          title="Upcoming"
          items={filteredUpcoming}
          emptyText={
            upcomingFilter === "all"
              ? "No upcoming appointments."
              : `No ${activeFilterLabel} appointments.`
          }
          onOpen={goToView}
          toolbar={
            <FilterBar
              label="Filter upcoming appointments by status"
              options={filterOptions}
              value={upcomingFilter}
              onChange={setUpcomingFilter}
            />
          }
        />
        <Column
          title="History"
          toolbar={<p className="text-xs text-textMuted">Past and closed requests</p>}
          items={history}
          emptyText="Nothing in your history yet."
          onOpen={goToView}
        />
      </div>
    </div>
  );
}