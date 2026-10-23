import { AppHeader } from "@/components/navigation/AppHeader";
import { PatientTabBar } from "@/components/navigation/PatientTabBar";
import { brand } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function PatientTabsLayout() {
  return (
    <View style={styles.root}>
                <LinearGradient
        colors={[
          "#ffffff",
          "#ffffff",
          "#ccfbf1",
          "#5eead4",
          brand.primary,
          brand.primary,
        ]}
        locations={[0, 0.3, 0.45, 0.6, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Tabs
        tabBar={(props) => <PatientTabBar {...props} />}
        screenOptions={{
          header: () => <AppHeader notificationCount={2} />,
          sceneStyle: { backgroundColor: "transparent" },
        }}
      >
        <Tabs.Screen name="overview" options={{ title: "Overview" }} />
        <Tabs.Screen name="appointments" options={{ title: "Appointments" }} />
        <Tabs.Screen name="medical" options={{ title: "Medical" }} />
        <Tabs.Screen name="dental" options={{ title: "Dental" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: brand.background,
  },
});
