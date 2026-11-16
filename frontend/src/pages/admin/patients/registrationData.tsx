import {Column, StudentCell} from "/@/components/table/Table";
import {StatusBadge} from "/@/components/StatusBadge";
import React from "react";

export interface RegistrationTableFormat {
    id: string;
    patient_id: string;
    name: string;
    status: string;
}

export const registrationColumns: Column<RegistrationTableFormat>[] = [
    {
        key: "name",
        label: "Name",
        render: (value, record) => (
            <StudentCell name={value as string} patientId={record.patient_id} />
        ),
    },
    {
        key: "patient_id",
        label: "Patient ID",
    },
    {
        key: "status",
        label: "Status",
        render: (value) => <StatusBadge status={value as string} />,
    },
];
