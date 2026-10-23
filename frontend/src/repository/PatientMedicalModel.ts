import {formatDate} from "/@/utils/FormatDate";
import {PatientMedicalTabVisit} from "/@/api/schema/PatientMedicalTabSchema";
import {Visit} from "/@/pages/patient/medical/medicalData";

export function toPatientMedicalTableRow(item: PatientMedicalTabVisit): Visit {
    return {
        id: String(item.id),
        date: item.visit_date ? formatDate(item.visit_date) : "",
        doctor: item.doctor ?? item.staff_id ?? "",
        complaint: item.complaint ?? "",
        treatmentType: item.treatment_type ?? "",
        treatment: "",
        status: (item.status ?? "pending") as Visit["status"],
    };
}
