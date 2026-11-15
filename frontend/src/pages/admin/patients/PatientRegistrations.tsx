import { useEffect, useState } from "react";
import { apiClient } from "/@/api/axios_client";
import { API_ENDPOINTS } from "/@/config/ApiConfig";


interface PendingPatient {
  patient_id: string;
  registration_status: string;
  PATIENT_PROFILE?: { first_name?: string; last_name?: string; patient_id?: string }[];
}

export default function PatientRegistrations() {
  const [items, setItems] = useState<PendingPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient<{ data: PendingPatient[] }>(
        API_ENDPOINTS.patient.registrations("pending")
      );
      setItems((data as any)?.data ?? (data as any) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (patientId: string, status: "approved" | "rejected") => {
    try {
      await apiClient(API_ENDPOINTS.patient.review_registration(patientId), {
        method: "PATCH",
        data: { status },
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Pending Registrations</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
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
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => review(p.patient_id, "approved")}>Approve</button>
                <button className="rounded-xl border border-border px-4 py-2 text-sm font-semibold" onClick={() => review(p.patient_id, "rejected")}>Reject</button>
              </div>
            </div>
          );
        })}
        {!loading && items.length === 0 && <p className="text-textMuted">No pending registrations.</p>}
      </div>
    </div>
  );
}
