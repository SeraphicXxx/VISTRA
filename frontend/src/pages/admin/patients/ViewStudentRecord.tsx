import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Inbox, Pencil } from "lucide-react";
import { usePatientRecordSummaryQuery, useUpdatePatientProfile } from "/@/hooks/query/PatientQuery";
import { PatientRecordTab } from "/@/types/types";
import { formatDate } from "/@/utils/FormatDate";
import { EditRecordModal, patientEditFields } from "/@/components/editModal";
import { getFieldErrors } from "/@/utils/Formatters";
import { SaveErrorBanner } from "/@/components/SaveErrorBanner";
import { getInitials } from "/@/utils/RecordInfo";
import {
  RECORD_TABS,
  buildEditForm,
  buildProfilePayload,
  debugLog,
  getAffiliation,
  isStudentPatient,
  sortRecordsByDate,
} from "/@/utils/PatientRecordUtils";

function InfoGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
      {children}
    </p>
  );
}

function InfoTile({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | number | null;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-background/70 px-4 py-3.5 ${className}`}>
      <dt className="text-xs font-medium text-textMuted">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold text-textPrimary">{value || "—"}</dd>
    </div>
  );
}

function RecordViewSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-5"
      aria-busy="true"
      aria-label="Loading patient record"
    >
      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="h-40 bg-primary/30" />

        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex items-end gap-5">
            <div className="-mt-12 h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-border" />
            <div className="pb-1">
              <div className="h-6 w-56 rounded bg-border" />
              <div className="mt-2 h-3.5 w-40 rounded bg-border" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 rounded-lg bg-border" />
            <div className="h-10 w-24 rounded-lg bg-border" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <div className="h-4 w-40 rounded bg-border" />
        </div>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`bg-white p-5 ${i === 6 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
              <div className="h-2.5 w-20 rounded bg-border" />
              <div className="mt-2 h-4 w-28 rounded bg-surface" />
            </div>
          ))}
        </div>
      </section>

      <section className="h-80 rounded-2xl border border-border bg-white shadow-card" />
    </div>
  );
}

function NotFound({ id, onBack }: { id: string; onBack: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2 rounded-2xl border border-border bg-white p-10 text-center shadow-card">
      <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Inbox className="h-5 w-5" strokeWidth={2} />
      </span>
      <p className="text-sm font-semibold text-textPrimary">
        No patient found for ID "{id}"
      </p>
      <p className="text-xs leading-relaxed text-textMuted">
        The record may have been removed, or the link is out of date.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-medium text-textSecondary transition-colors hover:border-primary/30 hover:text-textPrimary"
      >
        Go back
      </button>
    </div>
  );
}

export default function ViewStudentRecord() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: patientInfo,
    isLoading,
    isError,
    refetch,
  } = usePatientRecordSummaryQuery(id ?? "");

  const [activeTab, setActiveTab] = useState<PatientRecordTab>("medical");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const updateProfileMutation = useUpdatePatientProfile();

  const patient = patientInfo?.data;
  const handleBack = () => navigate(-1);

  const isStudent = isStudentPatient(patient);
  const affiliation = getAffiliation(patient);

  const activeLabel = RECORD_TABS.find((t) => t.key === activeTab)?.label ?? "";

  const activeRecords = useMemo(
    () => sortRecordsByDate(patient?.[activeTab]),
    [patient, activeTab]
  );

  const handleEditPersonalInfo = () => {
    setEditForm(buildEditForm(patient));
    setSaveError(null);
    setIsEditModalOpen(true);
  };

  const handleSavePersonalInfo = (form: Record<string, any>) => {
    if (!id) return;

    const payload = buildProfilePayload(form, patient);
    debugLog("profile payload", payload);

    if (Object.keys(payload).length === 0) {
      setIsEditModalOpen(false);
      return;
    }

    setSaveError(null);
    updateProfileMutation.mutate(
      { patientId: id, payload },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          void refetch();
        },
        onError: (error) => {
          debugLog("profile save error", error);
          setSaveError(getFieldErrors(error));
        },
      }
    );
  };

  if (isLoading) return <RecordViewSkeleton />;

  if (!patientInfo || isError) {
    return <NotFound id={id ?? ""} onBack={handleBack} />;
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div
            className="relative h-40 overflow-hidden bg-gradient-to-r from-primary via-[#109f91] to-primaryDark"
            aria-hidden="true"
          >
            <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/20 bg-white/[0.08]" />
            <div className="absolute right-[12%] -top-20 h-64 w-64 rounded-full border border-white/20 bg-white/[0.06]" />
            <div className="absolute right-[25%] top-16 h-40 w-80 rotate-[-20deg] rounded-full border border-white/20 bg-white/[0.07]" />
            <div className="absolute -left-20 -top-36 h-80 w-80 rounded-full bg-white/[0.07] blur-3xl" />
            <div className="absolute left-[42%] -bottom-32 h-64 w-64 rounded-full border border-white/15 bg-white/[0.05]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.08]" />
          </div>

          <div className="relative z-10 flex flex-col gap-5 px-6 pb-6  sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div className="flex min-w-0 items-end gap-5">
              <div className="-mt-8 flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-primaryDark font-heading text-2xl font-semibold text-white shadow-md">
                {getInitials(patient?.patient_name)}
              </div>

              <div className="min-w-0 pb-1">
                <h1 className="truncate font-heading text-2xl font-semibold tracking-tight text-textPrimary">
                  {patient?.patient_name || "Unnamed patient"}
                </h1>

                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-textSecondary">
                  <span>{patient?.patient_id || "—"}</span>
                  <span className="text-textMuted">·</span>
                  <span>{isStudent ? "Student" : "Faculty"}</span>

                  {affiliation && (
                    <>
                      <span className="text-textMuted">·</span>
                      <span>{affiliation}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3 pb-1">
              <button
                type="button"
                onClick={handleEditPersonalInfo}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primaryDark"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                Edit information
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-xs font-medium text-textSecondary transition-colors hover:bg-background hover:text-textPrimary"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                Back
              </button>
            </div>
          </div>
        </section>

        {/* Personal information */}
        <section className="rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 px-6 pt-5">
            <h2 className="font-heading text-base font-semibold text-textPrimary">Personal Information</h2>

            <button
              type="button"
              onClick={handleEditPersonalInfo}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-textSecondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Pencil className="h-3 w-3" strokeWidth={2} />
              Edit
            </button>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <InfoGroupLabel>Identity</InfoGroupLabel>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoTile label="Birthday" value={patient?.birthday ? formatDate(patient.birthday) : null} />
                <InfoTile label="Age" value={patient?.age} />
                <InfoTile label="Sex" value={patient?.sex} />
                <InfoTile label="Civil status" value={patient?.civil_status} />
              </dl>
            </div>

            <div>
              <InfoGroupLabel>Contact & residence</InfoGroupLabel>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoTile label="Mobile number" value={patient?.mobile_number} />
                <InfoTile label="Barangay" value={patient?.barangay} />
                <InfoTile label="Address" value={patient?.address} className="sm:col-span-2 lg:col-span-2" />
              </dl>
            </div>
          </div>
        </section>

        {/* Records */}
        <section className="flex h-[clamp(380px,55vh,560px)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="flex shrink-0 flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="tablist"
              className="inline-flex w-fit gap-1 overflow-x-auto rounded-xl bg-background p-1"
            >
              {RECORD_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = patient?.[tab.key]?.length ?? 0;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white text-primaryDark shadow-sm"
                        : "text-textMuted hover:text-textPrimary"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                        isActive ? "bg-primary/10 text-primary" : "bg-surface text-textMuted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-textMuted">
              {activeRecords.length} {activeLabel.toLowerCase()} {activeRecords.length === 1 ? "entry" : "entries"}
            </p>
          </div>

          {activeRecords.length > 0 ? (
            <div key={activeTab} className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-textMuted">
                    <th scope="col" className="w-36 px-6 py-3 font-semibold">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Title
                    </th>
                    <th scope="col" className="w-48 px-4 py-3 font-semibold">
                      Provider
                    </th>
                    <th scope="col" className="w-28 px-4 py-3 font-semibold">
                      Staff ID
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="align-top transition-colors hover:bg-primary/[0.03]"
                    >
                      <td className="whitespace-nowrap px-6 py-4 tabular-nums text-textSecondary">
                        <time dateTime={record.date}>
                          {formatDate(record.date)}
                        </time>
                      </td>
                      <td className="px-4 py-4 font-medium text-textPrimary">
                        {record.title}
                      </td>
                      <td className="px-4 py-4 text-textSecondary">
                        {record.provider || "—"}
                      </td>
                      <td className="px-4 py-4 tabular-nums text-textSecondary">
                        {record.staff_id || "—"}
                      </td>
                      <td className="px-6 py-4 leading-relaxed text-textSecondary">
                        {record.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Inbox className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-sm font-semibold text-textPrimary">
                No {activeLabel.toLowerCase()} records yet
              </p>
              <p className="mt-1 text-xs text-textMuted">
                Entries will appear here once they are added.
              </p>
            </div>
          )}
        </section>
      </div>

      {isEditModalOpen && (
        <>
          <SaveErrorBanner message={saveError} />
          <EditRecordModal
            title="Edit Personal Information"
            fields={patientEditFields}
            data={editForm}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSavePersonalInfo}
            isSaving={updateProfileMutation.isPending}
          />
        </>
      )}
    </>
  );
}