import React, {useMemo, type ComponentType, type ReactNode} from "react";
import {FileText, Stethoscope, Calendar} from "lucide-react";
import StatsGrid, {StatsGridSkeleton} from "./Stats";
import {AppointmentTableFormat} from "/@/pages/admin/appointments/appointmentsData";
import PanelHeader from "/@/components/OverviewHeader.jsx";
import { DepartmentBadge } from "/@/components/overviewcmp.jsx";
import { Status, statusLabels } from "/@/components/StatusBadge";
import { CardList } from "/@/components/CardList";
import {
    AnimatedBar,
    CountUp,
    LiveDot,
    RevealItem,
} from "/@/components/adminanim";
import {useOverviewData, useOverviewStats} from "/@/hooks/query/OverviewQuery";
import type {StatData} from "/@/utils/statsCard";
import {
  mapAppointmentToTable,
  mapDentalToOverview,
  mapMedicalToOverview,
} from "/@/repository/OverviewModel";

const CONSULTATION_LIMIT = 8;
const APPOINTMENT_LIMIT = 6;

interface ConsultationEntry {
  id: string;
  student: string;
  course: string;
  time: string;
  type: string;
  status: Status;
  department: string;
}

function RecentBadge({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
      <CountUp to={count} delay={400} /> recent
    </span>
  );
}

function AnalyticsPanel({
  icon,
  title,
  subtitle,
  count,
  max,
  live = false,
  state,
  children,
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  count: number;
  max: number;
  live?: boolean;
  state: "loading" | "error" | "ready";
  children: React.ReactNode;
}) {
  return (
    <section className="hover-lift group relative flex h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card">
      <PanelHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex items-center gap-2">
            {live && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-textMuted">
                <LiveDot />
                Live
              </span>
            )}
            <RecentBadge count={count} />
          </div>
        }
      />

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
        <div key={state} className="fade-in-up">
          {children}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <div className="mb-1.5 flex justify-between text-[11px] font-medium text-textMuted">
          <span>Loaded</span>
          <span className="tabular-nums">
            {count} of {max}
          </span>
        </div>
        <AnimatedBar value={count} max={max} />
      </div>
    </section>
  );
}

function ConsultationCard({ entry }: { entry: ConsultationEntry }) {
  return (
    <>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-textPrimary">
              {entry.student}
            </p>
            <DepartmentBadge department={entry.department} />
          </div>
          <p className="mt-0.5 break-words text-xs text-textMuted">
            {entry.type}
          </p>
        </div>

        <span className="shrink-0 whitespace-nowrap text-xs font-medium text-textSecondary">
          {entry.time}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
        <FileText className="h-3.5 w-3.5" strokeWidth={2} />
        {statusLabels[entry.status] ?? entry.status}
      </div>
    </>
  );
}

function ConsultationsList({ entries }: { entries: ConsultationEntry[] }) {
  return (
    <CardList
      items={entries}
      keyExtractor={(entry) => entry.id}
      renderItem={(entry) => (
        <RevealItem
          index={entries.indexOf(entry)}
          className="rounded-xl p-3 transition-colors duration-200 hover:bg-primary/5"
        >
          <ConsultationCard entry={entry} />
        </RevealItem>
      )}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Stethoscope className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-sm font-medium text-textPrimary">
            No consultations yet
          </p>
          <p className="text-xs text-textMuted">
            Walk-ins and clinic visits will show up here as they're checked in.
          </p>
        </div>
      }
    />
  );
}

function AppointmentCard({ entry }: { entry: AppointmentTableFormat }) {
  return (
    <>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-textPrimary">
            {entry.student}
          </p>
          <p className="mt-0.5 break-words text-xs text-textMuted">
            {entry.type}
          </p>
        </div>

        <span className="shrink-0 whitespace-nowrap text-xs font-medium text-textSecondary">
          {entry.time}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
        <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
        {statusLabels[entry.status] ?? entry.status}
      </div>
    </>
  );
}

function AppointmentsList({ entries }: { entries: AppointmentTableFormat[] }) {
  return (
    <CardList
      items={entries}
      keyExtractor={(entry) => entry.id}
      renderItem={(entry) => (
        <RevealItem
          index={entries.indexOf(entry)}
          className="rounded-xl p-3 transition-colors duration-200 hover:bg-primary/5"
        >
          <AppointmentCard entry={entry} />
        </RevealItem>
      )}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Calendar className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-sm font-medium text-textPrimary">
            No appointments yet
          </p>
          <p className="text-xs text-textMuted">
            Booked and walk-in appointments will show up here.
          </p>
        </div>
      }
    />
  );
}

function PanelListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4 py-2" aria-label="Loading" role="status">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="shimmer h-4 w-1/3 rounded bg-border" />
            <div className="shimmer h-3 w-16 rounded bg-border" />
          </div>
          <div className="shimmer h-3 w-1/2 rounded bg-border/70" />
          <div className="shimmer h-3 w-24 rounded bg-border/70" />
        </div>
      ))}
    </div>
  );
}

function PanelError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="shake flex flex-col items-center gap-2 py-10 text-center">
      <p className="text-sm font-medium text-textPrimary">Couldn't load data</p>
      <p className="text-xs text-textMuted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-shine mt-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-transform duration-200 hover:scale-105"
      >
        Retry
      </button>
    </div>
  );
}

function ConsultationPanel({
  medical,
  dental,
  loading,
  isError,
  onRetry,
}: {
  medical?: { items: Parameters<typeof mapMedicalToOverview>[0][] };
  dental?: { items: Parameters<typeof mapDentalToOverview>[0][] };
  loading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const records = useMemo<ConsultationEntry[]>(() => {
    if (!medical || !dental) return [];
    const merged = [
      ...medical.items.map(mapMedicalToOverview),
      ...dental.items.map(mapDentalToOverview),
    ] as unknown as (ConsultationEntry & { visitDate: string })[];
    return merged
      .sort((a, b) => +new Date(b.visitDate) - +new Date(a.visitDate))
      .slice(0, CONSULTATION_LIMIT);
  }, [medical, dental]);

  const state = loading ? "loading" : isError ? "error" : "ready";

  return (
    <AnalyticsPanel
      icon={Stethoscope}
      title="Medical & Dental Records"
      subtitle="Live check-in feed"
      count={records.length}
      max={CONSULTATION_LIMIT}
      live
      state={state}
    >
      {state === "loading" && <PanelListSkeleton rows={5} />}
      {state === "error" && (
        <PanelError message="Consultations failed to load." onRetry={onRetry} />
      )}
      {state === "ready" && <ConsultationsList entries={records} />}
    </AnalyticsPanel>
  );
}

function AppointmentsPanel({
  appointments,
  loading,
  isError,
  onRetry,
}: {
  appointments?: { items: Parameters<typeof mapAppointmentToTable>[0][] };
  loading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const recent = useMemo(
    () =>
      (appointments?.items ?? [])
        .map(mapAppointmentToTable)
        .slice(0, APPOINTMENT_LIMIT),
    [appointments]
  );

  const state = loading ? "loading" : isError ? "error" : "ready";

  return (
    <AnalyticsPanel
      icon={Calendar}
      title="Appointment"
      subtitle="Upcoming and recent bookings"
      count={recent.length}
      max={APPOINTMENT_LIMIT}
      state={state}
    >
      {state === "loading" && <PanelListSkeleton rows={4} />}
      {state === "error" && (
        <PanelError message="Appointments failed to load." onRetry={onRetry} />
      )}
      {state === "ready" && <AppointmentsList entries={recent} />}
    </AnalyticsPanel>
  );
}

function deltaString(today: number, yesterday: number): string | undefined {
    const diff = today - yesterday;

    if (diff === 0) return undefined;

    return `${diff > 0 ? "+" : ""}${diff} vs yesterday`;
}

export default function OverviewTab() {
    const {data, isLoading, isFetching, isError, refetch} = useOverviewData(APPOINTMENT_LIMIT, 8);
    const loading = isLoading || (isFetching && !data);
    const retry = () => refetch();
    const {data: statsRow, isLoading: statsLoading} = useOverviewStats();

    const stats: StatData[] = statsRow ? [
        {
            id: "today",
            value: statsRow.appointments_today,
            delta: deltaString(statsRow.appointments_today, statsRow.appointments_yesterday),
        },
        { id: "consultations", value: statsRow.in_consultation },
        { id: "records", value: statsRow.records_today },
        { id: "activity", value: statsRow.active_staff },
    ] : [];

    const visitMix = statsRow ? [
        { label: "Medical", value: statsRow.visit_mix.medical, color: "bg-primary" },
        { label: "Dental", value: statsRow.visit_mix.dental, color: "bg-primaryDark" },
        { label: "OJT", value: statsRow.visit_mix.ojt, color: "bg-height" },
        { label: "Other", value: statsRow.visit_mix.other, color: "bg-weight" },
    ] : undefined;

    return (
        <>
            {statsLoading && !statsRow ? (
                <StatsGridSkeleton />
            ) : (
                <StatsGrid
                    stats={stats}
                    weekly={statsRow?.weekly_appointments}
                    visitMix={visitMix}
                />
            )}
            <div className="reveal-group mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ConsultationPanel medical={data?.medical} dental={data?.dental} loading={loading} isError={isError} onRetry={retry}/>
                <AppointmentsPanel appointments={data?.appointments} loading={loading} isError={isError} onRetry={retry}/>
            </div>
        </>
    );
}
