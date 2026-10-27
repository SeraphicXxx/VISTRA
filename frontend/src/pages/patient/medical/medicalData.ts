import {Status} from "/@/components/StatusBadge";

export interface MedicalRecord {
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
}

export interface Visit {
    id: string;
    date: string;
    doctor: string;
    complaint: string;
    treatmentType: string;
    treatment: string;
    status: Status;
}

export type MedicalRecords = Record<string, MedicalRecord>;

export type MyVisits = Record<string, Visit[]>;

export const DEFAULT_STUDENT_ID = "20230847-S";

export const myMedicalRecords: MedicalRecords = {
    "20230847-S": {
        recordId: "MED-1042",
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
    },
    "20230518-S": {
        recordId: "MED-1043",
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
        status: "cleared",
    },
};

export const myVisits: MyVisits = {
    "20230847-S": [
        {
            id: "MED-0001",
            date: "2026-02-14",
            doctor: "Dr. Maria Santos",
            complaint: "Mild fever, headache",
            treatmentType: "Medicine",
            treatment: "Paracetamol 500mg, rest advised",
            status: "cleared",
        },
        {
            id: "MED-0002",
            date: "2026-05-03",
            doctor: "Dr. Ramon Cruz",
            complaint: "Sprained ankle during PE",
            treatmentType: "Procedure",
            treatment: "Ice compress, elastic bandage applied",
            status: "cleared",
        },
        {
            id: "MED-0003",
            date: "2026-08-21",
            doctor: "Dr. Maria Santos",
            complaint: "Annual physical exam",
            treatmentType: "Checkup",
            treatment: "Vitals normal, cleared for PE",
            status: "cleared",
        },
        {
            id: "MED-0004",
            date: "2026-10-05",
            doctor: "Dr. Ramon Cruz",
            complaint: "Persistent cough",
            treatmentType: "Medicine",
            treatment: "Cough syrup, follow-up in 1 week",
            status: "pending",
        },
    ],
    "20230518-S": [
        {
            id: "MED-0005",
            date: "2026-03-10",
            doctor: "Dr. Maria Santos",
            complaint: "Routine check-up",
            treatmentType: "Checkup",
            treatment: "Vitals normal, cleared for classes",
            status: "cleared",
        },
        {
            id: "MED-0006",
            date: "2026-09-15",
            doctor: "Dr. Ramon Cruz",
            complaint: "Headache",
            treatmentType: "Medicine",
            treatment: "Ibuprofen 400mg as needed, hydration advised",
            status: "cleared",
        },
    ],
};

export const emptyMedicalRecord: MedicalRecord = {
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
};