export type PatientClassification = "student" | "faculty" | "staff";

export type PatientProfileSection =
  | "personal"
  | "medical"
  | "family"
  | "vitals"
  | "results";

export interface PersonalInfo {
  name: string;
  classification: PatientClassification;
  patient_id: string;
  birthday: string;
  age: number;
  sex: string;
  civil_status: string;
  mobile_number: string;
  address: string;
  barangay: string;
  course?: string;
  year?: string;
  section?: string;
  department?: string;
  position?: string;
}

export interface MedicalHistory {
  hospitalization_year: string;
  diagnosis: string;
  allergy_medicine: string;
  allergy_food: string;
  smoking: string;
  vaping: string;
  alcohol_intake: string;
  last_menstrual_period: string;
}

export interface FamilyHistory {
  family_history: string[];
  family_history_others: string;
  family_planning_method: string;
}

export interface VitalSigns {
  temperature: string;
  blood_pressure: string;
  heart_rate: string;
  respiratory_rate: string;
  eyes: string;
}

export interface ExaminationResults {
  chest_xray: string;
  cbc: string;
  urinalysis: string;
  recommendation: string;
  examination_date: string;
  examining_physician: string;
}

export interface PatientProfileData {
  personal: PersonalInfo;
  medical: MedicalHistory;
  family: FamilyHistory;
  vitals: VitalSigns;
  results: ExaminationResults;
}

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
  year: "3rd Year",
  section: "A",
};

export const sampleMedical: MedicalHistory = {
  hospitalization_year: "2022",
  diagnosis: "Appendicitis (appendectomy)",
  allergy_medicine: "Penicillin",
  allergy_food: "None",
  smoking: "No",
  vaping: "No",
  alcohol_intake: "Yes",
  last_menstrual_period: "",
};

export const sampleFamily: FamilyHistory = {
  family_history: ["Hypertension", "Asthma"],
  family_history_others: "None",
  family_planning_method: "None",
};

export const sampleVitals: VitalSigns = {
  temperature: "36.5",
  blood_pressure: "120/80",
  heart_rate: "78",
  respiratory_rate: "18",
  eyes: "Anicteric, pink conjunctiva",
};

export const sampleResults: ExaminationResults = {
  chest_xray: "Normal",
  cbc: "Normal",
  urinalysis: "Normal",
  recommendation: "Maintain a balanced diet and regular exercise.",
  examination_date: "2026-10-01",
  examining_physician: "Dr. Maria Santos",
};

export const samplePatient: PatientProfileData = {
  personal: samplePersonal,
  medical: sampleMedical,
  family: sampleFamily,
  vitals: sampleVitals,
  results: sampleResults,
};