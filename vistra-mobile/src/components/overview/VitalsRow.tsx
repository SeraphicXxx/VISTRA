import { brand } from "@/constants/theme";
import type { VitalSigns } from "@/mock/vitals";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { formatDate } from "@/utils/dates";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Text, View } from "react-native";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface VitalItem {
  key: string;
  label: string;
  value: string;
  unit: string;
  icon: IconName;
  color: string;
  background: string;
}

interface VitalsRowProps {
  vitals: VitalSigns | null;
}

const buildItems = (vitals: VitalSigns | null): VitalItem[] => {
  if (!vitals) return [];

  const items: (VitalItem | null)[] = [
    vitals.bloodPressure
      ? {
          key: "bp",
          label: "Blood Pressure",
          value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
          unit: "mmHg",
          icon: "gauge",
          color: "#dc2626",
          background: "#fee2e2",
        }
      : null,
    vitals.heartRate != null
      ? {
          key: "hr",
          label: "Heart Rate",
          value: `${vitals.heartRate}`,
          unit: "bpm",
          icon: "heart-pulse",
          color: "#db2777",
          background: "#fce7f3",
        }
      : null,
    vitals.temperature != null
      ? {
          key: "temp",
          label: "Temperature",
          value: vitals.temperature.toFixed(1),
          unit: "°C",
          icon: "thermometer",
          color: "#ea580c",
          background: "#ffedd5",
        }
      : null,
    vitals.spo2 != null
      ? {
          key: "spo2",
          label: "SpO₂",
          value: `${vitals.spo2}`,
          unit: "%",
          icon: "water-percent",
          color: "#2563eb",
          background: "#dbeafe",
        }
      : null,
    vitals.weight != null
      ? {
          key: "weight",
          label: "Weight",
          value: `${vitals.weight}`,
          unit: "kg",
          icon: "scale-bathroom",
          color: "#4f46e5",
          background: "#e0e7ff",
        }
      : null,
  ];

  return items.filter((item): item is VitalItem => item !== null);
};

export function VitalsRow({ vitals }: VitalsRowProps) {
  const items = buildItems(vitals);
  const isOddCount = items.length % 2 === 1;

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vital Signs</Text>
        {vitals && (
          <Text style={styles.sectionCaption}>
            Recorded {formatDate(vitals.recordedAt)}
          </Text>
        )}
      </View>

      {items.length > 0 ? (
        <View style={styles.vitalGrid}>
          {items.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.vitalCard,
                { backgroundColor: item.background },
                isOddCount && index === items.length - 1 && styles.vitalCardFull,
              ]}
            >
              <View style={styles.vitalHeader}>
                <Text style={styles.vitalName} numberOfLines={2}>
                  {item.label}
                </Text>
                <View style={styles.vitalIcon}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={18}
                    color={item.color}
                  />
                </View>
              </View>

              <View style={styles.vitalReadingRow}>
                <Text style={styles.vitalValue}>{item.value}</Text>
                <Text style={styles.vitalUnit}>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyVitals}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={22}
            color={brand.textMuted}
          />
          <Text style={styles.emptyVitalsText}>
            No vital signs recorded yet. Measurements from your next check-up
            will appear here.
          </Text>
        </View>
      )}
    </View>
  );
}