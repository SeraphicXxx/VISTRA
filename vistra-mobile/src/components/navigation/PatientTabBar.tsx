import { PATIENT_TABS, TAB_SLIDE_MS, type TabConfig } from "@/constants/patientTabs";
import { brand } from "@/constants/theme";
import { tabBarStyles as styles } from "@/styles/tabBar.styles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];
type IoniconName = ComponentProps<typeof Ionicons>["name"];
type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const BAR_PADDING = 6;
const INDICATOR_INSET = 2;

function TabIcon({ tab, focused, color }: { tab: TabConfig; focused: boolean; color: string }) {
  const name = focused ? tab.activeIcon : tab.icon;

  if (tab.family === "material") {
    return <MaterialCommunityIcons name={name as MaterialIconName} size={18} color={color} />;
  }

  return <Ionicons name={name as IoniconName} size={18} color={color} />;
}

export function PatientTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const activeRouteName = state.routes[state.index]?.name;
  const activeIndex = Math.max(
    0,
    PATIENT_TABS.findIndex((tab) => tab.routeName === activeRouteName),
  );

  const itemWidth = (barWidth - BAR_PADDING * 2) / PATIENT_TABS.length;
  const slide = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: activeIndex,
      duration: TAB_SLIDE_MS,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slide]);

  const indicatorX = slide.interpolate({
    inputRange: PATIENT_TABS.map((_, index) => index),
    outputRange: PATIENT_TABS.map(
      (_, index) => BAR_PADDING + index * itemWidth + INDICATOR_INSET,
    ),
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar} onLayout={handleLayout}>
        {barWidth > 0 && (
          <Animated.View
            style={[
              styles.indicator,
              {
                width: Math.max(itemWidth - INDICATOR_INSET * 2, 0),
                transform: [{ translateX: indicatorX }],
              },
            ]}
          />
        )}

        {PATIENT_TABS.map((tab, index) => {
          const route = state.routes.find((r) => r.name === tab.routeName);
          if (!route) return null;

          const focused = index === activeIndex;
          const color = focused ? brand.primaryDark : brand.surface;

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
            <Pressable
              key={tab.routeName}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
            >
              <View style={styles.content}>
                <TabIcon tab={tab} focused={focused} color={color} />
                <Text style={[styles.label, { color }]}>{tab.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}