export interface MedicalVisitSchema {
    id: number;
    patient_id: string;
    patient_name: string;
    course: string;
    visit_date: string;
    staff_id: string;
    status: string;
    type: string | null;
}

export interface MedicalRecordDetailSchema {
    medical_visit_id: string;
    patient_name: string;
    status: string;
    course: string | null;
    staff_name: string | null;
}

export interface CreateMedicalVisit {
    patient_id: string;
    staff_id: string;
    status: string;
    type: string;
    treatment_type: string;
    visit_date: string;
    complaint: string;
    treatment: string;
}

export interface CreateMedicalVisitResponse {
    success: boolean;
    medical_visit_id?: number;
    error?: string;
}
