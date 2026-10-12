import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { usePatientRecordSummaryQuery, useUpdatePatientProfile } from "/@/hooks/query/PatientQuery";
import { PatientRecordTab } from "/@/types/types";
import { formatDate } from "/@/utils/FormatDate";
import { EditRecordModal, patientEditFields } from "/@/components/editModal";
import { getFieldErrors } from "/@/utils/Formatters";
import type { PatientInfo, UpdatePatientProfile } from "/@/api/schema/PatientSchema";

const TABS: { key: PatientRecordTab; label: string }[] = [
  { key: "medical", label: "Medical" },
  { key: "dental", label: "Dental" },
  { key: "appointment", label: "Appointments" },
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | number | null;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-textMuted">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-textPrimary">
        {value || "—"}
      </p>
    </div>
  );
}

/*
 * Map the edit-modal form (UI field names) to the PATCH
 * /patients/{id}/ payload (API field names), including only
 * changed, non-blank values. name/studentId/yearSection are
 * display-only: the endpoint does not accept them.
 */
function buildProfilePayload(
  form: Record<string, any>,
  patient: PatientInfo | undefined
): UpdatePatientProfile {
  const text = (value: unknown): string | undefined => {
    const trimmed = String(value ?? "").trim();
    return trimmed || undefined;
  };

  const changed = (next: string | undefined, current: unknown): boolean =>
    next !== undefined && next !== String(current ?? "");

  const payload: UpdatePatientProfile = {};
  const birthday = text(form.birthday);
  const mobileNumber = text(form.mobileNumber);
  const barangay = text(form.barangay);
  const address = text(form.address);

  if (birthday && changed(birthday, patient?.birthday)) {
    payload.birthday = birthday;
  }

  const age = Number(form.age);
  if (
    form.age !== "" &&
    form.age !== undefined &&
    Number.isFinite(age) &&
    age !== patient?.age
  ) {
    payload.age = age;
  }

  const sex = text(form.sex);
  if (sex && changed(sex, patient?.sex)) {
    payload.sex = sex;
  }

  const civilStatus = text(form.civilStatus);
  if (civilStatus && changed(civilStatus, patient?.civil_status)) {
    payload.civil_status = civilStatus;
  }

  if (mobileNumber && changed(mobileNumber, patient?.mobile_number)) {
    payload.mobile_number = mobileNumber;
  }

  if (barangay && changed(barangay, patient?.barangay)) {
    payload.barangay = barangay;
  }

  if (address && changed(address, patient?.address)) {
    payload.complete_address = address;
  }

  return payload;
}

function RecordViewSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-5"
      aria-busy="true"
      aria-label="Loading patient record"
    >
      <div className="h-4 w-28 rounded bg-border" />

      <section className="rounded-xl border border-border bg-white shadow-card">
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-lg bg-surface" />
            <div className="min-w-0">
              <div className="h-5 w-48 rounded bg-surface" />
              <div className="mt-2 h-3 w-32 rounded bg-surface" />
            </div>
          </div>
          <div className="h-9 w-32 shrink-0 rounded-md bg-surface" />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border bg-background/60 px-6 py-5 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-2.5 w-16 rounded bg-border" />
              <div className="h-4 w-24 rounded bg-surface" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white shadow-card">
        <div className="flex gap-6 border-b border-border px-6 pb-3 pt-4">
          {["Medical", "Dental", "Appointments"].map((tab) => (
            <div key={tab} className="h-4 w-20 rounded bg-surface" />
          ))}
        </div>
        <div className="flex flex-col gap-3 px-6 py-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-surface" />
          ))}
        </div>
      </section>
    </div>
  );
}

function NotFound({ id, onBack }: { id: string; onBack: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-border bg-white p-10 text-center">
      <p className="text-sm font-semibold text-textPrimary">
        No patient found for ID "{id}"
      </p>
      <p className="text-xs leading-relaxed text-textMuted">
        The record may have been removed, or the link is out of date.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-textSecondary transition-colors hover:border-primary/30 hover:text-textPrimary"
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

  const isStudent = Boolean(patient?.course || patient?.school_year);
  const affiliation = isStudent
    ? [patient?.course, patient?.school_year].filter(Boolean).join(" • ")
    : patient?.department;

  const activeLabel = TABS.find((t) => t.key === activeTab)?.label ?? "";

  const activeRecords = useMemo(() => {
    if (!patient) return [];
    return [...(patient[activeTab] ?? [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [patient, activeTab]);

  const handleEditPersonalInfo = () => {
    setEditForm({
      name: patient?.patient_name ?? "",
      studentId: patient?.patient_id ?? "",
      yearSection: patient?.school_year ?? "",
      age: patient?.age ?? "",
      sex: patient?.sex ?? "",
      civilStatus: patient?.civil_status ?? "",
      birthday: patient?.birthday ?? "",
      mobileNumber: patient?.mobile_number ?? "",
      barangay: patient?.barangay ?? "",
      address: patient?.address ?? "",
    });
    setSaveError(null);
    setIsEditModalOpen(true);
  };

  const handleSavePersonalInfo = (form: Record<string, any>) => {
    if (!id) return;

    const payload = buildProfilePayload(form, patient);

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
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-textSecondary transition-colors hover:text-textPrimary"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to patients
        </button>

        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primaryDark font-heading text-sm font-semibold text-white">
                {getInitials(patient?.patient_name)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate font-heading text-lg font-semibold tracking-tight text-textPrimary">
                    {patient?.patient_name || "Unnamed patient"}
                  </h1>
                  <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-textSecondary">
                    {isStudent ? "Student" : "Faculty"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-textMuted">
                  <span className="font-medium text-textSecondary">
                    ID {patient?.patient_id || "—"}
                  </span>
                  {affiliation && <span> &nbsp;|&nbsp; {affiliation}</span>}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEditPersonalInfo}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primaryDark sm:self-center"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Edit information
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border bg-background/60 px-6 py-5 sm:grid-cols-4">
            <InfoItem
              label="Birthday"
              value={patient?.birthday ? formatDate(patient.birthday) : null}
            />
            <InfoItem label="Age" value={patient?.age} />
            <InfoItem label="Sex" value={patient?.sex} />
            <InfoItem label="Civil status" value={patient?.civil_status} />
            <InfoItem label="Mobile number" value={patient?.mobile_number} />
            <InfoItem label="Barangay" value={patient?.barangay} />
            <InfoItem label="Address" value={patient?.address} />
          </div>
      
        </section>

        <section className="flex h-[clamp(380px,55vh,560px)] flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card">
          <div className="flex shrink-0 items-end gap-6 overflow-x-auto border-b border-border px-6">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = patient?.[tab.key]?.length ?? 0;

              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveTab(tab.key)}
                  className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 pt-4 text-sm transition-colors ${
                    isActive
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent font-medium text-textMuted hover:text-textPrimary"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-surface text-textMuted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeRecords.length > 0 ? (
            <div key={activeTab} className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-surface text-[11px] font-semibold uppercase tracking-wider text-textMuted">
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
                      <td className="whitespace-nowrap px-6 py-3.5 tabular-nums text-textSecondary">
                        <time dateTime={record.date}>
                          {formatDate(record.date)}
                        </time>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-textPrimary">
                        {record.title}
                      </td>
                      <td className="px-4 py-3.5 text-textSecondary">
                        {record.provider || "—"}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums text-textSecondary">
                        {record.staff_id || "—"}
                      </td>
                      <td className="px-6 py-3.5 leading-relaxed text-textSecondary">
                        {record.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
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
          {saveError && (
            <div className="fixed inset-x-0 top-4 z-[60] mx-auto w-fit max-w-md rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-medium text-danger shadow-lg">
              {saveError}
            </div>
          )}
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