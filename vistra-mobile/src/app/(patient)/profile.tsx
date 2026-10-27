import { Reveal } from "@/components/animation/Reveal";
import { AppHeader } from "@/components/navigation/AppHeader";
import { ExaminationResultsTab } from "@/components/profile/ExaminationResultsTab";
import { FamilyHistoryTab } from "@/components/profile/FamilyHistoryTab";
import { HealthRiskTab } from "@/components/profile/HealthRiskTab";
import { MedicalHistoryTab } from "@/components/profile/MedicalHistoryTab";
import { PersonalTab } from "@/components/profile/PersonalTab";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { VitalsTab } from "@/components/profile/VitalsTab";
import { PROFILE_TABS } from "@/constants/profile";
import { brand } from "@/constants/theme";
import { PATIENT_HEALTH_RISKS } from "@/mock/healthRisk";
import { PATIENT_PROFILE, type ProfileTabId } from "@/mock/profile";
import { PATIENT_VITALS } from "@/mock/vitals";
import { profileStyles as styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isProfileTabId = (value?: string): value is ProfileTabId =>
  PROFILE_TABS.some((tab) => tab.id === value);

export default function ProfileScreen() {
  const params = useLocalSearchParams<{ tab?: string; t?: string }>();

  const [activeTab, setActiveTab] = useState<ProfileTabId | null>(
    isProfileTabId(params.tab) ? params.tab : null
  );

  useEffect(() => {
    if (isProfileTabId(params.tab)) setActiveTab(params.tab);
  }, [params.tab, params.t]);

  const { personal, medical, family, results } = PATIENT_PROFILE;

  const activeLabel = PROFILE_TABS.find((tab) => tab.id === activeTab)?.label ?? "";

  const renderTab = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTab {...personal} />;
      case "medical":
        return <MedicalHistoryTab {...medical} />;
      case "family":
        return <FamilyHistoryTab {...family} />;
      case "vitals":
        return <VitalsTab vitals={PATIENT_VITALS} />;
      case "results":
        return <ExaminationResultsTab {...results} />;
      case "risk":
        return <HealthRiskTab predictions={PATIENT_HEALTH_RISKS} />;
      default:
        return null;
    }
  };

  if (activeTab === null) {
    return (
      <SafeAreaView style={styles.screen} edges={[]}>
        <AppHeader notificationCount={2} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Reveal>
            <ProfileHeader personal={personal} />
          </Reveal>

          <Reveal delay={60}>
            <ProfileMenu active={activeTab} onChange={setActiveTab} />
          </Reveal>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => setActiveTab(null)}
          accessibilityRole="button"
          accessibilityLabel="Back to profile menu"
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color={brand.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {activeLabel}
        </Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Reveal key={activeTab} delay={40}>
          {renderTab()}
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}