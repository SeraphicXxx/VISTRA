import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import PatientStatsGrid from "./stats";
import WelcomeHero from "./components/WelcomeHero";
import RecentVisitsPanel from "./components/RecentVisitsPanel";
import HealthRiskPanel from "./components/HealthRiskPanel";
import VitalSignsPanel from "./components/VitalSignsPanel";
import {
  mapBackendAppointmentToAppointment,
  resolveStudentId,
  Appointment,
} from "../appointments/appointmentsData";
import { myMedicalRecords } from "../medical/medicalData";
import { myDentalRecords } from "../dental/dentalData";
import { PATIENT_HEALTH_RISKS } from "./healthRisk";
import { PATIENT_VITALS } from "./vitalsData";
import { filterByQuery } from "/@/utils/FilterByQuery.js";
import { statusLabels } from "/@/components/StatusBadge";
import { sessionManager } from "/@/utils/SessionManager";
import { useAppointmentQuery } from "/@/hooks/query/AppointmentQuery";
import { usePatientMedicalDentalSummaryQuery } from "/@/hooks/query/PatientQuery";
import { toPatientMedicalDentalVisits } from "/@/repository/PatientMedicalDentalModel";
import { Visit } from "/@/types/types";
import { AdminAnimStyles, Reveal } from "/@/components/adminanim";

interface OutletContextShape {
  searchQuery: string;
}

const STAGGER = 0.08;

export default function PatientOverviewTab() {
  const { searchQuery } = useOutletContext<OutletContextShape>();
  const user = sessionManager.getUser();
  const studentId = resolveStudentId(user);

  const { data: appointmentsData } = useAppointmentQuery({
    patient_id: studentId,
    page_size: 100,
  });

  const medicalRecord = myMedicalRecords[studentId];
  const dentalRecord = myDentalRecords[studentId];

  const patientName = medicalRecord?.name ?? dentalRecord?.name ?? "there";

  const { data: summaryData } = usePatientMedicalDentalSummaryQuery();

  const visits = useMemo(
    () => toPatientMedicalDentalVisits(summaryData ?? { medical: [], dental: [] }),
    [summaryData]
  );

  const appointments: Appointment[] = useMemo(
    () => (appointmentsData?.items ?? []).map(mapBackendAppointmentToAppointment),
    [appointmentsData]
  );

  const medicalStatus = medicalRecord?.status;
  const dentalStatus = dentalRecord?.recordId
    ? statusLabels[dentalRecord.status] ?? dentalRecord.status
    : "No record yet";

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [appointments]
  );
  const nextAppointment: Appointment | null = sortedAppointments[0] ?? null;

  const recentVisits = useMemo(() => {
    return [...visits]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [visits]);

  const filteredVisits: Visit[] = useMemo(
    () => filterByQuery(recentVisits, searchQuery, ["complaint", "doctor", "treatmentType"]),
    [searchQuery, recentVisits]
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminAnimStyles />

      <Reveal as="div" delay={0 * STAGGER} distance={16}>
        <WelcomeHero name={patientName} studentId={studentId} />
      </Reveal>

      <Reveal as="div" delay={1 * STAGGER} distance={20}>
        <PatientStatsGrid
          nextAppointment={nextAppointment}
          visitCount={visits.length}
          medicalStatus={statusLabels[medicalStatus] ?? medicalStatus}
          dentalStatus={dentalStatus}
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal as="div" delay={2 * STAGGER} distance={24} className="h-full">
          <RecentVisitsPanel visits={filteredVisits} />
        </Reveal>

        <Reveal as="div" delay={3 * STAGGER} distance={24} className="h-full">
          <VitalSignsPanel vitals={PATIENT_VITALS} />
        </Reveal>
      </div>

      <Reveal as="div" delay={4 * STAGGER} distance={24}>
        <HealthRiskPanel predictions={PATIENT_HEALTH_RISKS} />
      </Reveal>
    </div>
  );
}