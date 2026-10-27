export interface PatientDentalTabVisit {
    id: number;
    patient_id: string;
    patient_name: string;
    course: string;
    visit_date: string;
    staff_id: string;
    dentist: string;
    status: string;
    calculus: string | null;
    medication: string | null;
    notes: string | null;
}
