import type {StaffData, StaffPermissions} from "/@/api/schema/StaffSchema";

export type {StaffPermissions};

export class StaffModel {
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

    constructor(data: StaffData) {
        this.id = data.id;
        this.staff_id = data.staff_id;
        this.first_name = data.first_name;
        this.middle_name = data.middle_name;
        this.last_name = data.last_name;
        this.position = data.position;
        this.specialty = data.specialty;
        this.phone = data.phone;
        this.email = data.email;
        this.created_at = data.created_at;
        this.is_active = data.is_active;
        this.role = data.role ?? null;
        this.permissions = data.permissions ?? null;
    }

    getDisplayName(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    getFullName(): string {
        return [
            this.first_name,
            this.middle_name,
            this.last_name,
        ]
            .filter(Boolean)
            .join(" ");
    }

    getInitials(): string {
        return `${this.first_name[0]}${this.last_name[0]}`.toUpperCase();
    }
}