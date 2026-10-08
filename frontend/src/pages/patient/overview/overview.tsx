import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import PatientStatsGrid from "./stats";
import WelcomeHero from "./components/WelcomeHero";
import NextAppointmentSpotlight from "./components/NextAppointmentSpotlight";
import RecentVisitsPanel from "./components/RecentVisitsPanel";
import {
  mapBackendAppointmentToAppointment,
  resolveStudentId,
  Appointment,
} from "../appointments/appointmentsData";
import { myMedicalRecords, myVisits } from "../medical/medicalData";
import { filterByQuery } from "/@/utils/FilterByQuery.js";
import { statusLabels } from "/@/components/StatusBadge";
import { sessionManager } from "/@/utils/SessionManager";
import { useAppointmentQuery } from "/@/hooks/query/AppointmentQuery";
import {Visit} from "/@/types/types";

const DEFAULT_STUDENT_ID = "20230518-S";

interface OutletContextShape {
  searchQuery: string;
}

export default function PatientOverviewTab() {
  const { searchQuery } = useOutletContext<OutletContextShape>();
  const user = sessionManager.getUser();
  const studentId = resolveStudentId(user);
  const { data: appointmentsData } = useAppointmentQuery({
    patient_id: studentId,
    page_size: 100,
  });

  const patientName = myMedicalRecords[studentId]?.name ?? "there";

  const visits = useMemo(() => myVisits[studentId] ?? [], [studentId]);
  const appointments: Appointment[] = useMemo(
    () => (appointmentsData?.items ?? []).map(mapBackendAppointmentToAppointment),
    [appointmentsData]
  );
  const medicalStatus = myMedicalRecords[studentId]?.status;

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [appointments],
  );
  const nextAppointment: Appointment | null = sortedAppointments[0] ?? null;

  const recentVisits = useMemo(() => {
    return [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  }, [visits]);

  const filteredVisits: Visit[] = useMemo(
    () => filterByQuery(recentVisits, searchQuery, ["complaint", "doctor", "treatmentType"]),
    [searchQuery, recentVisits],
  );

  return (
    <div className="flex flex-col gap-6">
      <WelcomeHero name={patientName} studentId={studentId} />

      <PatientStatsGrid
        nextAppointment={nextAppointment}
        visitCount={visits.length}
        medicalStatus={statusLabels[medicalStatus] ?? medicalStatus}
        dentalStatus="No record yet"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentVisitsPanel visits={filteredVisits} />
        </div>

        <div className="flex flex-col gap-6">
          <NextAppointmentSpotlight appointment={nextAppointment} />
          {/* <UpcomingList appointments={upcomingAfterNext} /> */}
        </div>
      </div>
    </div>
  );
}
