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
  alcohol,
  contraceptive,
  sexual_activity,
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
        <InfoField label="Smoking" value={smoking} />
        <InfoField label="Vaping" value={vaping} />
        <InfoField label="Alcohol Intake" value={alcohol} />
        <InfoField label="Contraceptive" value={contraceptive} />
        <InfoField label="Sexual Activity" value={sexual_activity} />
      </FieldGrid>
    </InfoCard>
  );
}