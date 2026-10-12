import PatientsTab from "/@/pages/admin/patients/patientsTab";
import {PatientProvider} from "/@/context/PaginatedContext";
import {usePatientQuery} from "/@/hooks/query/PatientQuery";
import ViewStudentRecord from "/@/pages/admin/patients/ViewStudentRecord";
import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {PatientProfile} from "/@/api/schema/PatientSchema";
import {createVisitPage} from "/@/components/VisitPage";

export const PatientsPage = createVisitPage<PatientFilters, PatientProfile>({
    initialFilters: {
        page: 1,
        page_size: 10,
    },
    useListQuery: usePatientQuery,
    Provider: PatientProvider,
    Tab: PatientsTab,
});

export function ViewPatientRecord() {
    const patientQuery = usePatientQuery();

    return (
        <PatientProvider query={patientQuery}>
            <ViewStudentRecord/>
        </PatientProvider>
    )
}
