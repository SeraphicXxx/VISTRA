export type RiskLevel = "low" | "moderate" | "high";

export interface HealthRiskPrediction {
  condition: string;
  percent: number;
  explanation: string;
  factors: string[];
}

export const HEALTH_RISK_DISCLAIMER =
  "This is a health risk estimate, not a confirmed diagnosis. Please consult your doctor.";

export const PATIENT_HEALTH_RISKS: HealthRiskPrediction[] = [
  {
    condition: "Gum disease (periodontitis)",
    percent: 58,
    explanation:
      "Recent check-ups noted tooth sensitivity and plaque build-up, and cleanings have been less frequent than recommended.",
    factors: ["Tooth sensitivity reported", "Last cleaning over 3 months ago"],
  },
  {
    condition: "Dental caries (tooth decay)",
    percent: 42,
    explanation:
      "Sensitivity and irregular cleanings raise the chance of new cavities.",
    factors: ["Tooth sensitivity reported", "Irregular cleaning schedule"],
  },
  {
    condition: "Hypertension",
    percent: 24,
    explanation:
      "Your recent vital signs are within the normal range. Family history is the main contributing factor.",
    factors: ["Blood pressure 118/76 mmHg", "Family history of hypertension"],
  },
  {
    condition: "Dry mouth (xerostomia)",
    percent: 18,
    explanation:
      "Reported dryness and current medication use may reduce saliva flow.",
    factors: ["Reported dry mouth", "Current medication use"],
  },
  {
    condition: "Type 2 diabetes",
    percent: 12,
    explanation:
      "No elevated blood sugar records. Family history is the only contributing factor.",
    factors: ["Family history of diabetes"],
  },
];