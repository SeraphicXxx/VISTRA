import {MedicalVisitSchema} from "/@/api/schema/MedicalSchema";
import {medData} from "/@/pages/admin/medical/medicalData";
import {medicalTypes} from "/@/types/Medical";
import {formatDate} from "/@/utils/FormatDate";

export class MedicalModel {
    private medicalVisitSchema: MedicalVisitSchema;

    constructor(medicalVisitSchema: MedicalVisitSchema) {
        this.medicalVisitSchema = medicalVisitSchema;
    }

    UiTableFormat(): medData {
        const rawType = this.medicalVisitSchema.type;

        return {
            id: this.medicalVisitSchema.id.toString(),
            patient_id: this.medicalVisitSchema.patient_id,
            student: this.medicalVisitSchema.patient_name,
            course: this.medicalVisitSchema.course,
            time: formatDate(this.medicalVisitSchema.visit_date),
            type: rawType
                ? (medicalTypes[rawType as keyof typeof medicalTypes] ?? rawType)
                : undefined,
            status: this.medicalVisitSchema.status as medData["status"],
        };
    }
}
