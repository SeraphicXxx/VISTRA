import type { VitalSigns } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField } from "/@/components/ProfileShared";

export default function VitalSignsTab({
  temperature,
  blood_pressure,
  heart_rate,
  respiratory_rate,
  eyes,
  onEdit,
}: VitalSigns & { onEdit?: () => void }) {
  return (
    <InfoCard title="Vital Signs" onEdit={onEdit}>
      <FieldGrid>
        <InfoField label="Temperature (°C)" value={temperature} />
        <InfoField label="Blood Pressure" value={blood_pressure} />
        <InfoField label="Heart Rate (bpm)" value={heart_rate} />
        <InfoField label="Respiratory Rate" value={respiratory_rate} />
        <InfoField label="Eyes" value={eyes} />
      </FieldGrid>
    </InfoCard>
  );
}