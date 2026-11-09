import { useState } from "react";
import { ProfileHeader } from "/@/components/ProfileShared";
import PersonalTab from "./PersonalTab";
import MedicalHistoryTab from "./MedicalHistoryTab";
import FamilyHistoryTab from "./FamilyHistoryTab";
import VitalSignsTab from "./VitalSignsTab";
import ExaminationResultsTab from "./ExaminationResultsTab";
import {
  samplePatient,
  type PatientProfileData,
  type PatientProfileSection,
  type PersonalInfo,
  type MedicalHistory,
  type FamilyHistory,
  type VitalSigns,
  type ExaminationResults,
} from "./patient.sample";
import { useMyProfileQuery } from "/@/hooks/query/PatientQuery";
import { usePatientMedicalHistoryQuery } from "/@/hooks/query/PatientQuery";
import { usePatientFamilyHistoryQuery } from "/@/hooks/query/PatientQuery";

interface PatientProfileProps {
  patient?: PatientProfileData;
  onEdit?: (section: PatientProfileSection) => void;
}

const tabs: { id: PatientProfileSection; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "medical", label: "Medical History" },
  { id: "family", label: "Family History & Planning" },
  { id: "vitals", label: "Vital Signs" },
  { id: "results", label: "Examination Results" },
];

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border ${className ?? ""}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <SkeletonBlock className="h-16 w-16 rounded-2xl" />
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-white p-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-10 w-32 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <SkeletonBlock className="h-40 rounded-2xl" />
        <SkeletonBlock className="h-32 rounded-2xl" />
      </div>
    </div>
  );
}

export default function PatientProfile({
  patient: patientProp,
  onEdit,
}: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState<PatientProfileSection>("personal");
  const edit = (section: PatientProfileSection) => () => onEdit?.(section);

  const { data: profileData, isLoading: profileLoading } = useMyProfileQuery();
  const { data: medicalHistoryData, isLoading: medicalLoading } = usePatientMedicalHistoryQuery();
  const { data: familyHistoryData, isLoading: familyLoading } = usePatientFamilyHistoryQuery();

  const isLoading = profileLoading || medicalLoading || familyLoading;

  // Map API profile to PersonalInfo
  const personal: PersonalInfo = profileData
    ? {
        name: profileData.patient_name ?? samplePatient.personal.name,
        classification: "student",
        patient_id: profileData.patient_id ?? samplePatient.personal.patient_id,
        birthday: profileData.birthday ?? samplePatient.personal.birthday,
        age: profileData.age ?? samplePatient.personal.age,
        sex: profileData.sex ?? samplePatient.personal.sex,
        civil_status: profileData.civil_status ?? samplePatient.personal.civil_status,
        mobile_number: profileData.mobile_number ?? samplePatient.personal.mobile_number,
        address: profileData.address ?? samplePatient.personal.address,
        barangay: profileData.barangay ?? samplePatient.personal.barangay,
        course: profileData.course ?? samplePatient.personal.course,
        school_year: profileData.school_year ?? samplePatient.personal.school_year,
        department: profileData.department ?? samplePatient.personal.department,
      }
    : (patientProp?.personal ?? samplePatient.personal);

  // Map API medical history to MedicalHistory
  const medical: MedicalHistory = medicalHistoryData
    ? {
        hospitalization_operation: medicalHistoryData.hospitalization_operation ?? "",
        hospitalization_year: medicalHistoryData.hospitalization_year ?? 0,
        diagnosis: medicalHistoryData.diagnosis ?? "",
        allergy_medicine: medicalHistoryData.allergy_medicine ?? "",
        allergy_food: medicalHistoryData.allergy_food ?? "",
        smoking: medicalHistoryData.smoking ?? null,
        vaping: medicalHistoryData.vaping ?? null,
        alcohol: medicalHistoryData.alcohol ?? null,
        contraceptive: medicalHistoryData.contraceptive ?? "",
        sexual_activity: medicalHistoryData.sexual_activity ?? "",
      }
    : (patientProp?.medical ?? samplePatient.medical);

  // Map API family history to FamilyHistory
  const family: FamilyHistory = familyHistoryData
    ? {
        family_history: familyHistoryData.family_history ?? "",
        other: familyHistoryData.other ?? null,
      }
    : (patientProp?.family ?? samplePatient.family);

  // Vitals still use mock data (no patient-scoped vitals endpoint wired yet)
  const vitals: VitalSigns = patientProp?.vitals ?? samplePatient.vitals;

  const results: ExaminationResults = patientProp?.results ?? samplePatient.results;

  const patient: PatientProfileData = {
    personal,
    medical,
    family,
    vitals,
    results,
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "";

  return (
    <div className="space-y-6">
      <ProfileHeader {...patient.personal} />

      <div className="rounded-2xl border border-border bg-white p-2">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-textMuted hover:bg-slate-50 hover:text-textPrimary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div key={activeTab} className="fade-in-up">
        {activeTab === "personal" && (
          <PersonalTab {...patient.personal} onEdit={edit("personal")} />
        )}
        {activeTab === "medical" && (
          <MedicalHistoryTab {...patient.medical} onEdit={edit("medical")} />
        )}
        {activeTab === "family" && (
          <FamilyHistoryTab {...patient.family} onEdit={edit("family")} />
        )}
        {activeTab === "vitals" && (
          <VitalSignsTab {...patient.vitals} onEdit={edit("vitals")} />
        )}
        {activeTab === "results" && (
          <ExaminationResultsTab {...patient.results} onEdit={edit("results")} />
        )}
      </div>
    </div>
  );
}