export type FitnessStatus = "fit" | "fit_with_restrictions" | "unfit";

export interface PatientSummary {
    name: string;
    studentId: string;
    age?: string;
    sex?: string;
    courseSection?: string;
}

export interface FitToWorkCertificate {
    full_name: string;
    student_id: string;
    age: string;
    sex: string;
    course_section: string;
    examination_date: string;
    issue_date: string;
    valid_until: string;
    purpose: string;
    fitness_status: FitnessStatus;
    restrictions: string;
    remarks: string;
    examining_physician: string;
    license_no: string;
}

export const FITNESS_OPTIONS: { value: FitnessStatus; label: string; hint: string }[] = [
    {value: "fit", label: "Fit to work", hint: "No restrictions."},
    {value: "fit_with_restrictions", label: "Fit with restrictions", hint: "List the restrictions below."},
    {value: "unfit", label: "Not fit to work", hint: "Give the reason in remarks."},
];

export function isFitToWorkType(type?: string | null): boolean {
    return /fit\s*to\s*work/i.test(type ?? "");
}

function toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function buildCertificateDefaults(args: {
    patient: PatientSummary;
    examinationDate: string;
    physician: string;
}): FitToWorkCertificate {
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + 30);

    return {
        full_name: args.patient.name,
        student_id: args.patient.studentId,
        age: args.patient.age ?? "",
        sex: args.patient.sex ?? "",
        course_section: args.patient.courseSection ?? "",
        examination_date: args.examinationDate,
        issue_date: toIsoDate(today),
        valid_until: toIsoDate(validUntil),
        purpose: "Fit to work requirement",
        fitness_status: "fit",
        restrictions: "",
        remarks: "",
        examining_physician: args.physician,
        license_no: "",
    };
}