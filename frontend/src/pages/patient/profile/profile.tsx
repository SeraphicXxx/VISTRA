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
} from "./patient.sample";

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

export default function PatientProfile({
  patient = samplePatient,
  onEdit,
}: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState<PatientProfileSection>("personal");
  const edit = (section: PatientProfileSection) => () => onEdit?.(section);

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