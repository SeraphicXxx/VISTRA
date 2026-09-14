export interface PatientFilters {
    search?: string;
    sex?: string;
    user_type?: string;
    course?: string;
    yearSection?: string;

    page?: number;
    page_size?: number;
    total?: number;
    total_pages?: number
}