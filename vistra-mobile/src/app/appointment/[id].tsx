import { Reveal } from "@/components/animation/Reveal";
import { SubHeader } from "@/components/navigation/SubHeader";
import { APPOINTMENT_STATUS_META } from "@/constants/status";
import { PATIENT_APPOINTMENTS, type AppointmentStatus } from "@/mock/appointments";
import { appointmentDetailStyles as styles } from "@/styles/appointmentDetail.styles";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STEP_INDEX: Record<AppointmentStatus, number> = {
  pending: 0,
  upcoming: 1,
  completed: 2,
  declined: 1,
};

const DAY_MS = 86400000;

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = PATIENT_APPOINTMENTS.find((a) => a.id === id);

  if (!appointment) {
    return (
      <View style={styles.safe}>
        <SubHeader title="Appointment" backTo="/(patient)/appointments" />
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No appointment found</Text>
          <Text style={styles.emptyText}>This appointment may have been removed.</Text>
        </View>
      </View>
    );
  }

  const meta = APPOINTMENT_STATUS_META[appointment.status];
  const date = new Date(appointment.date);
  const dateLabel = `${MONTHS_LONG[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(appointment.date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / DAY_MS);

  const countNumber = diff === 0 ? "Today" : String(Math.abs(diff));
  const countUnit = diff === 0 ? "" : diff > 0 ? "days to go" : "days ago";

  const steps =
    appointment.status === "declined"
      ? ["Requested", "Declined"]
      : ["Requested", "Confirmed", "Completed"];
  const currentIndex = STEP_INDEX[appointment.status];

  return (
    <View style={styles.safe}>
      <SubHeader title="Appointment" backTo="/(patient)/appointments" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal delay={0} distance={14}>
          <Text style={styles.eyebrow}>APPOINTMENT</Text>
        </Reveal>

        <Reveal delay={80} distance={14}>
          <View style={styles.hero}>
            <View style={styles.heroOrb} />

            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>{diff >= 0 ? "Upcoming" : "Past visit"}</Text>
              <View style={styles.heroPill}>
                <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
                <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </View>

            <View style={styles.heroCountRow}>
              <Text style={styles.heroCount}>{countNumber}</Text>
              {countUnit !== "" && <Text style={styles.heroCountUnit}>{countUnit}</Text>}
            </View>

            <View style={styles.heroDivider} />

            <Text style={styles.heroType}>{appointment.type}</Text>
            <Text style={styles.heroMeta}>
              {appointment.doctor} · {dateLabel}
            </Text>
          </View>
        </Reveal>

        <Reveal delay={160} distance={14}>
          <View style={styles.factRow}>
            <View style={styles.fact}>
              <Text style={styles.factLabel}>Time</Text>
              <Text style={styles.factValue}>{appointment.time}</Text>
            </View>
            <View style={styles.fact}>
              <Text style={styles.factLabel}>Course</Text>
              <Text style={styles.factValue}>{appointment.course ?? "—"}</Text>
            </View>
          </View>
        </Reveal>

        <Reveal delay={240} distance={14}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Progress</Text>

            <View>
              {steps.map((label, index) => {
                const reached = index <= currentIndex;
                const last = index === steps.length - 1;

                return (
                  <View key={label} style={styles.stepRow}>
                    <View style={styles.stepRail}>
                      <View
                        style={[
                          styles.stepDot,
                          reached && { backgroundColor: meta.color, borderColor: meta.color },
                        ]}
                      />
                      {!last && (
                        <View
                          style={[
                            styles.stepLine,
                            index < currentIndex && { backgroundColor: meta.color },
                          ]}
                        />
                      )}
                    </View>
                    <Text style={[styles.stepLabel, reached && { color: meta.color }]}>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={[styles.banner, { backgroundColor: meta.background }]}>
              <View style={[styles.bannerDot, { backgroundColor: meta.color }]} />
              <Text style={styles.bannerText}>{meta.message}</Text>
            </View>
          </View>
        </Reveal>

        <Reveal delay={320} distance={14}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <View style={styles.notesBlock}>
              <View style={styles.notesBar} />
              <Text style={styles.notesText}>
                {appointment.reason ?? "No notes provided."}
              </Text>
            </View>
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}