import { AppHeader } from "@/components/navigation/AppHeader";
import { PatientTabBar } from "@/components/navigation/PatientTabBar";
import { Tabs, useSegments, router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { mapVistraVitalsToVitalSigns } from "@/utils/mapper";

const TAB_FADE_MS = 320;
const TAB_SHIFT = 12;

export default function PatientTabsLayout() {
  const segments = useSegments();
  const activeTab = segments.join("/");
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: TAB_FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeTab, progress]);

  const handleKioskScan = (value: string) => {
    try {
      const payload = JSON.parse(value);
      const vitalSigns = mapVistraVitalsToVitalSigns(payload);
      void router.push({
        pathname: "/record/VitalsPreviewScreen",
        params: { vitals: JSON.stringify(vitalSigns) },
      });
    } catch (error) {
      console.error("Failed to parse kiosk vitals QR:", error);
    }
  };

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [TAB_SHIFT, 0],
  });

  return (
    <Animated.View
      style={[
        styles.root,
        { backgroundColor: "#ffffff", opacity: progress, transform: [{ translateY }] },
      ]}
    >
      <Tabs
        detachInactiveScreens
        tabBar={(props) => <PatientTabBar {...props} />}
        screenOptions={{
          header: () => <AppHeader notificationCount={2} onKioskScan={handleKioskScan} />,
          sceneStyle: { backgroundColor: "#ffffff" },
        }}
      >
        <Tabs.Screen name="overview" options={{ title: "Overview" }} />
        <Tabs.Screen name="appointments" options={{ title: "Appointments" }} />
        <Tabs.Screen name="records" options={{ title: "Records" }} />
        <Tabs.Screen
          name="profile"
          options={{ title: "Profile", headerShown: false }}
        />
      </Tabs>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});