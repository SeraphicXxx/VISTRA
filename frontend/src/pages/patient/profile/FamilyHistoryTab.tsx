import type { FamilyHistory } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField } from "/@/components/ProfileShared";

export default function FamilyHistoryTab({
  condition,
  other_condition,
  onEdit,
}: FamilyHistory & { onEdit?: () => void }) {
  return (
    <InfoCard title="Family History & Planning" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Family History / Condition" value={condition} />
        <InfoField label="Other Condition" value={other_condition} />
      </FieldGrid>
    </InfoCard>
  );
}