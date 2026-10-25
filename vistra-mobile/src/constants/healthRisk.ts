import { brand } from "@/constants/theme";
import type { RiskLevel } from "@/mock/healthRisk";

export const RISK_META: Record<RiskLevel, { label: string; color: string; background: string }> = {
  low: {
    label: "Low",
    color: brand.primaryDark,
    background: brand.background,
  },
  moderate: {
    label: "Moderate",
    color: "#b45309",
    background: "#fef3c7",
  },
  high: {
    label: "High",
    color: brand.danger,
    background: "#fee2e2",
  },
};

export const getRiskLevel = (percent: number): RiskLevel => {
  if (percent >= 60) return "high";
  if (percent >= 30) return "moderate";

  return "low";
};