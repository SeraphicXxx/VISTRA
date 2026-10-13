import {Status, StatusBadge} from "/@/components/StatusBadge";

import {Column, StudentCell, courseFilterOptions} from "/@/components/table/Table";

export const dentalRecords: DentalData[] = [

    {
        id: "DEN-1042",
        student: "James Bontogon",
        course: "BS Computer Science",
        time: "9:00 AM",
        type: "Dental Consultation",
        status: "completed",
    },

    {
        id: "DEN-1043",
        student: "Heart Combinido",
        course: "BS Psychology",
        time: "9:30 AM",
        type: "Tooth Extraction",
        status: "followUp",
    },

    {
        id: "DEN-1044",
        student: "Angelo Bejamino",
        course: "BS Industrial Engineering",
        time: "10:00 AM",
        type: "Oral Prophylaxis",
        status: "completed",
    },

    {
        id: "DEN-1045",
        student: "Natasha Pinon",
        course: "BS Electronics Engineering",
        time: "10:15 AM",
        type: "Dental Filling",
        status: "referred",
    },

    {
        id: "DEN-1046",
        student: "Rosh Ingel",
        course: "BS Accountancy",
        time: "10:45 AM",
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
        render: (value) => <StudentCell name={value as string} />,
    },

    {
        key: "course",
        label: "Course",
        filterType: "select",
        options: courseFilterOptions,
    },

    {
        key: "type",
        label: "Type",
        filterType: "select",
        options: dentalTypes,
    },

    {
        key: "time",
        label: "Time",
        filterType: "date",
    },

    {
        key: "status",
        label: "Status",
        filterType: "select",
        options: [
            "ongoingTreatment",
            "followUp",
            "declined",
            "completed",
            "referred",
        ],
        render: (value) => (
            <StatusBadge status={value as Status}/>
        ),
    },

];

