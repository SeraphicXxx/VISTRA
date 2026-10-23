import {Smile} from "lucide-react";
import {StatusBadge} from "/@/components/StatusBadge";
import {VisitTab} from "/@/components/VisitTab";
import {Column} from "/@/components/table/Table";
import {ROUTES} from "/@/config/RoutePaths";
import {usePatientDentalTabContext} from "/@/context/PaginatedContext";
import {PatientDentalTabVisit} from "/@/api/schema/PatientDentalTabSchema";
import {toPatientDentalTableRow} from "/@/repository/PatientDentalModel";
import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {DentalVisit} from "./dentalData";

const columns: Column<DentalVisit>[] = [
    {key: "date", label: "Date", filterType: "date"},
    {key: "id", label: "Visit ID"},
    {key: "complaint", label: "Remarks"},
    {key: "doctor", label: "Dentist"},
    {key: "status", label: "Status", render: (value) => <StatusBadge status={value}/>},
];

const buildViewLink = (visit: DentalVisit) =>
  ROUTES.patient.dental.view.build(visit.id);

interface PatientDentalTabProps {
    setFilters: (filters: DentalVisitFilters) => void;
}

export default function PatientDentalTab({setFilters}: PatientDentalTabProps) {
    const {
        items,
        totalPages,
        page,
        isLoading,
    } = usePatientDentalTabContext();

    return (
        <VisitTab<DentalVisit, PatientDentalTabVisit>
            title="My Dental Records"
            icon={Smile}
            columns={columns}
            items={items}
            toRow={toPatientDentalTableRow}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            buildViewLink={buildViewLink}
            setFilters={setFilters}
        />
    );
}
