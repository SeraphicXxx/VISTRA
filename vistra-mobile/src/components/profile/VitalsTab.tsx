import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VitalsRow } from "@/components/overview/VitalsRow";
import { VitalsQrScanner } from "@/components/scanner/VitalsQrScanner";
import {mapVistraVitalsToVitalSigns, VistraVitalsQR } from "@/utils/mapper";
import { VitalSigns } from "@/mock/vitals";
import { router } from "expo-router";
import { usePatientLatestVitalSigns } from "@/hooks/usePatientOverview";

interface VitalsTabProps {
  vitals?: ComponentProps<typeof VitalsRow>["vitals"];
  autoScan?: boolean;
}

export function VitalsTab({ vitals: propVitals, autoScan }: VitalsTabProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { data: latestVitals, isLoading } = usePatientLatestVitalSigns();

  const vitals = latestVitals ?? propVitals ?? null;

  useEffect(() => {
    if (autoScan) {
      setIsScannerOpen(true);
    }
  }, [autoScan]);

  const handleScanned = (value: string) => {
    try {
      const payload: VistraVitalsQR = JSON.parse(value);
      const vitalSigns = mapVistraVitalsToVitalSigns(payload);

      router.push({
        pathname: "/record/VitalsPreviewScreen",
        params: {
          vitals: JSON.stringify(vitalSigns),
        },
      });
    } catch (error) {
      console.error("Failed to parse kiosk vitals QR:", error);
    }
  };

  return (
    <View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0f766e" />
          <Text style={styles.loadingText}>Loading vital signs…</Text>
        </View>
      ) : (
        <VitalsRow vitals={vitals} />
      )}

      <View style={styles.card}>
        <View style={styles.qrFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Ionicons name="qr-code-outline" size={40} color="#0f766e" />
        </View>

        <Text style={styles.title}>Update your vital signs</Text>
        <Text style={styles.note}>
          Scan the QR code that appears on the kiosk after your assessment to
          record your latest vital signs.
        </Text>

        <Pressable
          onPress={() => setIsScannerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Update vital signs"
          android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          style={styles.button}
        >
          <Ionicons name="scan-outline" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Update vital signs</Text>
        </Pressable>
      </View>

      <VitalsQrScanner
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanned={handleScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#64748b",
  },
  card: {
    marginTop: 16,
    padding: 20,
    gap: 10,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  qrFrame: {
    width: 96,
    height: 96,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f0fdfa",
  },
  corner: {
    position: "absolute",
    width: 22,
    height: 22,
    borderColor: "#0f766e",
  },
  topLeft: {
    top: 8,
    left: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 8,
    right: 8,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: "#64748b",
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 6,
    height: 48,
    alignSelf: "stretch",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#14b8a6",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});