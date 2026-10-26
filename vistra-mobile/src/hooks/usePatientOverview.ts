import { useQuery } from "@tanstack/react-query";
import { patientService, type MobileAppointment } from "@/api/services/patient.service";
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
      const result = await patientService.getAppointments();
      const data = assertSuccess<
        { id: number; scheduled_start: string; status: string; reason?: string | null }[]
      >(result as any);
      return data.map(mapBackendAppointment);
    },
  });
}
