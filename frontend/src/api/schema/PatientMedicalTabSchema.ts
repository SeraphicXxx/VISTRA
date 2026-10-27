export interface PatientMedicalTabVisit {
    id: number;
    patient_id: string;
    patient_name: string;
    course: string;
    visit_date: string;
    staff_id: string;
    doctor: string;
    status: string;
    treatment_type: string | null;
    complaint: string;
    treatment: string;
}
