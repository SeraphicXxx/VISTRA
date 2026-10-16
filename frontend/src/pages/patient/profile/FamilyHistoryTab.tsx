import type { FamilyHistory } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField } from "/@/components/ProfileShared";

export default function FamilyHistoryTab({
  family_history,
  family_history_others,
  family_planning_method,
  onEdit,
}: FamilyHistory & { onEdit?: () => void }) {
  return (
    <InfoCard title="Family History & Planning" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Family History" value={family_history.join(", ")} />
        <InfoField label="Other Family History" value={family_history_others} />
        <InfoField label="Family Planning Method" value={family_planning_method} />
      </FieldGrid>
    </InfoCard>
  );
}