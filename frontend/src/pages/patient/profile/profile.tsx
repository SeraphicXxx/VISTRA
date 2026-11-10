import { useState } from "react";
import { ProfileHeader } from "/@/components/ProfileShared";
import { SkeletonBlock } from "/@/components/SkeletonBlock";
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
import { useMyProfileQuery, usePatientLatestVitalSignsQuery } from "/@/hooks/query/PatientQuery";
import { usePatientMedicalHistoryQuery } from "/@/hooks/query/PatientQuery";
import { usePatientFamilyHistoryQuery } from "/@/hooks/query/PatientQuery";
import { sessionManager } from "/@/utils/SessionManager";

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

  const user = sessionManager.getUser();
  const patientId = user?.user_id ?? "";

  const { data: profileData, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useMyProfileQuery();
  const { data: medicalHistoryData, isLoading: medicalLoading, isError: medicalError, refetch: refetchMedical } = usePatientMedicalHistoryQuery();
  const { data: familyHistoryData, isLoading: familyLoading, isError: familyError, refetch: refetchFamily } = usePatientFamilyHistoryQuery();
  const { data: vitalsData, isLoading: vitalsLoading, isError: vitalsError, refetch: refetchVitals } = usePatientLatestVitalSignsQuery(patientId);

  const isLoading = profileLoading || medicalLoading || familyLoading || vitalsLoading;

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
        hospitalization_operation: medicalHistoryData.hospitalization_operation ?? null,
        hospitalization_year: medicalHistoryData.hospitalization_year ?? null,
        diagnosis: medicalHistoryData.diagnosis ?? null,
        allergy_medicine: medicalHistoryData.allergy_medicine ?? null,
        allergy_food: medicalHistoryData.allergy_food ?? null,
        smoking: medicalHistoryData.smoking ?? null,
        vaping: medicalHistoryData.vaping ?? null,
        alcohol_intake: medicalHistoryData.alcohol_intake ?? null,
        last_menstrual_period: medicalHistoryData.last_menstrual_period ?? null,
        family_planning_method: medicalHistoryData.family_planning_method ?? null,
      }
    : (patientProp?.medical ?? samplePatient.medical);

  // Map API family history to FamilyHistory
  const family: FamilyHistory = familyHistoryData
    ? {
        condition: familyHistoryData.condition ?? null,
        other_condition: familyHistoryData.other_condition ?? null,
      }
    : (patientProp?.family ?? samplePatient.family);

  // Map API vitals to VitalSigns
  const vitals: VitalSigns = vitalsData
    ? {
        height: vitalsData.height ?? undefined,
        weight: vitalsData.weight ?? undefined,
        temperature: vitalsData.temperature ?? undefined,
        heart_rate: vitalsData.heart_rate ?? undefined,
        spo2: vitalsData.spo2 ?? undefined,
        recorded_at: vitalsData.recorded_at,
      }
    : (patientProp?.vitals ?? samplePatient.vitals);

  const results: ExaminationResults = patientProp?.results ?? samplePatient.results;

  const patient: PatientProfileData = {
    personal,
    medical,
    family,
    vitals,
    results,
  };

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "";

  return (
    <div className="space-y-6">
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
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
              profileError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-red-600">Failed to load personal info. Please try again.</p>
                  <button type="button" onClick={() => refetchProfile()} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark">Retry</button>
                </div>
              ) : (
                <PersonalTab {...patient.personal} onEdit={edit("personal")} />
              )
            )}
            {activeTab === "medical" && (
              medicalError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-red-600">Failed to load medical history. Please try again.</p>
                  <button type="button" onClick={() => refetchMedical()} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark">Retry</button>
                </div>
              ) : (
                <MedicalHistoryTab {...patient.medical} onEdit={edit("medical")} />
              )
            )}
            {activeTab === "family" && (
              familyError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-red-600">Failed to load family history. Please try again.</p>
                  <button type="button" onClick={() => refetchFamily()} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark">Retry</button>
                </div>
              ) : (
                <FamilyHistoryTab {...patient.family} onEdit={edit("family")} />
              )
            )}
            {activeTab === "vitals" && (
              vitalsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-red-600">Failed to load vital signs. Please try again.</p>
                  <button type="button" onClick={() => refetchVitals()} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark">Retry</button>
                </div>
              ) : (
                <VitalSignsTab {...patient.vitals} />
              )
            )}
            {activeTab === "results" && (
              <ExaminationResultsTab {...patient.results} onEdit={edit("results")} />
            )}
          </div>
        </>
      )}
    </div>
  );
}