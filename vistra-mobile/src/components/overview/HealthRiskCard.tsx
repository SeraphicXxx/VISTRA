import { brand } from "@/constants/theme";
import {
  HEALTH_RISK_DISCLAIMER,
  type HealthRiskPrediction,
  type RiskLevel,
} from "@/mock/healthRisk";
import { overviewStyles as styles } from "@/styles/overview.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const LEVEL_META: Record<RiskLevel, { label: string; color: string }> = {
  low: { label: "Low", color: brand.primary },
  moderate: { label: "Moderate", color: "#d97706" },
  high: { label: "High", color: "#dc2626" },
};

const MAX_ITEMS = 5;

const levelFromPercent = (percent: number): RiskLevel =>
  percent >= 60 ? "high" : percent >= 30 ? "moderate" : "low";

interface HealthRiskCardProps {
  predictions: HealthRiskPrediction[];
}

export function HealthRiskCard({ predictions }: HealthRiskCardProps) {
  const sorted = [...predictions]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, MAX_ITEMS);
  const [top, ...others] = sorted;
  const topMeta = top ? LEVEL_META[levelFromPercent(top.percent)] : null;

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health Risk Prediction</Text>
      </View>
      <Text style={styles.riskIntro}>
        Estimated risk percentages based on your personal information, medical
        and family history, and vital signs.
      </Text>

      {top && topMeta ? (
        <View style={styles.riskCard}>
          <View style={styles.riskHero}>
            <View style={styles.riskHeroBody}>
              <Text style={styles.riskHeroLabel}>HIGHEST ESTIMATED RISK</Text>
              <Text style={styles.riskHeroTitle}>{top.condition}</Text>
              <Text style={styles.riskHeroText}>{top.explanation}</Text>
            </View>

            <View
              style={[
                styles.riskRing,
                {
                  borderColor: topMeta.color,
                  backgroundColor: `${topMeta.color}14`,
                },
              ]}
            >
              <Text style={[styles.riskRingValue, { color: topMeta.color }]}>
                {top.percent}%
              </Text>
              <Text style={[styles.riskRingUnit, { color: topMeta.color }]}>
                {topMeta.label}
              </Text>
            </View>
          </View>

          {top.factors.length > 0 && (
            <View style={styles.riskFactorRow}>
              {top.factors.slice(0, 3).map((factor) => (
                <View key={factor} style={styles.riskFactorChip}>
                  <Text style={styles.riskFactorText}>{factor}</Text>
                </View>
              ))}
            </View>
          )}

          {others.length > 0 && (
            <>
              <View style={styles.riskDivider} />
              <Text style={styles.riskGridLabel}>OTHER RISKS</Text>
              <View style={styles.riskGrid}>
                {others.map((item) => {
                  const meta = LEVEL_META[levelFromPercent(item.percent)];

                  return (
                    <View key={item.condition} style={styles.riskTile}>
                      <View style={styles.riskTileTop}>
                        <Text style={[styles.riskTilePercent, { color: meta.color }]}>
                          {item.percent}%
                        </Text>
                        <View
                          style={[
                            styles.riskLevelDot,
                            { backgroundColor: meta.color },
                          ]}
                        />
                      </View>

                      <Text style={styles.riskTileName} numberOfLines={2}>
                        {item.condition}
                      </Text>

                      <View style={styles.riskTileTrack}>
                        <View
                          style={[
                            styles.riskTileFill,
                            {
                              width: `${item.percent}%`,
                              backgroundColor: meta.color,
                            },
                          ]}
                        />
                      </View>

                      <Text style={[styles.riskTileLevel, { color: meta.color }]}>
                        {meta.label} risk
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <View style={styles.riskDivider} />

          <View style={styles.riskDisclaimerRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={brand.textMuted}
            />
            <Text style={styles.riskDisclaimerText}>{HEALTH_RISK_DISCLAIMER}</Text>
          </View>

          <Pressable
            onPress={() =>
              router.navigate({
                pathname: "/profile",
                params: { tab: "risk", t: String(Date.now()) },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="View health insights"
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            style={{
              marginTop: 16,
              height: 48,
              borderRadius: 14,
              backgroundColor: "#14b8a6",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
              View Health Insights
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyVisits}>
          <Text style={styles.emptyVisitsText}>
            Not enough records yet to estimate your health risks.
          </Text>
        </View>
      )}
    </View>
  );
}