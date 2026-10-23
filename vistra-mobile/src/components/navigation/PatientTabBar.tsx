import { brand } from "@/constants/theme";
import { navigationStyles as styles } from "@/styles/navigation.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

const TAB_ICONS: Record<string, TabIcon> = {
  overview: "view-grid-outline",
  appointments: "calendar-month-outline",
  medical: "heart-pulse",
  dental: "tooth-outline",
  profile: "account-outline",
};

export function PatientTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const icon = TAB_ICONS[route.name] ?? "circle-outline";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <View style={[styles.pill, focused && styles.pillActive]}>
              <MaterialCommunityIcons
                name={icon}
                size={22}
                color={focused ? brand.primaryDark : brand.textMuted}
              />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.label, focused && styles.labelActive]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}