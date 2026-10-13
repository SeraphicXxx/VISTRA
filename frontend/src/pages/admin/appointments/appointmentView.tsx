import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Hourglass,
    CalendarDays,
    Clock,
    ClipboardList,
    GraduationCap,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {useParams} from "react-router-dom";
import {useState} from "react";

import {toAppointmentPageFormat} from "/@/repository/AppointmentModel";
import {useAppointmentByIdQuery, useUpdateAppointment} from "/@/hooks/query/AppointmentQuery";
import {useForm} from "/@/hooks/Form";
import {getFieldErrors} from "/@/utils/Formatters";
import {Modal} from "/@/components/editModal";

type AdminAppointmentStatus = "pending" | "confirmed" | "declined";

interface AppointmentUiModel {
    id: string | number;
    student: string;
    course: string;
    date?: string;
    notes?: string
    time: string;
    type: string;
    status: AdminAppointmentStatus;
}

interface InfoFieldProps {
    icon: LucideIcon;
    label: string;
    value?: string | number | null;
}

interface StatusMeta {
    label: string;
    icon: LucideIcon;
    text: string;
    chip: string;
    dot: string;
}

const STATUS_META: Record<AdminAppointmentStatus, StatusMeta> = {
    pending: {
        label: "Pending",
        icon: Hourglass,
        text: "text-warning",
        chip: "bg-warning/10",
        dot: "bg-warning",
    },

    confirmed: {
        label: "Confirmed",
        icon: CheckCircle2,
        text: "text-success",
        chip: "bg-success/10",
        dot: "bg-success",
    },

    declined: {
        label: "Declined",
        icon: XCircle,
        text: "text-danger",
        chip: "bg-danger/10",
        dot: "bg-danger",
    },
};

function getInitials(name: string = ""): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function InfoField({
                       icon: Icon,
                       label,
                       value,
                   }: InfoFieldProps) {
    return (
        <div className="rounded-xl border border-border bg-surfaceMuted/30 px-4 py-3">
            <div className="flex items-center gap-2">
                <Icon
                    className="h-3.5 w-3.5 text-primary"
                    strokeWidth={2}
                />

                <p className="text-[10px] font-semibold uppercase tracking-wide text-textMuted">
                    {label}
                </p>
            </div>

            <p className="mt-1.5 text-sm font-medium text-textPrimary">
                {value || "—"}
            </p>
        </div>
    );
}

interface AppointmentNotFoundProps {
    patientId?: string | null;
    appointmentId?: string | null;
}

export function AppointmentNotFound({
                                        patientId,
                                        appointmentId,
                                    }: AppointmentNotFoundProps) {
    return (
        <div className="mx-auto w-full">
            <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-primaryDark">
                    {appointmentId
                        ? `Appointment No. ${appointmentId} not found`
                        : "Appointment not found"}
                </h2>

                <p className="mt-2 text-sm text-textMuted">
                    There is no appointment at No. {appointmentId} for patient{" "}
                    <span className="font-medium text-textPrimary">
                        {patientId ?? "unknown"}
                    </span>
                    .
                </p>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                >
                    <ArrowLeft className="h-3.5 w-3.5"/>
                    Back to appointments
                </button>
            </div>
        </div>
    );
}

type interviewForm = {
    declined: boolean
    reason: string
}

function StatusConfirmModal({
  action,
  isSaving,
  onClose,
  onConfirm,
}: {
  action: { status: AdminAppointmentStatus; decline_reason?: string };
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isDecline = action.status === "declined";

  return (
    <Modal
      title={isDecline ? "Decline appointment?" : "Confirm appointment?"}
      onClose={onClose}
      maxWidth="max-w-sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
              isDecline ? "bg-danger hover:opacity-90" : "bg-primary hover:opacity-90"
            }`}
          >
            {isSaving && (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {isSaving
              ? "Saving..."
              : isDecline
                ? "Confirm decline"
                : "Confirm appointment"}
          </button>
        </>
      }
    >
      <p className="text-sm text-textSecondary">
        {isDecline
          ? "The student will be notified that this appointment was declined."
          : "The student will be notified that this appointment is confirmed."}
      </p>

      {action.decline_reason && (
        <div className="mt-3 rounded-lg border border-border bg-surfaceMuted/40 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-textMuted">
            Reason
          </p>
          <p className="text-sm text-textPrimary">{action.decline_reason}</p>
        </div>
      )}
    </Modal>
  );
}

export function AppointmentDetailSkeleton() {
    return (
        <div
            className="mx-auto w-full animate-pulse"
            aria-busy="true"
            aria-label="Loading appointment"
        >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="relative p-6 sm:p-8">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="h-4 w-32 rounded bg-border" />
                    </div>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 shrink-0 rounded-full bg-surface" />
                            <div>
                                <div className="h-7 w-52 rounded bg-surface" />
                                <div className="mt-2 h-3 w-36 rounded bg-surface" />
                            </div>
                        </div>

                        <div className="h-7 w-28 rounded-full bg-surface" />
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="mb-2 h-4 w-40 rounded bg-surface" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-surfaceMuted/30 px-4 py-3">
                            <div className="h-2.5 w-24 rounded bg-border" />
                            <div className="mt-2 h-4 w-32 rounded bg-surface" />
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-2">
                    <div className="mb-4 h-4 w-44 rounded bg-surface" />
                    <div className="h-20 rounded-xl border border-dashed border-border bg-surfaceMuted/20" />
                    <div className="mt-6 flex flex-wrap gap-2">
                        <div className="h-9 w-44 rounded-lg bg-surface" />
                        <div className="h-9 w-28 rounded-lg bg-surface" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AppointmentDetailView() {
    const {patientId, appointmentId} = useParams<{ patientId: string, appointmentId: string }>();
    const { form, setField } = useForm<interviewForm>({
        declined: false,
        reason: "",
    });
    const [saveError, setSaveError] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        status: AdminAppointmentStatus;
        decline_reason?: string;
    } | null>(null);
    const [optimisticStatus, setOptimisticStatus] =
        useState<AdminAppointmentStatus | null>(null);
    const updateAppointmentMutation = useUpdateAppointment();
    if (!appointmentId || !patientId) {
        return (
            <AppointmentNotFound
                patientId={patientId}
                appointmentId={appointmentId}
            />
        );
    }

    const {
        data: appointmentDetails,
        isLoading,
        isError,
        refetch,
    } = useAppointmentByIdQuery(
        patientId,
        appointmentId
    );

    if (isLoading) {
        return <AppointmentDetailSkeleton/>
    }

    if (!appointmentDetails) {
        return (
            <AppointmentNotFound
                patientId={patientId}
                appointmentId={appointmentId}
            />
        );
    }
    const appointment = toAppointmentPageFormat(appointmentDetails) as AppointmentUiModel;

    const serverStatus: AdminAppointmentStatus =
        appointment.status === "confirmed" || appointment.status === "declined"
            ? appointment.status
            : "pending";

    const effectiveStatus = optimisticStatus ?? serverStatus;
    const isDecided = effectiveStatus !== "pending";

    const meta = STATUS_META[effectiveStatus];

    const handleBack = (): void => {
        window.history.back();
    };

    const persistStatus = (
        status: AdminAppointmentStatus,
        decline_reason?: string,
        onDone: () => void = () => {}
    ): void => {
        if (!patientId || !appointmentId) return;

        setSaveError(null);
        setOptimisticStatus(status);
        updateAppointmentMutation.mutate(
            {
                patientId,
                appointmentId,
                payload: decline_reason ? { status, decline_reason } : { status },
            },
            {
                onSuccess: () => {
                    setField("declined", false);
                    setField("reason", "");
                    onDone();
                    void refetch();
                },
                onError: (error) => {
                    setOptimisticStatus(null);
                    setSaveError(getFieldErrors(error));
                },
            }
        );
    };

    const confirmDecline = (): void => {
        const reason = form.reason.trim();
        setConfirmAction({ status: "declined", decline_reason: reason || undefined });
    };

    return (
        <>
            {saveError && (
                <div className="fixed inset-x-0 top-4 z-[60] mx-auto w-fit max-w-md rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-medium text-danger shadow-lg">
                    {saveError}
                </div>
            )}

            {confirmAction && (
                <StatusConfirmModal
                    action={confirmAction}
                    isSaving={updateAppointmentMutation.isPending}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={() =>
                        persistStatus(
                            confirmAction.status,
                            confirmAction.decline_reason,
                            () => setConfirmAction(null)
                        )
                    }
                />
            )}

        <div className="mx-auto w-full">

            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"/>

                <div className="relative p-6 sm:p-8">

                    <div className="mb-6 flex items-start justify-between gap-4">

                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium text-textMuted hover:text-textPrimary"
                        >
                            <ArrowLeft className="h-3.5 w-3.5"/>
                            Back to appointments
                        </button>

                    </div>


                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-5">

                            <span
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                                {getInitials(appointment.student)}
                            </span>

                            <div>

                                <div className="flex flex-wrap items-center gap-2">

                                    <h1 className="font-heading text-2xl font-semibold text-primaryDark">
                                        {appointment.student}
                                    </h1>

                                    <span
                                        className="rounded-md bg-surfaceMuted px-2 py-0.5 font-mono text-xs text-textMuted">
                                        {appointment.id}
                                    </span>

                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">

                                    <span>
                                        {appointment.course}
                                    </span>

                                    <span>•</span>

                                    <span>
                                        Appointment
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Status */}

                        <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${meta.chip} ${meta.text}`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                            />

                            {meta.label}
                        </span>

                    </div>

                </div>

            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

                <div className="flex flex-col gap-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">

                    <div className="border-b border-border pb-4">

                        <div className="flex items-center gap-2">

                            <ClipboardList className="h-4 w-4 text-primary"/>

                            <h2 className="font-heading text-sm font-semibold text-primaryDark">
                                Appointment Information
                            </h2>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 gap-3">

                        <InfoField
                            icon={CalendarDays}
                            label="Appointment Date"
                            value={appointment.date}
                        />

                        <InfoField
                            icon={Clock}
                            label="Appointment Time"
                            value={appointment.time}
                        />

                        <InfoField
                            icon={ClipboardList}
                            label="Appointment Type"
                            value={appointment.type}
                        />

                        <InfoField
                            icon={GraduationCap}
                            label="Course"
                            value={appointment.course}
                        />

                    </div>

                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-2">

                    <div className="border-b border-border pb-4">

                        <div className="flex items-center gap-2">

                            <ClipboardList className="h-4 w-4 text-primary"/>

                            <h2 className="font-heading text-sm font-semibold text-primaryDark">
                                Appointment Notes
                            </h2>

                        </div>

                    </div>


                    <div
                        className="mt-5 rounded-xl border border-dashed border-border bg-surfaceMuted/20 px-4 py-4 text-sm text-textMuted">
                        {appointment.notes || "No additional notes were submitted with this appointment."}
                    </div>

                    <div className="mt-8 border-t border-border pt-6">

                        <div className="mb-4">

                            <h2 className="font-heading text-sm font-semibold text-primaryDark">
                                Update Status
                            </h2>

                            <p className="mt-1 text-xs text-textMuted">
                                Update the appointment status based on the clinic's decision.
                            </p>

                        </div>


                        {/* Decline reason */}

                        {isDecided ? (

                            <div className="rounded-xl border border-border bg-surfaceMuted/40 px-4 py-3 text-xs text-textMuted">
                                This appointment has been {effectiveStatus}. Status
                                can no longer be changed.
                            </div>

                        ) : form.declined ? (

                            <div className="rounded-xl border border-danger/25 bg-danger/5 p-4">

                                <label className="block text-xs font-medium text-textSecondary">

                                    Reason for declining{" "}

                                    <span className="text-textMuted">
                                        (optional)
                                    </span>

                                </label>


                                <textarea
                                    value={form.reason}
                                    onChange={(event) =>
                                        setField("reason", event.target.value)
                                    }
                                    rows={3}
                                    placeholder="e.g. Schedule conflict — ask student to rebook"
                                    className="mt-2 w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />


                                <div className="mt-3 flex gap-2">

                                    <button
                                        type="button"
                                        onClick={confirmDecline}
                                        disabled={updateAppointmentMutation.isPending}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <XCircle className="h-3.5 w-3.5"/>
                                        {updateAppointmentMutation.isPending ? "Saving..." : "Confirm decline"}
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setField("declined", false);
                                            setField("reason", "");
                                        }}
                                        disabled={updateAppointmentMutation.isPending}
                                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        ) : (

                            <div className="flex flex-wrap gap-2">

                                {/* Confirm */}

                                {effectiveStatus !== "confirmed" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setConfirmAction({ status: "confirmed" })
                                        }
                                        disabled={updateAppointmentMutation.isPending}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5"/>
                                        {updateAppointmentMutation.isPending ? "Saving..." : "Confirm appointment"}
                                    </button>

                                )}


                                {/* Decline */}

                                {effectiveStatus !== "declined" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setField("declined", true)
                                        }
                                        disabled={updateAppointmentMutation.isPending}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-danger/25 bg-danger/10 px-4 py-2 text-xs font-medium text-danger hover:bg-danger/15 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <XCircle className="h-3.5 w-3.5"/>
                                        Decline
                                    </button>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
        </>
    );
}
