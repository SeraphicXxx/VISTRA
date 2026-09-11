import React from "react";
import {ChevronRight, Plus, UserRound} from "lucide-react";

import { ROUTES } from "/@/config/RoutePaths.js";

import { patientColumns, patientColumnsFilter, patientColumnsFilterOption, patientData } from "./patientsData";

import { usePatientContext } from "/@/context/PatientContext";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {HyperlinkText, LinkButton} from "/@/components/Button";
import {removeNullFilters} from "/@/components/Filters";


export default function PatientsTab() {
    const { patientTableRecords, isLoading, setFilters, isRefreshing } = usePatientContext();
    return (
        <DefaultTablePreset<patientData>
            title="Patients"
            icon={UserRound}
            filterableColumns={patientColumnsFilter}
            filterOptions={patientColumnsFilterOption}
            data={patientTableRecords}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
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

            onRun={(search, filters) => {
                setFilters({
                    search,
                    ...removeNullFilters(filters),
                });
            }}

        />
    );
}