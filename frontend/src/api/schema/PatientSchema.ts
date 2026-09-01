export interface CreatePatientSchema {
    patient_id: string
    email: string
    password: string
    created_by: string

    name: string
    address: string
    age: number
    barangay: string
    birthday: string
    mobile_number: string
    sex: string
    civil_status: string
    classification: string

    student_id?: string
    faculty_id?: string
    admin_id?: string

    course?: string
    year?: string
    section?: string
    department?: string
    position?: string
}