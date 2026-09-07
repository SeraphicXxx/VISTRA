import React from "react";
import { UserRound } from "lucide-react";
import {
    RecordsTablePanel,
    PatientRow,
} from "/@/components/Table";

import { ROUTES } from "/@/config/RoutePaths.js";

import { patientColumns } from "./patientsData";

import { usePatients } from "/@/context/PatientContext";
import LoadingPage from "/@/components/LoadingPage";


export default function PatientsTab() {
    const { patientRecords, isLoading } = usePatients();

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <RecordsTablePanel
            name="Patient"
            icon={UserRound}
            //TODO make RecordsTablePanel data to any type
            data={patientRecords}
            columns={patientColumns}
            createRecordPath={ROUTES.admin.patient.createNewRecord}
            renderRow={(record) => (
                <PatientRow
                    data={record}
                    viewRecordPath={
                        ROUTES.admin.patient.patientRecordTab
                    }
                />
            )}
        />
    );
}