import { useState } from "react";
import { usePatientRegistrationsQuery, useReviewPatientRegistration } from "/@/hooks/query/PatientQuery";

interface PendingPatient {
  patient_id: string;
  registration_status: string;
  PATIENT_PROFILE?: { first_name?: string; last_name?: string; patient_id?: string }[];
}

export default function PatientRegistrations() {
  const { data, isLoading, isError, error, refetch } = usePatientRegistrationsQuery("pending");
  const reviewMutation = useReviewPatientRegistration();
  const [actionError, setActionError] = useState<string | null>(null);

  const items: PendingPatient[] = Array.isArray(data) ? data : [];

  const review = async (patientId: string, status: "approved" | "rejected") => {
    setActionError(null);
    try {
      await reviewMutation.mutateAsync({ patientId, status });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Pending Registrations</h1>
      {isLoading && <p>Loading…</p>}
      {isError && <p className="text-red-600">{error instanceof Error ? error.message : "Failed to load"}</p>}
      {actionError && <p className="text-red-600">{actionError}</p>}
      <div className="space-y-3">
        {items.map((p) => {
          const profile = Array.isArray(p.PATIENT_PROFILE) ? p.PATIENT_PROFILE[0] : null;
          const name = profile ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() : p.patient_id;
          return (
            <div key={p.patient_id} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">{name || p.patient_id}</p>
                <p className="text-sm text-textMuted">{p.patient_id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  disabled={reviewMutation.isPending}
                  onClick={() => review(p.patient_id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  disabled={reviewMutation.isPending}
                  onClick={() => review(p.patient_id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
        {!isLoading && items.length === 0 && <p className="text-textMuted">No pending registrations.</p>}
      </div>
      <button className="text-sm text-primary" onClick={() => refetch()}>Refresh</button>
    </div>
  );
}