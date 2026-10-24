import { brand } from "@/constants/theme";
import type { PatientAppointment } from "@/mock/appointments";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { daysUntil, formatDate } from "@/utils/dates";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

interface UpcomingAppointmentCardProps {
  appointment: PatientAppointment | null;
  onVideoPress?: () => void;
}

const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export function UpcomingAppointmentCard({
  appointment,
  onVideoPress,
}: UpcomingAppointmentCardProps) {
  if (!appointment) {
    return (
      <View style={styles.upcomingWrap}>
        <View style={styles.upcomingTag}>
          <Text style={styles.upcomingTagText}>UPCOMING APPOINTMENT</Text>
        </View>
        <View style={styles.emptyUpcoming}>
          <Text style={styles.emptyUpcomingText}>
            No upcoming appointment. Book one anytime.
          </Text>
        </View>
      </View>
    );
  }

  const days = daysUntil(appointment.date);
  const when =
    days > 0
      ? `In ${days} day${days === 1 ? "" : "s"}`
      : days === 0
        ? "Today"
        : "Past";

  return (
    <View style={styles.upcomingWrap}>
      <View style={styles.upcomingTag}>
        <Text style={styles.upcomingTagText}>UPCOMING APPOINTMENT</Text>
      </View>

      <LinearGradient
        colors={[brand.primary, brand.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.upcomingCard}
      >
        <View style={styles.doctorRow}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>
              {initialsOf(appointment.doctor)}
            </Text>
          </View>
          <View style={styles.doctorBody}>
            <Text style={styles.doctorName}>{appointment.doctor}</Text>
            <Text style={styles.doctorSpecialty}>{appointment.type}</Text>
          </View>
          <Pressable onPress={onVideoPress} style={styles.videoButton}>
           <MaterialCommunityIcons name="stethoscope" size={20} color={brand.primaryDark} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={15} color="#ffffff" />
            <Text style={styles.metaText}>{formatDate(appointment.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color="#ffffff" />
            <Text style={styles.metaText}>{appointment.time}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>{when}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}