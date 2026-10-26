import { APPOINTMENT_STATUS_META } from "@/constants/status";
import type { PatientAppointment } from "@/mock/appointments";
import { appointmentsStyles as styles } from "@/styles/appointments.styles";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface AppointmentCardProps {
  appointment: PatientAppointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const date = new Date(appointment.date);
  const status = APPOINTMENT_STATUS_META[appointment.status];

  return (
    <Pressable
      onPress={() => router.push(`/appointment/${appointment.id}`)}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <View style={styles.card}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>{date.getDate()}</Text>
          <Text style={styles.dateMonth}>{MONTHS[date.getMonth()]}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardType} numberOfLines={1}>
              {appointment.type}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: status.background }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <Text style={styles.cardMeta}>
            {appointment.doctor} · {appointment.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}