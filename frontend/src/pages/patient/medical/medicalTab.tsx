import {ClipboardList} from "lucide-react";
import {StatusBadge} from "/@/components/StatusBadge";
import {VisitTab} from "/@/components/VisitTab";
import {Column} from "/@/components/table/Table";
import {ROUTES} from "/@/config/RoutePaths";
import {usePatientMedicalTabContext} from "/@/context/PaginatedContext";
import {PatientMedicalTabVisit} from "/@/api/schema/PatientMedicalTabSchema";
import {toPatientMedicalTableRow} from "/@/repository/PatientMedicalModel";
import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {Visit} from "./medicalData";

const columns: Column<Visit>[] = [
    {key: "date", label: "Date", filterType: "date"},
    {key: "id", label: "Visit ID"},
    {key: "complaint", label: "Remarks"},
    {key: "doctor", label: "Doctor"},
    {key: "status", label: "Status", render: (value) => <StatusBadge status={value}/>},
];

const buildViewLink = (visit: Visit) => ROUTES.patient.medical.view.build(visit.id);

interface PatientMedicalTabProps {
    setFilters: (filters: MedicalVisitFilters) => void;
}

export default function PatientMedicalTab({setFilters}: PatientMedicalTabProps) {
    const {
        items,
        totalPages,
        page,
        isLoading,
    } = usePatientMedicalTabContext();

    return (
        <VisitTab<Visit, PatientMedicalTabVisit>
            title="My Medical Records"
            icon={ClipboardList}
            columns={columns}
            items={items}
            toRow={toPatientMedicalTableRow}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            buildViewLink={buildViewLink}
            setFilters={setFilters}
        />
    );
}
