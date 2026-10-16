import type { MedicalHistory } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField, formatDate } from "/@/components/ProfileShared";

export default function MedicalHistoryTab({
  hospitalization_year,
  diagnosis,
  allergy_medicine,
  allergy_food,
  smoking,
  vaping,
  alcohol_intake,
  last_menstrual_period,
  onEdit,
}: MedicalHistory & { onEdit?: () => void }) {
  return (
    <InfoCard title="Medical History" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Hospitalization / Operation Year" value={hospitalization_year} />
        <InfoField label="Diagnosis" value={diagnosis} />
        <InfoField label="Medication Allergies" value={allergy_medicine} />
        <InfoField label="Food Allergies" value={allergy_food} />
        <InfoField label="Smoking" value={smoking} />
        <InfoField label="Vaping" value={vaping} />
        <InfoField label="Alcohol Intake" value={alcohol_intake} />
        <InfoField label="Last Menstrual Period" value={formatDate(last_menstrual_period)} />
      </FieldGrid>
    </InfoCard>
  );
}