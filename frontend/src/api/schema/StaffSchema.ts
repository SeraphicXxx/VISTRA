export interface StaffPermissions {
    dental_module: boolean;
    medical_module: boolean;
    appointment_module: boolean;
    patient_module: boolean;
    staff_module: boolean;
}

export type UpdateStaffPermissions = Partial<StaffPermissions>;

export interface CreateStaffRequest {
    staff_id: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    password: string;
    position: string;
    specialty?: string | null;
    phone?: string | null;
    email?: string | null;
    role?: string | null;
    permissions?: StaffPermissions;
}

export interface StaffData {
    id: string;
    staff_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    position: string;
    specialty: string | null;
    phone: string | null;
    email: string;
    created_at: string;
    is_active: boolean;
    role: string | null;
    permissions: StaffPermissions | null;
}
