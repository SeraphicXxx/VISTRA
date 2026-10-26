import { apiClient } from "@/api/axios_client";
import { API_ENDPOINTS } from "@/config/ApiConfig";
import { handleServiceErrors, ok } from "@/api/service_helpers";

/**
 * Shape returned by the patient_summary view (GET /patients/profiles/{id}/).
 * Columns depend on the DB view; fields are optional with safe fallbacks.
 */
export type PatientProfileSummary = {
  patient_id: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  sex?: string;
  civil_status?: string;
  course?: string;
  medical_status?: string;
  dental_status?: string;
  [key: string]: unknown;
};

/**
 * Backend paginated appointment response (GET /appointments/).
 */
export type BackendAppointmentResponse = {
  items: BackendAppointment[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

/**
 * Backend appointment row (GET /appointments/ items[]).
 */
export type BackendAppointment = {
  id: number;
  patient_id: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  reason?: string | null;
  location?: string | null;
  staff_id?: string | null;
  notes?: string | null;
};

/**
 * Mobile-friendly appointment used by overview/appointments screens.
 */
export type MobileAppointment = {
  id: string;
  type: string;
  doctor: string;
  date: string;
  time: string;
  status: "pending" | "upcoming" | "completed" | "declined";
  reason?: string;
};

export const patientService = {
  getProfile: handleServiceErrors<[], PatientProfileSummary>(
    async () => {
      const { data } = await apiClient<{
        success: boolean;
        data: PatientProfileSummary;
      }>(API_ENDPOINTS.patient.get_my_profile);
      return data.data;
    }
  ),

  getAppointments: handleServiceErrors<[], BackendAppointment[]>(
    async () => {
      const { data } = await apiClient<{
        success: boolean;
        data: BackendAppointmentResponse;
      }>(API_ENDPOINTS.appointment.get_appointment);
      return data.data.items;
    }
  ),
};

/**
 * Map a backend appointment row to the mobile appointment shape.
 */
export function mapBackendAppointment(
  a: BackendAppointment
): MobileAppointment {
  const start = new Date(a.scheduled_start);
  const statusMap: Record<string, MobileAppointment["status"]> = {
    pending: "pending",
    confirmed: "upcoming",
    upcoming: "upcoming",
    completed: "completed",
    declined: "declined",
  };

  return {
    id: String(a.id),
    type: a.reason || "Medical check-up",
    doctor: "Clinic",
    date: start.toISOString(),
    time: start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: statusMap[a.status] ?? "pending",
    reason: a.reason ?? undefined,
  };
}

export { ok };
