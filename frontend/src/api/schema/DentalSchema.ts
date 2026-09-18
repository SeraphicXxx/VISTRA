export interface ToothSchema {
    id: string
    appointment_id: string,
    patient_id: string,
    tooth_number: number,
    dentition: string,
    condition: string,
    notes: string
}

export type CreateToothRequest = Omit<
    ToothSchema,
    "id" | "appointment_id" | "patient_id"
>;