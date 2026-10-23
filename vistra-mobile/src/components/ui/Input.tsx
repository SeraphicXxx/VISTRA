import { brand } from "@/constants/theme";
import { StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
};

export function Input({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry,
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={brand.textMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: brand.textSecondary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: brand.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: brand.textPrimary,
    backgroundColor: brand.surface,
  },
  inputError: {
    borderColor: brand.danger,
  },
  error: {
    fontSize: 12,
    color: brand.danger,
  },
});
