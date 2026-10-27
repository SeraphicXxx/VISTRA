import { DetailModal } from "/@/components/viewModal.jsx";

export const toothConditionMeta = {
  sound: {
    label: "Sound (/)",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  decayed: {
    label: "Decayed (D)",
    badgeClassName: "border-red-200 bg-red-50 text-red-700",
  },
  filled: {
    label: "Filled (F)",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
  },
  missing: {
    label: "Missing (M)",
    badgeClassName: "border-textMuted/30 bg-textMuted/5 text-textSecondary",
  },
  extraction: {
    label: "Indicated for extraction (X)",
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-700",
  },
  unerupted: {
    label: "Unerupted (Un)",
    badgeClassName: "border-textMuted/30 bg-textMuted/5 text-textSecondary",
  },
  supernumerary: {
    label: "Supernumerary (Sn)",
    badgeClassName: "border-purple-200 bg-purple-50 text-purple-700",
  },
};

/** @deprecated Use toothConditionMeta to keep label and style in sync. */
export const conditionLabels = Object.fromEntries(
  Object.entries(toothConditionMeta).map(([key, meta]) => [key, meta.label])
);

/** @deprecated Use toothConditionMeta to keep label and style in sync. */
export const conditionBadgeStyles = Object.fromEntries(
  Object.entries(toothConditionMeta).map(([key, meta]) => [key, meta.badgeClassName])
);


export function ToothViewModal({ toothNumber, record, onClose }) {
  const meta = record ? toothConditionMeta[record.condition] : undefined;

  return (
    <DetailModal
      title={`Tooth ${toothNumber}`}
      onClose={onClose}
      badge={
        record
          ? {
              label: meta?.label || record.condition,
              className: meta?.badgeClassName || toothConditionMeta.sound.badgeClassName,
            }
          : undefined
      }
      fields={
        record
          ? [
              { label: "Dentition", value: record.dentition === "temporary" ? "Temporary" : "Permanent" },
              { label: "Notes", value: record.notes, span: true },
            ]
          : []
      }
      emptyMessage="No record for this tooth — assumed sound."
    />
  );
}