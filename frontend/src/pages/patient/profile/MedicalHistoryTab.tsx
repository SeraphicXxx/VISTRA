import type { MedicalHistory } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField } from "/@/components/ProfileShared";

export default function MedicalHistoryTab({
  hospitalization_operation,
  hospitalization_year,
  diagnosis,
  allergy_medicine,
  allergy_food,
  smoking,
  vaping,
  alcohol_intake,
  last_menstrual_period,
  family_planning_method,
  onEdit,
}: MedicalHistory & { onEdit?: () => void }) {
  return (
    <InfoCard title="Medical History" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Hospitalization / Operation" value={hospitalization_operation} />
        <InfoField label="Hospitalization Year" value={hospitalization_year} />
        <InfoField label="Diagnosis" value={diagnosis} />
        <InfoField label="Medication Allergies" value={allergy_medicine} />
        <InfoField label="Food Allergies" value={allergy_food} />
        <InfoField label="Smoking" value={smoking ? "Yes" : "No"} />
        <InfoField label="Vaping" value={vaping ? "Yes" : "No"} />
        <InfoField label="Alcohol Intake" value={alcohol_intake ? "Yes" : "No"} />
        <InfoField label="Last Menstrual Period" value={last_menstrual_period} />
        <InfoField label="Family Planning Method" value={family_planning_method} />
      </FieldGrid>
    </InfoCard>
  );
}