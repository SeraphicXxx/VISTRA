import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {PatientDentalTabVisit} from "/@/api/schema/PatientDentalTabSchema";
import {usePatientDentalTabQuery} from "/@/hooks/query/PatientQuery";
import {PatientDentalTabProvider} from "/@/context/PaginatedContext";
import PatientDentalTab from "./dentalTab";
import {createVisitPage} from "/@/components/VisitPage";

export const PatientDentalTabPage = createVisitPage<DentalVisitFilters, PatientDentalTabVisit>({
    initialFilters: {
        page: 1,
        page_size: 10,
    },
    useListQuery: usePatientDentalTabQuery,
    Provider: PatientDentalTabProvider,
    Tab: PatientDentalTab,
});

export default PatientDentalTabPage;
