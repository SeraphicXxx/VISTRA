import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {MedicalVisitSchema} from "/@/api/schema/MedicalSchema";
import {useMedicalQuery} from "/@/hooks/query/MedicalQuery";
import {MedicalProvider} from "/@/context/PaginatedContext";
import MedicalTab from "/@/pages/admin/medical/medicalTab";
import {createVisitPage} from "/@/components/VisitPage";

export const MedicalPage = createVisitPage<MedicalVisitFilters, MedicalVisitSchema>({
    initialFilters: {
        page: 1,
        page_size: 10,
    },
    useListQuery: useMedicalQuery,
    Provider: MedicalProvider,
    Tab: MedicalTab,
});
