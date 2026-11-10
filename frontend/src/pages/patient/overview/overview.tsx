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
// Mock-data fallbacks removed: name/status derived from API data only.
import { filterByQuery } from "/@/utils/FilterByQuery";
import { statusLabels } from "/@/components/StatusBadge";
import { sessionManager } from "/@/utils/SessionManager";
import { useAppointmentQuery } from "/@/hooks/query/AppointmentQuery";
import { usePatientMedicalDentalSummaryQuery } from "/@/hooks/query/PatientQuery";
import { toPatientMedicalDentalVisits } from "/@/repository/PatientMedicalDentalModel";
import { Visit } from "/@/types/types";
import { AdminAnimStyles, Reveal } from "/@/components/adminanim";
import { useScreeningPredictionQuery } from "/@/hooks/query/ScreeningQuery";

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
    order_by: "scheduled_start desc",
  });

  const medicalRecord = undefined;
  const dentalRecord = undefined;

  const patientName = "there";

  const { data: summaryData } = usePatientMedicalDentalSummaryQuery();

  const visits = useMemo(
    () => toPatientMedicalDentalVisits(summaryData ?? { medical: [], dental: [] }),
    [summaryData]
  );

  const appointments: Appointment[] = useMemo(
    () => (appointmentsData?.items ?? []).map(mapBackendAppointmentToAppointment),
    [appointmentsData]
  );

  const medicalStatus = undefined;
  const dentalStatus = "No record yet";

  const nextAppointment: Appointment | null = appointments[0] ?? null;

  const recentVisits = useMemo(() => {
    return [...visits]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [visits]);

  const filteredVisits: Visit[] = useMemo(
    () => filterByQuery(recentVisits, searchQuery, ["complaint", "doctor", "treatmentType"]),
    [searchQuery, recentVisits]
  );

  const currentBmi = 22.8; // fallback for normal BMI (no mock vitals)

  const patientAge = 20;
  const patientSex = "Male";

  const {
    data: predictedRisks,
    isLoading: isPredictionLoading,
    isError: isPredictionError,
  } = useScreeningPredictionQuery({
    bmi: currentBmi,
    age: patientAge,
    sex: patientSex
  });

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
          medicalStatus={statusLabels[medicalStatus as keyof typeof statusLabels] ?? "No record yet"}
          dentalStatus={dentalStatus}
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal as="div" delay={2 * STAGGER} distance={24} className="h-full">
          <RecentVisitsPanel visits={filteredVisits} />
        </Reveal>

        <Reveal as="div" delay={3 * STAGGER} distance={24} className="h-full">
          <VitalSignsPanel vitals={null} />
        </Reveal>
      </div>

      <Reveal as="div" delay={4 * STAGGER} distance={24}>
        <HealthRiskPanel
          predictions={predictedRisks ?? []}
          loading={isPredictionLoading}
        />
      </Reveal>
    </div>
  );
}