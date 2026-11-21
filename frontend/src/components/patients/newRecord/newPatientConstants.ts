import {FACULTY_ID_PATTERN, validateFacultyId} from "/@/utils/NewPatientValidation.jsx";

export type Classification = "student" | "faculty" | "university_staff";
export type PatientRecord = Record<string, FormDataEntryValue>;
export type FormControl = HTMLInputElement | HTMLSelectElement;

export const BIRTHDAY_ERROR = "Enter a valid birthday that is not in the future.";

export const CLASSIFICATION_OPTIONS: {value: Classification; label: string}[] = [
    {value: "student", label: "Student"},
    {value: "faculty", label: "Faculty/Professor"},
    {value: "university_staff", label: "University Staff"},
];

export const STAFF_POSITION_OPTIONS: string[] = [
    "Maintenance",
    "Security",
    "Other University Facilities",
];

export const STAFF_ID_PATTERN = "UF-[0-9]{4}-[0-9]{3}";

export const validateStaffId = (value: string): string =>
    /^UF-[0-9]{4}-[0-9]{3}$/.test(value) ? "" : "Use the format UF-2023-045";

export interface IdFieldConfig {
    label: string;
    placeholder: string;
    pattern: string;
    validate: (value: string) => string;
}

export const ID_FIELDS: Record<Classification, IdFieldConfig> = {
    student: {
        label: "Student ID",
        placeholder: "20230786-S",
        pattern: "[0-9]{8}-S",
        validate: (value: string) => (/^[0-9]{8}-S$/.test(value) ? "" : "Use the format 20230786-S"),
    },
    faculty: {
        label: "Faculty/Professor ID",
        placeholder: "F-2023-045",
        pattern: FACULTY_ID_PATTERN,
        validate: validateFacultyId,
    },
    university_staff: {
        label: "University Staff ID",
        placeholder: "UF-2023-045",
        pattern: STAFF_ID_PATTERN,
        validate: validateStaffId,
    },
};