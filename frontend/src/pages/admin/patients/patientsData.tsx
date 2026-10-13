import {Column, StudentCell, optionsFromValues} from "/@/components/table/Table";
import React from "react";

export interface patientData {
    id: string;
    name: string;
    patient_id: string;
    user_type: string;
    course_department: string;
    year_section: string;
}

export const patientColumns: Column<patientData>[] = [
    {
        key: "name",
        label: "Name",
        render: (value) => <StudentCell name={value as string} />,
    },
    {
        key: "patient_id",
        label: "User ID"
    },
    {
        key: "user_type",
        label: "User Type",
        filterType: "select",
        options: optionsFromValues([
            "Student",
            "Professor",
            "Staff"
        ])
    },
    {
        key: "course_department",
        label: "Course / Department"
    },
    {
        key: "year_section",
        label: "Year & Section"
    },
]
