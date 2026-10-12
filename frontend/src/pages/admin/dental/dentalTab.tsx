import {Syringe} from "lucide-react";
import {DentalData, DentalColumns} from "./DentalData";
import {ROUTES} from "/@/config/RoutePaths.js";
import {useDentalContext} from "/@/context/PaginatedContext";
import {toDentalTableRow} from "/@/repository/DentalModel";
import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {VisitTab} from "/@/components/VisitTab";

interface DentalTabProps {
    setFilters: (filters: DentalVisitFilters) => void;
}

export default function DentalTab({setFilters}: DentalTabProps) {
    const {
        items,
        totalPages,
        page,
        isLoading,
    } = useDentalContext();

    return (
        <VisitTab
            title="Dental"
            icon={Syringe}
            columns={DentalColumns}
            items={items}
            toRow={toDentalTableRow}
            isLoading={isLoading}
            totalPages={totalPages}
            page={page}
            createAction={{
                title: "New Dental Record",
                route: ROUTES.staff.dental.createNewRecord,
            }}
            buildViewLink={(row: DentalData) =>
                ROUTES.staff.dental.view.build(row.studentId, row.id)
            }
            setFilters={setFilters}
        />
    );
}
