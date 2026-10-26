export interface RecordDetail {
  diagnosis: string;
  treatment: string;
  followUp: string | null;
  notes: string;
}

export const RECORD_DETAILS: Record<string, RecordDetail> = {
  r1: {
    diagnosis: "Dentin hypersensitivity",
    treatment: "Desensitizing toothpaste and fluoride application",
    followUp: "2026-10-27",
    notes: "Avoid very cold and acidic foods. Use a soft-bristle brush.",
  },
  r2: {
    diagnosis: "No acute findings",
    treatment: "Routine examination",
    followUp: null,
    notes: "Maintain regular exercise and a balanced diet.",
  },
  r3: {
    diagnosis: "Plaque and calculus build-up",
    treatment: "Scaling and polishing",
    followUp: "2026-11-30",
    notes: "Brush twice daily and floss every night.",
  },
  r4: {
    diagnosis: "Elevated blood pressure reading (monitoring)",
    treatment: "Lifestyle advice and repeat measurement",
    followUp: "2026-11-14",
    notes: "Reduce salt intake and record readings at home.",
  },
  r5: {
    diagnosis: "Dental caries, molar",
    treatment: "Composite resin filling",
    followUp: null,
    notes: "Avoid hard foods on the treated side for 24 hours.",
  },
  r6: {
    diagnosis: "Healthy adult, no acute issues",
    treatment: "General health screening",
    followUp: "2027-03-18",
    notes: "Repeat the annual physical as scheduled.",
  },
};