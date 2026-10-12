import { PatientProfile } from "/@/api/schema/PatientSchema";
import {patientData} from "/@/pages/admin/patients/patientsData";
import {joinName} from "/@/utils/joinName";

export function toPatientDashboardRecord(profile: PatientProfile): patientData {
    return {
        id: profile.patient_id,

        name: joinName([
            profile.first_name,
            profile.middle_name,
            profile.last_name,
        ]),

        patient_id: profile.patient_id,

        user_type: profile.person_type,

        course_department: profile.course || profile.department ? `${profile.course || ""}  ${profile.department || ""}` : "N/A",

        year_section: profile.school_year ?? "N/A",

    };
}
