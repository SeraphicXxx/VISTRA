export interface MedicalVisitSchema {
    id: number;
    patient_id: string;
    patient_name: string;
    course: string;
    visit_date: string;
    staff_id: string;
    status: string;
    type: string;
}

export interface MedicalRecordDetailSchema {
    medical_visit_id: string;
    patient_name: string;
    patient_id: string;
    status: string;
    course: string | null;
    year_section: string | null;
    age: string | null;
    sex: string | null;
    civil_status: string | null;
    birthday: string | null;
    address: string | null;
    barangay: string | null;
    mobileNumber: string | null;
    staff_name: string | null;
    visit_date: string | null;
    complaint: string | null;
    treatment: string | null;
    treatment_type: string | null;
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

export interface UpdateMedicalVisit {
    visit_date?: string;
    status?: string;
    complaint?: string;
    treatment?: string;
}
