import { useQuery } from "@tanstack/react-query";
import { patientService, type MobileAppointment, type BackendVitalSigns } from "@/api/services/patient.service";
import { mapBackendVitalSignsToVitalSigns } from "@/utils/mapper";
import { ServiceError } from "@/api/service_helpers";

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapBackendAppointment(a: {
  id: number;
  scheduled_start: string;
  status: string;
  reason?: string | null;
}): MobileAppointment {
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
    time: formatTime(a.scheduled_start),
    status: statusMap[a.status] ?? "pending",
    reason: a.reason ?? undefined,
  };
}

function assertSuccess<T>(
  result:
    | { success: true; data: T }
    | { success: false; message: string; code?: string | number }
): T {
  if (!result.success) {
    throw new ServiceError(result.message, result.code);
  }
  return (result as { success: true; data: T }).data;
}

export function usePatientProfile() {
  return useQuery({
    queryKey: ["patient", "profile"],
    queryFn: async () => {
      const result = await patientService.getProfile();
      const data = assertSuccess<Record<string, unknown>>(result as any);
      return {
        id: String(data.patient_id ?? "--"),
        name: String(data.patient_name ?? "Patient"),
        age: data.age as number | undefined,
        sex: data.sex as string | undefined,
        medicalStatus: undefined,
        dentalStatus: undefined,
      };
    },
  });
}

export function usePatientAppointments() {
  return useQuery({
    queryKey: ["patient", "appointments"],
    queryFn: async () => {
      const result = await patientService.getMyAppointments();
      const data = assertSuccess<
        { id: number; scheduled_start: string; status: string; reason?: string | null }[]
      >(result as any);
      return data.map(mapBackendAppointment);
    },
  });
}

export function usePatientLatestVitalSigns() {
  return useQuery({
    queryKey: ["patient", "latest-vital-signs"],
    queryFn: async () => {
      const result = await patientService.getLatestVitalSigns();
      if (!result.success) {
        return null;
      }
      const data = (result as { success: true; data: BackendVitalSigns }).data;
      return mapBackendVitalSignsToVitalSigns(data);
    },
    refetchOnWindowFocus: false,
  });
}

export type RecentVisit = {
  id: string;
  complaint: string;
  doctor: string;
  date: string;
  treatmentType: string;
};

export function usePatientMedicalDentalSummary() {
  return useQuery({
    queryKey: ["patient", "medical-dental-summary"],
    queryFn: async () => {
      const result = await patientService.getMedicalDentalSummary();
      const data = assertSuccess<{
        medical: Array<{
          id: number | string;
          date: string;
          title: string;
          notes?: string | null;
          provider?: string | null;
        }>;
        dental: Array<{
          id: number | string;
          date: string;
          title: string;
          notes?: string | null;
          provider?: string | null;
        }>;
      }>(result as any);

      const medical: RecentVisit[] = (data.medical ?? []).map((m) => ({
        id: String(m.id),
        complaint: m.title,
        doctor: m.provider ?? "Clinic",
        date: m.date,
        treatmentType: "Medical",
      }));

      const dental: RecentVisit[] = (data.dental ?? []).map((d) => ({
        id: String(d.id),
        complaint: d.title,
        doctor: d.provider ?? "Clinic",
        date: d.date,
        treatmentType: "Dental",
      }));

      return [...medical, ...dental]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 6);
    },
  });
}
