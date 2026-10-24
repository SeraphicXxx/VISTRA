export interface VitalSigns {
  recordedAt: string;
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
}

export const PATIENT_VITALS: VitalSigns | null = {
  recordedAt: "2026-10-20",
  bloodPressure: { systolic: 118, diastolic: 76 },
  heartRate: 72,
  temperature: 36.6,
  spo2: 98,
  weight: 62,
};