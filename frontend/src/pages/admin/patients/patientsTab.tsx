import React, { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import {
    RecordsTablePanel,
    PatientRow,
} from "/@/components/Table.tsx";

import { ROUTES } from "/@/config/RoutePaths.js";

import { getAllPatientProfiles } from "/@/api/patient.api";

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