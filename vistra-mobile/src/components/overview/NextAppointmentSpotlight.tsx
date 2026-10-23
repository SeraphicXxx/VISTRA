import { brand } from "@/constants/theme";
import type { Appointment } from "@/mock/overview";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { daysUntil, formatDate } from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

interface NextAppointmentSpotlightProps {
  appointment: Appointment | null;
  onBookPress?: () => void;
  onViewPress?: () => void;
}

export function NextAppointmentSpotlight({
  appointment,
  onBookPress,
  onViewPress,
}: NextAppointmentSpotlightProps) {
  if (!appointment) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.spotlightLabelRow}>
          <Ionicons name="calendar-outline" size={14} color={brand.primary} />
          <Text style={[styles.spotlightLabel, { color: brand.primary }]}>
            Next Appointment
          </Text>
        </View>
        <Text style={styles.emptyText}>
          You don't have anything scheduled. Booking takes less than a minute.
        </Text>
        <Pressable onPress={onBookPress} style={styles.emptyLink}>
          <Text style={styles.emptyLinkText}>Book an appointment</Text>
          <Ionicons name="arrow-forward" size={14} color={brand.primary} />
        </Pressable>
      </View>
    );
  }

  const days = daysUntil(appointment.date);

  return (
    <LinearGradient
      colors={[brand.primary, brand.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.spotlight}
    >
      <View style={styles.spotlightGlow} />

      <View style={styles.spotlightLabelRow}>
        <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.75)" />
        <Text style={styles.spotlightLabel}>Next Appointment</Text>
      </View>

      {days > 0 ? (
        <View style={styles.countdownRow}>
          <Text style={styles.countdownNumber}>{days}</Text>
          <Text style={styles.countdownWord}>days away</Text>
        </View>
      ) : (
        <Text style={styles.countdownText}>{days === 0 ? "Today" : "Past"}</Text>
      )}

      <Text style={styles.appointmentType}>{appointment.type}</Text>
      <Text style={styles.appointmentWhen}>
        {formatDate(appointment.date)} · {appointment.time}
      </Text>

      <Pressable onPress={onViewPress} style={styles.spotlightLink}>
        <Text style={styles.spotlightLinkText}>View details</Text>
        <Ionicons name="arrow-forward" size={14} color="#ffffff" />
      </Pressable>
    </LinearGradient>
  );
}