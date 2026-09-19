import {Dentition, ToothCondition} from "/@/types/Dental"

export interface ToothSchema {
    id: string
    appointment_id: string,
    patient_id: string,
    tooth_number: number,
    dentition: Dentition,
    condition: ToothCondition,
    notes: string
}

export type CreateToothRequest = Omit<
    ToothSchema,
    "id" | "appointment_id" | "patient_id"
>;