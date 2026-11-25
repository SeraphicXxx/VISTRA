import {UserRound} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "/@/config/RoutePaths";
import {patientColumns, patientData} from "./patientsData";
import {usePatientContext} from "/@/context/PaginatedContext";
import {toPatientDashboardRecord} from "/@/repository/PatientModel";
import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {VisitTab} from "/@/components/VisitTab";
import {AccountRequestButton} from "/@/components/register/AccountRequestButton";

interface PatientsTabProps {
    setFilters: (filters: PatientFilters) => void;
}

export default function PatientsTab({setFilters}: PatientsTabProps) {
    const navigate = useNavigate();
    const {
        items,
        totalPages,
        page,
        isLoading,
    } = usePatientContext();

    return (
        <VisitTab
            title="Patients"
            icon={UserRound}
            columns={patientColumns}
            items={items}
            toRow={toPatientDashboardRecord}
            isLoading={isLoading}
            totalPages={totalPages}
            page={page}
            createAction={{
                title: "New Patient Record",
                route: ROUTES.staff.patient.createNewRecord,
            }}
            headerActions={
    <AccountRequestButton
        showLabel
        label="Pre-registered Accounts"
        onClick={() => navigate(ROUTES.staff.dashboard.registrations)}
    />
}
            buildViewLink={(row: patientData) =>
                `${ROUTES.staff.patient.patientRecordTab}/${row.patient_id}`
            }
            setFilters={setFilters}
        />
    );
}