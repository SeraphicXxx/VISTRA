import type { PatientClassification, ProfileTabId } from "@/mock/profile";
import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];

export const PROFILE_TABS: { id: ProfileTabId; label: string; icon: IconName }[] = [
  { id: "personal", label: "Personal Information", icon: "person-outline" },
  { id: "medical", label: "Medical History", icon: "medkit-outline" },
  { id: "family", label: "Family & Planning", icon: "people-outline" },
  { id: "vitals", label: "Vital Signs", icon: "pulse-outline" },
  { id: "results", label: "Examination Results", icon: "document-text-outline" },
  { id: "risk", label: "Health Risk Prediction", icon: "shield-checkmark-outline" },
];

export const ID_LABELS: Record<PatientClassification, string> = {
  student: "Student ID",
  faculty: "Employee ID",
  staff: "Employee ID",
};

export const CLASSIFICATION_LABEL: Record<PatientClassification, string> = {
  student: "Student",
  faculty: "Faculty",
  staff: "Staff",
};