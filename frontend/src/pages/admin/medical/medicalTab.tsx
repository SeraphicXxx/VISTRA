import {Stethoscope} from "lucide-react";
import {medData, MedicalColumns} from "./medicalData";
import {ROUTES} from "/@/config/RoutePaths.js";
import {useMedicalContext} from "/@/context/PaginatedContext";
import {toMedicalTableRow} from "/@/repository/MedicalModel";
import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {VisitTab} from "/@/components/VisitTab";

interface MedicalTabProps {
    setFilters: (filters: MedicalVisitFilters) => void;
}

export default function MedicalTab({setFilters}: MedicalTabProps) {
    const {
        items,
        totalPages,
        page,
        isLoading,
    } = useMedicalContext();

    return (
        <VisitTab
            title="Medical Records"
            icon={Stethoscope}
            columns={MedicalColumns}
            items={items}
            toRow={toMedicalTableRow}
            isLoading={isLoading}
            totalPages={totalPages}
            page={page}
            createAction={{
                title: "New Medical Record",
                route: ROUTES.staff.medical.createNewRecord,
            }}
            buildViewLink={(record: medData) =>
                ROUTES.staff.medical.view.build(record.patient_id, record.id)
            }
            setFilters={setFilters}
        />
    );
}
