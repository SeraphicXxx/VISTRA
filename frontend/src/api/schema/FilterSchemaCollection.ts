export interface PageParams {
    page?: number;
    page_size?: number;
}

export interface PatientFilters extends PageParams {
    search?: string;
    sex?: string;
    user_type?: string;
    course?: string;
    yearSection?: string;
}

export interface AppointmentFilters extends PageParams {
    search?: string;
    status?: string;
    type?: string;
    course?: string;
    date?: string;
    patient_id?: string;
}

export interface DentalVisitFilters extends PageParams {
    search?: string;
    status?: string;
    date?: string;
    course?: string;
}

export interface MedicalVisitFilters extends PageParams {
    search?: string;
    status?: string;
    type?: string;
    date?: string;
    course?: string;
}
