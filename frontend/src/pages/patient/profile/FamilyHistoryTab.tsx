import type { FamilyHistory } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField } from "/@/components/ProfileShared";

export default function FamilyHistoryTab({
  family_history,
  other,
  onEdit,
}: FamilyHistory & { onEdit?: () => void }) {
  return (
    <InfoCard title="Family History & Planning" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Family History" value={family_history} />
        <InfoField label="Other Family History" value={other} />
      </FieldGrid>
    </InfoCard>
  );
}