import { Reveal } from "@/components/animation/Reveal";
import { HealthRiskCard } from "@/components/overview/HealthRiskCard";
import { HealthSummaryRow } from "@/components/overview/HealthSummaryRow";
import { RecentVisitsPanel } from "@/components/overview/RecentVisitsPanel";
import { UpcomingAppointmentCard } from "@/components/overview/UpcomingAppointmentCard";
import { VitalsRow } from "@/components/overview/VitalsRow";
import { WelcomeHero } from "@/components/overview/WelcomeHero";
import {
  PATIENT_APPOINTMENTS,
  type PatientAppointment,
} from "@/mock/appointments";
import { PATIENT_HEALTH_RISKS } from "@/mock/healthRisk";
import {
  OVERVIEW_PATIENT,
  OVERVIEW_VISITS,
  type Visit,
} from "@/mock/overview";
import { PATIENT_VITALS } from "@/mock/vitals";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

const FULL_WIDTH = { alignSelf: "stretch" as const };

const byDateAsc = (a: PatientAppointment, b: PatientAppointment) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

const byDateDesc = (a: Visit, b: Visit) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export default function OverviewScreen() {
  const nextAppointment = useMemo<PatientAppointment | null>(
    () =>
      [...PATIENT_APPOINTMENTS]
        .filter((a) => a.status !== "completed")
        .sort(byDateAsc)[0] ?? null,
    [],
  );

  const recentVisits = useMemo<Visit[]>(
    () => [...OVERVIEW_VISITS].sort(byDateDesc).slice(0, 6),
    [],
  );

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Reveal delay={0} distance={16} style={FULL_WIDTH}>
          <WelcomeHero
            name={OVERVIEW_PATIENT.name}
            studentId={OVERVIEW_PATIENT.id}
          />
        </Reveal>

        <Reveal delay={120} distance={20} style={FULL_WIDTH}>
          <UpcomingAppointmentCard appointment={nextAppointment} />
        </Reveal>

        <Reveal delay={240} distance={20} style={FULL_WIDTH}>
          <HealthSummaryRow
            visitCount={OVERVIEW_VISITS.length}
            medicalStatus={OVERVIEW_PATIENT.medicalStatus}
          />
        </Reveal>

        <Reveal delay={360} distance={20} style={FULL_WIDTH}>
          <VitalsRow vitals={PATIENT_VITALS} />
        </Reveal>

        <Reveal delay={480} distance={20} style={FULL_WIDTH}>
          <HealthRiskCard predictions={PATIENT_HEALTH_RISKS} />
        </Reveal>

        <Reveal delay={600} distance={24} style={FULL_WIDTH}>
          <RecentVisitsPanel visits={recentVisits} />
        </Reveal>
      </ScrollView>
    </View>
  );
}