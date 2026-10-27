export type PatientClassification = "student" | "faculty" | "staff";

export type ProfileTabId =
  | "personal"
  | "medical"
  | "family"
  | "vitals"
  | "results"
  | "risk";

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

export interface ExaminationResults {
  chest_xray: string;
  cbc: string;
  urinalysis: string;
  recommendation: string;
  examination_date: string;
  examining_physician: string;
}

export interface PatientProfile {
  personal: PersonalInfo;
  medical: MedicalHistory;
  family: FamilyHistory;
  results: ExaminationResults;
}

export const PATIENT_PROFILE: PatientProfile = {
  personal: {
    name: "Angel Emie Jane Bien",
    classification: "student",
    patient_id: "20230519-S",
    birthday: "2005-07-26",
    age: 21,
    sex: "Female",
    civil_status: "Single",
    mobile_number: "09171234567",
    address: "123 Mabini Street",
    barangay: "Brgy. 176",
    course: "BS Computer Science",
    year: "3rd Year",
    section: "A",
  },
  medical: {
    hospitalization_year: "2022",
    diagnosis: "Appendicitis (appendectomy)",
    allergy_medicine: "Penicillin",
    allergy_food: "None",
    smoking: "No",
    vaping: "No",
    alcohol_intake: "Yes",
    last_menstrual_period: "",
  },
  family: {
    family_history: ["Hypertension", "Asthma"],
    family_history_others: "None",
    family_planning_method: "None",
  },
  results: {
    chest_xray: "Normal",
    cbc: "Normal",
    urinalysis: "Normal",
    recommendation: "Maintain a balanced diet and regular exercise.",
    examination_date: "2026-10-01",
    examining_physician: "Dr. Maria Santos",
  },
};