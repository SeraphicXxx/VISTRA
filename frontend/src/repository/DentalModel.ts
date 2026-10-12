import {DentalVisitSchema} from "/@/api/schema/DentalSchema";
import {DentalData} from "/@/pages/admin/dental/DentalData";
import {formatDate} from "/@/utils/FormatDate";

export function toDentalTableRow(visit: DentalVisitSchema): DentalData {
    return {
        id: visit.id.toString(),
        studentId: visit.patient_id,
        student: visit.patient_name,
        course: visit.course,
        time: formatDate(visit.visit_date),
        status: visit.status
    };
}
