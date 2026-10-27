import {MedicalVisitSchema} from "/@/api/schema/MedicalSchema";
import {medData} from "/@/pages/admin/medical/medicalData";
import {medicalTypes} from "/@/types/Medical";
import {formatDate} from "/@/utils/FormatDate";

export function toMedicalTableRow(visit: MedicalVisitSchema): medData {
    const rawType = visit.type;

    return {
        id: visit.id.toString(),
        patient_id: visit.patient_id,
        student: visit.patient_name,
        course: visit.course,
        time: formatDate(visit.visit_date),
        type: rawType
            ? (medicalTypes[rawType as keyof typeof medicalTypes] ?? rawType)
            : undefined,
        status: visit.status as medData["status"],
    };
}
