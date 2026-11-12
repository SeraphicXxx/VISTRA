import type { ExaminationResults } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField, formatDate } from "/@/components/ProfileShared";

export default function ExaminationResultsTab({
  chest_xray,
  cbc,
  urinalysis,
  recommendation,
  created_at,
  updated_at,
  onEdit,
}: ExaminationResults & { onEdit?: () => void }) {
  return (
    <InfoCard title="Examination Results" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Chest X-Ray" value={chest_xray} />
        <InfoField label="CBC" value={cbc} />
        <InfoField label="Urinalysis" value={urinalysis} />
        <InfoField label="Recommendations" value={recommendation} />
        <InfoField label="Created At" value={formatDate(created_at)} />
        <InfoField label="Updated At" value={formatDate(updated_at)} />
      </FieldGrid>
    </InfoCard>
  );
}