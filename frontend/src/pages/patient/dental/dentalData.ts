import {Status} from "/@/components/StatusBadge";

export type ToothStatus = "healthy" | "filled" | "caries" | "crown" | "missing";

export interface DentalRecord {
    recordId: string;
    studentId: string;
    name: string;
    address: string;
    barangay: string;
    age: string;
    mobileNumber: string;
    sex: string;
    birthday: string;
    civilStatus: string;
    yearSection: string;
    course: string;
    status: Status;
    examDate: string;
    lastVisit: string;
    lastCleaning: string;
    allergies: string;
    medicalHistory: string[];
    teeth: Record<number, ToothStatus>;
}

export interface DentalVisit {
    id: string;
    date: string;
    doctor: string;
    complaint: string;
    treatment: string;
    status: Status;
    calculus: string;
    medication: string;
    notes: string;
}

export type DentalRecords = Record<string, DentalRecord>;

export type DentalVisits = Record<string, DentalVisit[]>;

export const DEFAULT_STUDENT_ID = "20230847-S";

export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
export const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];
export const ALL_TEETH = [...UPPER_RIGHT, ...UPPER_LEFT, ...LOWER_RIGHT, ...LOWER_LEFT];

export const myDentalRecords: DentalRecords = {
    "20230847-S": {
        recordId: "DEN-2041",
        studentId: "20230847-S",
        name: "Kenji Briones Chua",
        address: "123 Rizal Street",
        barangay: "Barangay San Isidro",
        age: "21",
        mobileNumber: "0917 234 5678",
        sex: "Male",
        birthday: "2004-03-12",
        civilStatus: "Single",
        yearSection: "4th Year - Section A",
        course: "BS Computer Science",
        status: "cleared",
        examDate: "2026-08-02",
        lastVisit: "2026-04-11",
        lastCleaning: "2026-08-02",
        allergies: "Penicillin",
        medicalHistory: ["Asthma", "Hypertension"],
        teeth: {16: "filled", 26: "caries", 36: "crown", 46: "missing", 14: "filled", 37: "caries"},
    },
    "20230518-S": {
        recordId: "DEN-2042",
        studentId: "20230518-S",
        name: "Angel Emie Jane Bien",
        address: "123 Mabini Street",
        barangay: "Brgy. 176",
        age: "22",
        mobileNumber: "09171234567",
        sex: "Male",
        birthday: "2003-05-17",
        civilStatus: "Single",
        yearSection: "3rd Year - Section A",
        course: "BS Computer Science",
        status: "pending",
        examDate: "2026-10-12",
        lastVisit: "2026-06-22",
        lastCleaning: "2026-06-22",
        allergies: "Penicillin",
        medicalHistory: ["Appendicitis (appendectomy)"],
        teeth: {16: "filled", 46: "caries"},
    },
};

export const myDentalVisits: DentalVisits = {
    "20230847-S": [
        {
            id: "DEN-0001",
            date: "2026-01-20",
            doctor: "Dr. Ana Reyes",
            complaint: "Toothache, upper left molar",
            treatmentType: "Filling",
            treatment: "Composite filling on tooth 26",
            status: "cleared",
            floss: "Yes",
            brushFrequency: "Twice a day",
            calculus: "Mild",
            medication: "Ibuprofen 400mg as needed",
            notes: "Patient advised to avoid hard foods for 24 hours.",
        },
        {
            id: "DEN-0002",
            date: "2026-04-11",
            doctor: "Dr. Ana Reyes",
            complaint: "Sensitivity to cold",
            treatmentType: "Cleaning",
            treatment: "Scaling and polishing, fluoride applied",
            status: "cleared",
            floss: "No",
            brushFrequency: "Twice a day",
            calculus: "Moderate",
            medication: "None",
            notes: "Recommended flossing daily.",
        },
        {
            id: "DEN-0003",
            date: "2026-08-02",
            doctor: "Dr. Luis Gomez",
            complaint: "Routine dental checkup",
            treatmentType: "Checkup",
            treatment: "Oral exam, X-ray taken, caries on tooth 37 noted",
            status: "pending",
            floss: "Yes",
            brushFrequency: "Twice a day",
            calculus: "Mild",
            medication: "None",
            notes: "Schedule restoration for tooth 37.",
        },
    ],
    "20230518-S": [
        {
            id: "DEN-0004",
            date: "2026-02-10",
            doctor: "Dr. Ana Reyes",
            complaint: "Routine dental checkup",
            treatmentType: "Checkup",
            treatment: "Oral exam, no caries detected",
            status: "cleared",
            floss: "Yes",
            brushFrequency: "Twice a day",
            calculus: "Light",
            medication: "None",
            notes: "Continue daily flossing.",
        },
        {
            id: "DEN-0005",
            date: "2026-06-22",
            doctor: "Dr. Luis Gomez",
            complaint: "Gums bleed when brushing",
            treatmentType: "Cleaning",
            treatment: "Scaling and polishing, fluoride applied",
            status: "cleared",
            floss: "No",
            brushFrequency: "Twice a day",
            calculus: "Moderate",
            medication: "None",
            notes: "Recommended daily flossing and a follow-up cleaning in 3 months.",
        },
        {
            id: "DEN-0006",
            date: "2026-10-12",
            doctor: "Dr. Ana Reyes",
            complaint: "Sensitivity to cold, lower right",
            treatmentType: "Treatment",
            treatment: "Sensitivity noted on tooth 46, desensitizing treatment scheduled",
            status: "pending",
            floss: "Yes",
            brushFrequency: "Twice a day",
            calculus: "Light",
            medication: "Potassium nitrate toothpaste",
            notes: "Schedule desensitizing treatment for tooth 46.",
        },
    ],
};

export const emptyDentalRecord: DentalRecord = {
    recordId: "",
    studentId: "",
    name: "",
    address: "",
    barangay: "",
    age: "",
    mobileNumber: "",
    sex: "",
    birthday: "",
    civilStatus: "",
    yearSection: "",
    course: "",
    status: "pending",
    examDate: "",
    lastVisit: "",
    lastCleaning: "",
    allergies: "",
    medicalHistory: [],
    teeth: {},
};