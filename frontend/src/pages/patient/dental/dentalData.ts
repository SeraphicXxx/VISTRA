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
    treatmentType: string;
    treatment: string;
    status: Status;
    floss: string;
    brushFrequency: string;
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
        lastCleaning: "2026-08-02",
        allergies: "Penicillin",
        medicalHistory: ["Asthma", "Hypertension"],
        teeth: {16: "filled", 26: "caries", 36: "crown", 46: "missing", 14: "filled", 37: "caries"},
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
    lastCleaning: "",
    allergies: "",
    medicalHistory: [],
    teeth: {},
};