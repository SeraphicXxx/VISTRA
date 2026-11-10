import {Status, StatusBadge} from "/@/components/StatusBadge";

import {Column, StudentCell, courseFilterOptions} from "/@/components/table/Table";

export const dentalRecords: DentalData[] = [

    {
        id: "DEN-1042",
        studentId: "STU-0001",
        student: "James Bontogon",
        course: "BS Computer Science",
        time: "2026-10-20",
        type: "Dental Consultation",
        status: "completed",
    },

    {
        id: "DEN-1043",
        studentId: "STU-0001",
        student: "Heart Combinido",
        course: "BS Psychology",
        time: "2026-10-20",
        type: "Tooth Extraction",
        status: "followUp",
    },

    {
        id: "DEN-1044",
        studentId: "STU-0001",
        student: "Angelo Bejamino",
        course: "BS Industrial Engineering",
        time: "2026-10-20",
        type: "Oral Prophylaxis",
        status: "completed",
    },

    {
        id: "DEN-1045",
        studentId: "STU-0001",
        student: "Natasha Pinon",
        course: "BS Electronics Engineering",
        time: "2026-10-20",
        type: "Dental Filling",
        status: "referred",
    },

    {
        id: "DEN-1046",
        studentId: "STU-0001",
        student: "Rosh Ingel",
        course: "BS Accountancy",
        time: "2026-10-20",
        type: "Dental Consultation",
        status: "ongoingTreatment",
    },

];

export const dentalTypes = [
    "Dental Consultation",
    "Tooth Extraction",
    "Oral Prophylaxis",
    "Dental Filling",
];

export interface DentalData {

    id: string;
    studentId: string;
    student: string;
    course: string;
    time: string;
    type: string;
    status: Status;

}

export const DentalColumns: Column<DentalData>[] = [

    {
        key: "student",
        label: "Student",
        render: (value, record) => <StudentCell name={value as string} patientId={record.studentId} />,    },

    {
        key: "course",
        label: "Course",
        filterType: "select",
        options: courseFilterOptions,
    },

    // {
    //     key: "type",
    //     label: "Type",
    //     filterType: "select",
    //     options: dentalTypes,
    // },

    {
        key: "time",
        label: "Date",
        filterType: "date",
    },

    {
        key: "status",
        label: "Status",
        filterType: "select",
        render: (value) => (
            <StatusBadge status={value as Status}/>
        ),
    },

];

