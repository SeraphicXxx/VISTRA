import { brand } from "@/constants/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export function Button({ title, onPress, loading }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: brand.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: brand.primary,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
