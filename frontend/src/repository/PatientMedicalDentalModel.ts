import {PatientRecord} from "/@/api/schema/PatientSchema";
import {Visit} from "/@/types/types";

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
        treatment: item.notes ?? "",
    }));

    const dentalVisits: Visit[] = (summary.dental ?? []).map((item) => ({
        id: String(item.id),
        date: item.date,
        doctor: item.provider ?? "",
        complaint: item.title,
        treatment: item.notes ?? "",
    }));

    return [...medicalVisits, ...dentalVisits];
}
