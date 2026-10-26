import { overviewStyles as styles } from "@/styles/overview.styles";
import { Text, View } from "react-native";

interface WelcomeHeroProps {
  name: string;
  studentId: string;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const displayName = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? `${parts[parts.length - 1][0]}.` : "";
  return [first, last].filter(Boolean).join(" ");
};

export function WelcomeHero({ name, studentId }: WelcomeHeroProps) {
  return (
    <View>
      <View style={styles.greetingRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialsOf(name)}</Text>
        </View>
        <View style={styles.greetingBody}>
          <Text style={styles.greetingSmall}>Welcome back</Text>
          <Text style={styles.greetingName}>{displayName(name)}</Text>
        </View>
        <View style={styles.idChip}>
          <Text style={styles.idChipText}>{studentId}</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>How are you feeling today?</Text>
    </View>
  );
}