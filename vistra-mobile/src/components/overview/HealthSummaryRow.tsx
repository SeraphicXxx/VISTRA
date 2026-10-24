import { overviewStyles as styles } from "@/styles/overview.styles";
import { Text, View } from "react-native";

interface HealthSummaryRowProps {
  visitCount: number;
  medicalStatus?: string;
}

export function HealthSummaryRow({ visitCount, medicalStatus }: HealthSummaryRowProps) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Summary</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Visits</Text>
          <Text style={styles.summaryValue}>{visitCount}</Text>
          <Text style={styles.summaryCaption}>Logged to your record</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Medical Status</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {medicalStatus || "No record yet"}
          </Text>
          <Text style={styles.summaryCaption}>Clinic clearance</Text>
        </View>
      </View>
    </View>
  );
}