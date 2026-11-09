export type PatientClassification = "student" | "faculty" | "staff" | "university_staff";

export type PatientProfileSection =
  | "personal"
  | "medical"
  | "family"
  | "vitals"
  | "results";

// ── Personal Info (matches PATIENT_PROFILE table + patient_summary view) ──
export interface PersonalInfo {
  name: string;
  classification: PatientClassification;   // person_type in DB
  patient_id: string;
  birthday: string;
  age: number;
  sex: string;
  civil_status: string;
  mobile_number: string;                  // contact_no in DB
  address: string;                       // complete_address in DB
  barangay: string;
  course?: string;
  school_year?: string;                  // year level in DB
  department?: string;
  person_type?: string;                  // classification alias
}

// ── Medical History (matches MEDICAL_HISTORY table) ──
export interface MedicalHistory {
  hospitalization_operation: string | null;
  hospitalization_year: string | null;
  diagnosis: string | null;
  allergy_medicine: string | null;
  allergy_food: string | null;
  smoking: boolean | null;
  vaping: boolean | null;
  alcohol_intake: boolean | null;
  last_menstrual_period: string | null;
  family_planning_method: string | null;
}

// ── Family History (matches FAMILY_HISTORY table) ──
export interface FamilyHistory {
  condition: string | null;
  other_condition: string | null;
}

// ── Vital Signs (matches VITAL_SIGNS table) ──
export interface VitalSigns {
  height?: number;
  weight?: number;
  temperature?: number;
  heart_rate?: number;
  spo2?: number;
  recorded_at: string;
}

// ── Examination Results (matches RESULTS table) ──
export interface ExaminationResults {
  chest_xray: string;
  cbc: string;
  urinalysis: string;
  recommendation: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientProfileData {
  personal: PersonalInfo;
  medical: MedicalHistory;
  family: FamilyHistory;
  vitals: VitalSigns;
  results: ExaminationResults;
}

// ── Sample data matching Supabase table shapes ──

export const samplePersonal: PersonalInfo = {
  name: "Juan Dela Cruz",
  classification: "student",
  patient_id: "20230786-S",
  birthday: "2003-05-17",
  age: 22,
  sex: "Male",
  civil_status: "Single",
  mobile_number: "09171234567",
  address: "123 Mabini Street",
  barangay: "Brgy. 176",
  course: "BS Computer Science",
  school_year: "3rd Year",
  department: "College of Computer Studies",
  person_type: "student",
};

export const sampleMedical: MedicalHistory = {
  hospitalization_operation: "Appendectomy",
  hospitalization_year: "2022",
  diagnosis: "Appendicitis",
  allergy_medicine: "Penicillin",
  allergy_food: "None",
  smoking: false,
  vaping: false,
  alcohol_intake: true,
  last_menstrual_period: "2026-10-01",
  family_planning_method: "None",
};

export const sampleFamily: FamilyHistory = {
  condition: "Hypertension, Asthma",
  other_condition: "None",
};

export const sampleVitals: VitalSigns = {
  height: 165,
  weight: 62,
  temperature: 36.5,
  heart_rate: 78,
  spo2: 98,
  recorded_at: "2026-10-20T08:00:00",
};

export const sampleResults: ExaminationResults = {
  chest_xray: "Normal",
  cbc: "Normal",
  urinalysis: "Normal",
  recommendation: "Maintain a balanced diet and regular exercise.",
  created_at: "2026-10-01T00:00:00",
  updated_at: "2026-10-01T00:00:00",
};

export const samplePatient: PatientProfileData = {
  personal: samplePersonal,
  medical: sampleMedical,
  family: sampleFamily,
  vitals: sampleVitals,
  results: sampleResults,
};