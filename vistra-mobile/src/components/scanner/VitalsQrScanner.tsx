import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useCallback, useEffect, useState } from "react";
import { Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "@/components/ui/Toast";

type VitalsQrScannerProps = {
  visible: boolean;
  onClose: () => void;
  onScanned?: (value: string) => void;
};

export function VitalsQrScanner({ visible, onClose, onScanned }: VitalsQrScannerProps) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const cannotAskAgain = Boolean(permission && !permission.granted && !permission.canAskAgain);

  useEffect(() => {
    if (visible) {
      setHasScanned(false);
      setToastVisible(true);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && permission && !permission.granted && permission.canAskAgain) {
      void requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (hasScanned) return;
      setHasScanned(true);
      onScanned?.(result.data);
      onClose();
    },
    [hasScanned, onScanned, onClose]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
          />
        ) : (
          <View style={styles.permission}>
            <Ionicons name="camera-outline" size={40} color="#0f766e" />
            <Text style={styles.permissionText}>
              {cannotAskAgain
                ? "Camera access is turned off. Enable it in Settings to scan the kiosk QR code."
                : "Camera access is needed to scan the kiosk QR code."}
            </Text>
            <Pressable
              onPress={
                cannotAskAgain
                  ? () => void Linking.openSettings()
                  : () => void requestPermission()
              }
              style={styles.permissionButton}
            >
              <Text style={styles.permissionButtonText}>
                {cannotAskAgain ? "Open settings" : "Allow camera"}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
          <Text style={styles.title}>Scan kiosk QR</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.frame} pointerEvents="none" />

        <Toast
          message="Using camera to scan vital records from the kiosk."
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  permission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "#ffffff",
  },
  permissionText: {
    fontSize: 14,
    textAlign: "center",
    color: "#334155",
  },
  permissionButton: {
    marginTop: 4,
    backgroundColor: "#0f766e",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  permissionButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  frame: {
    position: "absolute",
    alignSelf: "center",
    top: "32%",
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: "#5eead4",
    borderRadius: 20,
  },
});