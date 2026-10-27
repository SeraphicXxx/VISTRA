import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {DentalVisitSchema} from "/@/api/schema/DentalSchema";
import {useDentalQuery} from "/@/hooks/query/DentalQuery";
import {DentalProvider} from "/@/context/PaginatedContext";
import DentalTab from "/@/pages/admin/dental/dentalTab";
import {createVisitPage} from "/@/components/VisitPage";

export const DentalPage = createVisitPage<DentalVisitFilters, DentalVisitSchema>({
    initialFilters: {
        page: 1,
        page_size: 10,
    },
    useListQuery: useDentalQuery,
    Provider: DentalProvider,
    Tab: DentalTab,
});
