import React, {useState} from "react";
import {Modal, FormField} from "/@/components/editModal";

export type JobRole =
    | "Super Administrator"
    | "Admin"
    | "Doctor"
    | "Nurse"
    | "Dentist"
    | "Clinic OJT";

export type AccessPermission =
    | "Medical Records"
    | "Dental Records"
    | "Appointments"
    | "Patient Records"
    | "Staff Management";

export const STAFF_POSITIONS: string[] = [
    "Physicians",
    "Registered Nurses",
    "Nurse Practitioners",
    "Physician Assistants",
    "Intern",
];

export interface NewStaffData {
    lastName: string;
    firstName: string;
    middleName: string;
    idNumber: string;
    role: JobRole;
    position: string;
    password: string;
    roles: AccessPermission[];
}

export const JOB_ROLES: JobRole[] = [
    "Super Administrator",
    "Admin",
    "Doctor",
    "Nurse",
    "Dentist",
    "Clinic OJT",
];

export const PERMISSIONS: AccessPermission[] = [
    "Medical Records",
    "Dental Records",
    "Appointments",
    "Patient Records",
    "Staff Management",
];

type FieldKey = "lastName" | "firstName" | "middleName" | "idNumber" | "role" | "position" | "password";

const fields: {
    key: FieldKey;
    label: string;
    required?: boolean;
    type?: "select" | "password";
    options?: string[];
}[] = [
    {key: "lastName", label: "Last name", required: true},
    {key: "firstName", label: "First name", required: true},
    {key: "middleName", label: "Middle name"},
    {key: "idNumber", label: "Staff ID", required: true},
    {key: "role", label: "Role", type: "select", options: JOB_ROLES},
    {key: "position", label: "Position", type: "select", options: STAFF_POSITIONS, required: true},
    {key: "password", label: "Password", type: "password", required: true},
];

const emptyForm: NewStaffData = {
    lastName: "",
    firstName: "",
    middleName: "",
    idNumber: "",
    role: JOB_ROLES[0],
    position: "",
    password: "",
    roles: [],
};

interface NewStaffModalProps {
    onClose: () => void;
    onSave: (data: NewStaffData) => void;
}

export function NewStaffModal({onClose, onSave}: NewStaffModalProps) {
    const [form, setForm] = useState<NewStaffData>(emptyForm);

    const update = (key: FieldKey, value: string) => {
        setForm((prev) => ({...prev, [key]: value}));
    };

    const togglePermission = (permission: AccessPermission, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            roles: checked
                ? [...prev.roles.filter((p) => p !== permission), permission]
                : prev.roles.filter((p) => p !== permission),
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave({...form});
    };

    return (
        <Modal
            title="New staff member"
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="new-staff-form"
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark"
                    >
                        Add staff
                    </button>
                </>
            }
        >
            <form id="new-staff-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {fields.map((field) => (
                        <FormField
                            key={field.key}
                            field={field}
                            value={form[field.key]}
                            onChange={update}
                        />
                    ))}
                </div>

                <fieldset>
                    <legend className="mb-2 text-xs font-medium text-textMuted">
                        Access & Permissions
                    </legend>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {PERMISSIONS.map((permission) => (
                            <label
                                key={permission}
                                className="flex items-center gap-2 text-sm text-textPrimary"
                            >
                                <input
                                    type="checkbox"
                                    checked={form.roles.includes(permission)}
                                    onChange={(e) => togglePermission(permission, e.target.checked)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                                />
                                {permission}
                            </label>
                        ))}
                    </div>
                </fieldset>
            </form>
        </Modal>
    );
}