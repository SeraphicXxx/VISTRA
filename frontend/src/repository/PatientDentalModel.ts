import {formatDate} from "/@/utils/FormatDate";
import {PatientDentalTabVisit} from "/@/api/schema/PatientDentalTabSchema";
import {DentalVisit} from "/@/pages/patient/dental/dentalData";

export function toPatientDentalTableRow(item: PatientDentalTabVisit): DentalVisit {
    return {
        id: String(item.id),
        date: item.visit_date ? formatDate(item.visit_date) : "",
        doctor: item.dentist ?? item.staff_id ?? "",
        complaint: item.notes ?? "",
        treatment: "",
        status: (item.status ?? "pending") as DentalVisit["status"],
        calculus: item.calculus ?? "",
        medication: item.medication ?? "",
        notes: item.notes ?? "",
    };
}
