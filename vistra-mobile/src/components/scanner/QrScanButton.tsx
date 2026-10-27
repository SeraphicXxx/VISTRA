import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VitalsQrScanner } from "@/components/scanner/VitalsQrScanner";

type QrScanButtonProps = {
  onScanned?: (value: string) => void;
};

export function QrScanButton({ onScanned }: QrScanButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Scan kiosk QR code"
        style={styles.button}
      >
        <Ionicons name="qr-code-outline" size={20} color="#0f766e" />
      </Pressable>

      <VitalsQrScanner
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        onScanned={onScanned}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdfa",
  },
});