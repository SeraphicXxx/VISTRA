import { profileStyles as styles } from "@/styles/profile.styles";
import { formatDate } from "@/utils/dates";
import { ReactNode } from "react";
import { Text, View } from "react-native";

export const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return "—";

  return String(value);
};

export const formatOptionalDate = (value?: string) => (value ? formatDate(value) : "—");

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <View style={styles.fieldGrid}>{children}</View>;
}

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  full?: boolean;
}

export function InfoField({ label, value, full }: InfoFieldProps) {
  return (
    <View style={[styles.field, full && styles.fieldFull]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{formatValue(value)}</Text>
    </View>
  );
}