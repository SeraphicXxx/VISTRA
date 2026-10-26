import { Reveal } from "@/components/animation/Reveal";
import { HealthSummaryRow } from "@/components/overview/HealthSummaryRow";
import { RecentVisitsPanel } from "@/components/overview/RecentVisitsPanel";
import { UpcomingAppointmentCard } from "@/components/overview/UpcomingAppointmentCard";
import { WelcomeHero } from "@/components/overview/WelcomeHero";
import { ComingSoonCard } from "@/components/overview/ComingSoonCard";
import { brand } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { usePatientAppointments, usePatientProfile } from "@/hooks/usePatientOverview";
import { useMemo } from "react";

const FULL_WIDTH = { alignSelf: "stretch" as const };

export default function OverviewScreen() {
  const profile = usePatientProfile();
  const appointments = usePatientAppointments();

  const data = useMemo(() => {
    const upcoming = appointments.data
      ? appointments.data
          .filter((a) => a.status !== "completed")
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )[0] ?? null
      : null;

    const recent = appointments.data
      ? appointments.data
          .filter((a) => a.status === "completed")
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 6)
      : [];
    console.log(profile);
    return {
      name: profile.data?.name ?? "Patient",
      studentId: profile.data?.id ?? "--",
      age: profile.data?.age,
      medicalStatus: profile.data?.medicalStatus,
      upcomingAppointment: upcoming,
      recentVisits: recent.map((a) => ({
        id: a.id,
        complaint: a.type,
        doctor: a.doctor,
        date: a.date,
        treatmentType: a.status,
      })),
      visitCount: appointments.data ? appointments.data.length : 0,
    };
  }, [profile.data, appointments.data]);

  const isLoading = profile.isLoading || appointments.isLoading;

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Reveal delay={0} distance={16} style={FULL_WIDTH}>
            <View style={styles.comingSoonContainer}>
              <Ionicons name="reload-circle" size={32} color={brand.primaryDark} />
              <Text style={styles.comingSoonTitle}>Loading your overview…</Text>
            </View>
          </Reveal>
        ) : (
          <>
            <Reveal delay={0} distance={16} style={FULL_WIDTH}>
              <WelcomeHero name={data.name} studentId={data.studentId} />
            </Reveal>

            <Reveal delay={120} distance={20} style={FULL_WIDTH}>
              <UpcomingAppointmentCard
                appointment={{
                  id: data.upcomingAppointment?.id ?? "0",
                  type: data.upcomingAppointment?.type ?? "Medical check-up",
                  doctor: data.upcomingAppointment?.doctor ?? "Clinic",
                  date: data.upcomingAppointment?.date ?? new Date().toISOString(),
                  time: data.upcomingAppointment?.time ?? "--:--",
                  status: (data.upcomingAppointment?.status ??
                    "pending") as
                    | "pending"
                    | "upcoming"
                    | "completed"
                    | "declined",
                  reason: data.upcomingAppointment?.reason,
                }}
              />
            </Reveal>

            <Reveal delay={240} distance={20} style={FULL_WIDTH}>
              <HealthSummaryRow
                visitCount={data.visitCount}
                medicalStatus={data.medicalStatus ?? "No record yet"}
              />
            </Reveal>

            <Reveal delay={360} distance={20} style={FULL_WIDTH}>
              <ComingSoonCard
                title="Vital Signs"
                subtitle="Your latest measurements will appear here after your next check-up."
                iconName="heart-pulse"
              />
            </Reveal>

            <Reveal delay={480} distance={20} style={FULL_WIDTH}>
              <ComingSoonCard
                title="Health Risk Prediction"
                subtitle="Estimated risk percentages based on your records will appear here."
                iconName="alert-circle-outline"
              />
            </Reveal>

            <Reveal delay={600} distance={24} style={FULL_WIDTH}>
              <RecentVisitsPanel visits={data.recentVisits} />
            </Reveal>
          </>
        )}
      </ScrollView>
    </View>
  );
}
