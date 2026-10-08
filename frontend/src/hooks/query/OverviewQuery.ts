import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "/@/api/appointments.api";
import { getDentalVisit } from "/@/api/dental.api";
import { getMedicalVisit } from "/@/api/medical.api";

/**
 * Overview panel server state.
 * Single consolidated query to avoid duplicate mounts/refetches.
 * - Appointments: GET /appointments/
 * - Consultations: merged GET /medical/ + GET /dental/
 */
export function useOverviewData(appointmentLimit = 6, consultationLimit = 8) {
    return useQuery({
        queryKey: ["overview", appointmentLimit, consultationLimit],
        queryFn: async ({ signal }) => {
            const consultationHalf = Math.ceil(consultationLimit / 2);
            const [appointmentsRes, medicalRes, dentalRes] = await Promise.all([
                getAllAppointments({ page: 1, page_size: appointmentLimit }, signal),
                getMedicalVisit({ page: 1, page_size: consultationHalf }, signal),
                getDentalVisit({ page: 1, page_size: consultationHalf }, signal),
            ]);

            if (!appointmentsRes.data.data) {
                throw new Error("Appointment data is missing");
            }
            if (!medicalRes.data.data || !dentalRes.data.data) {
                throw new Error("Consultation data is missing");
            }

            return {
                appointments: appointmentsRes.data.data,
                medical: medicalRes.data.data,
                dental: dentalRes.data.data,
            };
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 1,
    });
}