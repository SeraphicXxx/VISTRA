export interface VitalSigns {
  recordedAt: string;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
  height?: number;
}

export const PATIENT_VITALS: VitalSigns | null = {
  recordedAt: "2026-10-20",
  heartRate: 72,
  temperature: 36.6,
  spo2: 98,
  weight: 62,
  height: 165,
};