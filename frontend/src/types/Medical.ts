// Mirrors backend app/enums/medical_terms.py::MedicalVisitStatus.
// Keys are the backend enum names, values the stored labels
// (medical_tab.status comes from visit_log ->> 'status'),
// so filter options send exactly what the backend compares.
export const medicalStatuses = {
    cleared: "Cleared",
    notCleared: "Not Cleared",
    secondOption: "Second Option",
    recovered: "Recovered",
    referred: "Referred",
    ongoingTreatment: "Ongoing Treatment",
} as const;

export type MedicalStatus = keyof typeof medicalStatuses;

// Mirrors backend app/enums/medical_terms.py::MedicalVisitTypes.
// Keys are the stored values (MEDICAL_VISIT.type), values the display labels.
export const medicalTypes = {
    medicalConsultation: "Medical Consultation",
    followUp: "Follow-up",
} as const;

export type MedicalType = keyof typeof medicalTypes;
