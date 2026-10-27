import { brand } from "@/constants/theme";
import { subHeaderStyles as styles } from "@/styles/subHeader.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SubHeaderProps {
  title: string;
  backTo: string;
}

export function SubHeader({ title, backTo }: SubHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => router.navigate(backTo)}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={22} color={brand.textPrimary} />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
}