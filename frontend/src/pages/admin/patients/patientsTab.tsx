import React from "react";
import {ChevronRight, Plus, UserRound} from "lucide-react";

import { ROUTES } from "/@/config/RoutePaths.js";

import { patientColumns, patientColumnsFilter, patientColumnsFilterOption, patientData } from "./patientsData";

import { usePatientContext } from "/@/context/PatientContext";
import LoadingPage from "/@/components/LoadingPage";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {HyperlinkText, LinkButton} from "/@/components/Button";


export default function PatientsTab() {
    const { patientRecords, isLoading } = usePatientContext();
    if (isLoading) {
        return <LoadingPage />;
    }
    return (
        <DefaultTablePreset<patientData>
            title="Patients"
            icon={UserRound}
            filterableColumns={patientColumnsFilter}
            filterOptions={patientColumnsFilterOption}
            data={patientRecords}
            columns={patientColumns}
            panelAddon={
                <LinkButton
                    title={`New Patient Record`}
                    route={`${ROUTES.staff.patient.createNewRecord}`}
                    icon={Plus}
                />
            }
            renderAction={
                (patient) => (
                    <HyperlinkText
                        title={`View`}
                        link={`${ROUTES.staff.patient.patientRecordTab}/${patient.patient_id}`}
                        icon={ChevronRight}
                    />
                )
            }
        />
    );
}