import { Reveal } from "@/components/animation/Reveal";
import { NextAppointmentSpotlight } from "@/components/overview/NextAppointmentSpotlight";
import { RecentVisitsPanel } from "@/components/overview/RecentVisitsPanel";
import { StatsGrid } from "@/components/overview/StatsGrid";
import { WelcomeHero } from "@/components/overview/WelcomeHero";
import {
  OVERVIEW_APPOINTMENTS,
  OVERVIEW_PATIENT,
  OVERVIEW_VISITS,
  type Appointment,
  type Visit,
} from "@/mock/overview";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

const byDateAsc = (a: Appointment, b: Appointment) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

const byDateDesc = (a: Visit, b: Visit) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export default function OverviewScreen() {
  const nextAppointment = useMemo<Appointment | null>(
    () => [...OVERVIEW_APPOINTMENTS].sort(byDateAsc)[0] ?? null,
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
        <Reveal delay={0} distance={16}>
          <WelcomeHero
            name={OVERVIEW_PATIENT.name}
            studentId={OVERVIEW_PATIENT.id}
          />
        </Reveal>

        <StatsGrid
          startDelay={120}
          nextAppointment={nextAppointment}
          visitCount={OVERVIEW_VISITS.length}
          medicalStatus={OVERVIEW_PATIENT.medicalStatus}
          dentalStatus={OVERVIEW_PATIENT.dentalStatus}
        />

        <Reveal delay={480} distance={24}>
          <NextAppointmentSpotlight appointment={nextAppointment} />
        </Reveal>

        <Reveal delay={600} distance={24}>
          <RecentVisitsPanel visits={recentVisits} />
        </Reveal>
      </ScrollView>
    </View>
  );
}