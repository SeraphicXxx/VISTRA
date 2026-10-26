import { brand } from "@/constants/theme";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const ICON_COLOR = brand.primaryDark;

const ACTIONS = [
  {
    key: "book",
    label: "Appointment",
    route: "/(patient)/appointments",
    icon: <Ionicons name="calendar-outline" size={20} color={ICON_COLOR} />,
  },
  {
    key: "medical",
    label: "Medical",
    route: "/(patient)/medical",
    icon: <Ionicons name="document-text-outline" size={20} color={ICON_COLOR} />,
  },
  {
    key: "dental",
    label: "Dental",
    route: "/(patient)/dental",
    icon: (
      <MaterialCommunityIcons name="tooth-outline" size={20} color={ICON_COLOR} />
    ),
  },
  {
    key: "profile",
    label: "Profile",
    route: "/(patient)/profile",
    icon: <Ionicons name="person-outline" size={20} color={ICON_COLOR} />,
  },
] as const;

export function QuickActions() {
  return (
    <View style={styles.quickWrap}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Navigation</Text>
      </View>

      <View style={styles.tileRow}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.key}
            onPress={() => router.push(action.route)}
            style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.tileIcon}>{action.icon}</View>
            <Text style={styles.tileLabel} numberOfLines={1}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}