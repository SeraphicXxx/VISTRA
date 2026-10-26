import { brand } from "@/constants/theme";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ComingSoonCardProps {
  title: string;
  subtitle?: string;
  iconName?: string;
}

export function ComingSoonCard({
  title,
  subtitle = "This feature is coming soon.",
  iconName = "clock-outline",
}: ComingSoonCardProps) {
  return (
    <View style={[styles.comingSoonContainer, { flex: 1 }]}>
      <View style={styles.comingSoonIconWrap}>
        <Ionicons name={iconName as any} size={32} color={brand.textMuted} />
      </View>
      <Text style={styles.comingSoonTitle}>{title}</Text>
      <Text style={styles.comingSoonSubtitle}>{subtitle}</Text>
    </View>
  );
}
