import { LiveDot } from "@/components/ui/LiveDot";
import { brand } from "@/constants/theme";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { todayLabel } from "@/utils/dates";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface WelcomeHeroProps {
  name: string;
  studentId: string;
  onBookPress?: () => void;
}

export function WelcomeHero({ name, studentId, onBookPress }: WelcomeHeroProps) {
  const firstName = name.split(" ")[0];

  return (
    <View style={styles.hero}>
      <View style={styles.heroGlow} />

      <View style={styles.chipRow}>
        <View style={styles.idChip}>
          <Text style={styles.idChipText}>{studentId}</Text>
        </View>
        <View style={styles.dateChip}>
          <LiveDot />
          <Text style={styles.dateChipText}>{todayLabel()}</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Welcome back, {firstName}.</Text>
      <Text style={styles.heroSubtitle}>
        Here's what's happening with your health records and upcoming visits.
      </Text>

      <Pressable
        onPress={onBookPress}
        style={({ pressed }) => [
          heroStyles.bookLink,
          pressed && heroStyles.pressed,
        ]}
      >
        <Text style={heroStyles.bookLinkText}>Book an Appointment →</Text>
      </Pressable>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  bookLink: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  bookLinkText: {
    marginTop: 16,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: brand.primaryDark,
  },
  bookArrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: brand.primaryDark,
  },
  pressed: {
    opacity: 0.7,
  },
});