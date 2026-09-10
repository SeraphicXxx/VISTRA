import { PatientProfile } from "/@/api/schema/PatientSchema";
import { formatDate } from "/@/utils/DateUtils";

export interface PatientDashboardRecord {
    id: string;
    name: string;
    patient_id: string;
    user_type: string;
    course_department: string;
    year_section: string;
    last_visit: string;
}

interface PatientRecord {
    id: string;
    title: string;
    date: string;
    details: string;
    provider: string;
}

interface PatientRecords {
    medical: PatientRecord[];
    dental: PatientRecord[];
    appointment: PatientRecord[];
}

export class PatientModel {
    private PatientProfile: PatientProfile;

    constructor(patientProfile: PatientProfile) {
        this.PatientProfile = patientProfile;
    }

    dataViewPatientDashboardRecord(): PatientDashboardRecord {
        return {
            id: this.PatientProfile.patient_id,

            name: [
                this.PatientProfile.first_name,
                this.PatientProfile.middle_name,
                this.PatientProfile.last_name,
            ]
                .filter(Boolean)
                .join(" "),

            patient_id: this.PatientProfile.patient_id,

            user_type: this.PatientProfile.person_type,

            course_department: this.PatientProfile.course || this.PatientProfile.department ? `${this.PatientProfile.course || ""}  ${this.PatientProfile.department || ""}` : "N/A",

            year_section: this.PatientProfile.school_year ?? "N/A",

            last_visit: formatDate(this.PatientProfile.created_at),
        };
    }

    dataViewPatientRecords(): PatientRecords {
        return {
            medical: [],
            dental: [],
            appointment: [],
        };
    }
}