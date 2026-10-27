import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {PatientMedicalTabVisit} from "/@/api/schema/PatientMedicalTabSchema";
import {usePatientMedicalTabQuery} from "/@/hooks/query/PatientQuery";
import {PatientMedicalTabProvider} from "/@/context/PaginatedContext";
import PatientMedicalTab from "./medicalTab";
import {createVisitPage} from "/@/components/VisitPage";

export const PatientMedicalTabPage = createVisitPage<MedicalVisitFilters, PatientMedicalTabVisit>({
    initialFilters: {
        page: 1,
        page_size: 10,
    },
    useListQuery: usePatientMedicalTabQuery,
    Provider: PatientMedicalTabProvider,
    Tab: PatientMedicalTab,
});

export default PatientMedicalTabPage;
