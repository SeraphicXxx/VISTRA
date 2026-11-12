import type { VitalSigns } from "./patient.sample";
import { FieldGrid, InfoCard, InfoField, formatDate } from "/@/components/ProfileShared";

export default function VitalSignsTab({
  height,
  weight,
  temperature,
  heart_rate,
  spo2,
  recorded_at,
}: VitalSigns) {
  return (
    <InfoCard title="Vital Signs">
      <FieldGrid>
        <InfoField label="Height (cm)" value={height} />
        <InfoField label="Weight (kg)" value={weight} />
        <InfoField label="Temperature (°C)" value={temperature} />
        <InfoField label="Heart Rate (bpm)" value={heart_rate} />
        <InfoField label="SpO₂ (%)" value={spo2} />
        <InfoField label="Recorded At" value={formatDate(recorded_at)} />
      </FieldGrid>
    </InfoCard>
  );
}