import { RISK_META, getRiskLevel } from "@/constants/healthRisk";
import { HEALTH_RISK_DISCLAIMER, type HealthRiskPrediction } from "@/mock/healthRisk";
import { healthRiskStyles as styles } from "@/styles/healthRisk.styles";
import { Text, View } from "react-native";

interface HealthRiskTabProps {
  predictions: HealthRiskPrediction[];
}

export function HealthRiskTab({ predictions }: HealthRiskTabProps) {
  if (predictions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No health risk predictions yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {predictions.map((prediction) => {
        const meta = RISK_META[getRiskLevel(prediction.percent)];

        return (
          <View key={prediction.condition} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.condition}>{prediction.condition}</Text>
              <View style={[styles.chip, { backgroundColor: meta.background }]}>
                <Text style={[styles.chipText, { color: meta.color }]}>{meta.label} risk</Text>
              </View>
            </View>

            <View style={styles.probRow}>
              <Text style={[styles.probValue, { color: meta.color }]}>{prediction.percent}%</Text>
              <Text style={styles.probLabel}>estimated probability</Text>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${prediction.percent}%`, backgroundColor: meta.color },
                ]}
              />
            </View>

            <View style={styles.recBox}>
              <Text style={styles.recLabel}>What this means</Text>
              <Text style={styles.recText}>{prediction.explanation}</Text>
            </View>

            <Text style={styles.sectionLabel}>Contributing factors</Text>
            <View style={styles.factorList}>
              {prediction.factors.map((factor) => (
                <View key={factor} style={styles.factorRow}>
                  <View style={[styles.factorDot, { backgroundColor: meta.color }]} />
                  <Text style={styles.factorText}>{factor}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      <Text style={styles.footer}>{HEALTH_RISK_DISCLAIMER}</Text>
    </View>
  );
}