import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getStoredUserId } from "@/api/axios_client";

import { VitalSigns } from "@/mock/vitals";
import { VitalsRow } from "@/components/overview/VitalsRow";
import { patientService, type CreateVitalSignsRequest } from "@/api/services/patient.service";

interface VitalsPreviewScreenProps {
  onBack?: () => void;
  onConfirm?: (vitals: VitalSigns) => void;
}

const fallbackVitals: VitalSigns = {
  heartRate: 78,
  height: 170,
  recordedAt: "2026-10-27T18:45:00+08:00",
  spo2: 98,
  temperature: 36.7,
  weight: 65,
};

export default function VitalsPreviewScreen({
  onBack,
  onConfirm,
}: VitalsPreviewScreenProps) {
  const insets = useSafeAreaInsets();
  const { vitals: vitalsParam } = useLocalSearchParams<{ vitals?: string }>();

  const parsedVitals: VitalSigns | null = (() => {
    if (!vitalsParam) return null;
    try {
      return JSON.parse(vitalsParam) as VitalSigns;
    } catch {
      return null;
    }
  })();

  const mappedVitals: VitalSigns = parsedVitals ?? fallbackVitals;

  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    if (isSaving) return;

    const patientId = await getStoredUserId();

    if (!patientId || !patientId.trim()) {
      Alert.alert("Missing Patient", "Unable to identify the patient.");
      return;
    }

    setIsSaving(true);

    try {
      const payload: CreateVitalSignsRequest = {
        patient_id: patientId,
        height: mappedVitals.height,
        weight: mappedVitals.weight,
        temperature: mappedVitals.temperature,
        heart_rate: mappedVitals.heartRate,
        spo2: mappedVitals.spo2,
        recorded_at: mappedVitals.recordedAt,
      };

      const saved = await patientService.createVitalSigns(payload);

      Alert.alert("Success", "Vital signs saved successfully.");

      console.log("Saved vital signs:", saved);
      onConfirm?.(mappedVitals);
      void router.back();
    } catch (error) {
      console.error("Failed to save vital signs:", error);

      Alert.alert(
        "Unable to Save",
        "The measurements could not be saved. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => void router.replace("/(patient)/profile?tab=vitals&scan=true")}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#172033" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Review Measurements</Text>
            <Text style={styles.subtitle}>
              Check the scanned kiosk results
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#16845B"
              />
            </View>

            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>QR code scanned</Text>
              <Text style={styles.statusDescription}>
                Vital signs were decoded successfully. Review the values
                below before continuing.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>
              Measurement Summary
            </Text>
            <Text style={styles.sectionDescription}>
              Values received from the VISTRA kiosk
            </Text>

            <VitalsRow vitals={mappedVitals} />
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#64748B"
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Before you continue</Text>
              <Text style={styles.infoDescription}>
                Confirm that these measurements belong to the correct
                patient. They will be saved when you confirm.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable
            onPress={() => void router.replace("/(patient)/profile?tab=vitals&scan=true")}
            disabled={isSaving}
            style={[
              styles.secondaryButton,
              isSaving && styles.disabledButton,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Rescan</Text>
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            disabled={isSaving}
            style={[
              styles.primaryButton,
              isSaving && styles.disabledButton,
            ]}
            accessibilityRole="button"
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Saving...</Text>
              </>
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Confirm Measurements
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#172033",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 24,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  statusIcon: {
    marginTop: 1,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#166534",
  },
  statusDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#166534",
    marginTop: 4,
  },
  section: {
    gap: 6,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172033",
  },
  sectionDescription: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  vitalsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  infoDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    backgroundColor: "#F8FAFC",
  },
  secondaryButton: {
    paddingHorizontal: 20,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
