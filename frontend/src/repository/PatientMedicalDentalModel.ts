import {PatientRecord} from "/@/api/schema/PatientSchema";
import {Visit} from "/@/pages/patient/medical/medicalData";

export interface MedicalDentalSummary {
    medical: PatientRecord[];
    dental: PatientRecord[];
}

export function toPatientMedicalDentalVisits(summary: MedicalDentalSummary): Visit[] {
    const medicalVisits: Visit[] = (summary.medical ?? []).map((item) => ({
        id: String(item.id),
        date: item.date,
        doctor: item.provider ?? "",
        complaint: item.title,
        treatmentType: "Medical",
        treatment: item.notes ?? "",
        status: "cleared" as Visit["status"],
    }));

    const dentalVisits: Visit[] = (summary.dental ?? []).map((item) => ({
        id: String(item.id),
        date: item.date,
        doctor: item.provider ?? "",
        complaint: item.title,
        treatmentType: "Dental",
        treatment: item.notes ?? "",
        status: "cleared" as Visit["status"],
    }));

    return [...medicalVisits, ...dentalVisits];
}
