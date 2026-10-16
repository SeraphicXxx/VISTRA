import type { ExaminationResults } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField, formatDate } from "/@/components/ProfileShared";

export default function ExaminationResultsTab({
  chest_xray,
  cbc,
  urinalysis,
  recommendation,
  examination_date,
  examining_physician,
  onEdit,
}: ExaminationResults & { onEdit?: () => void }) {
  return (
    <InfoCard title="Examination Results" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Chest X-Ray" value={chest_xray} />
        <InfoField label="CBC" value={cbc} />
        <InfoField label="Urinalysis" value={urinalysis} />
        <InfoField label="Examination Date" value={formatDate(examination_date)} />
        <InfoField label="Examining Physician" value={examining_physician} />
        <InfoField label="Recommendations" value={recommendation} />
      </FieldGrid>
    </InfoCard>
  );
}