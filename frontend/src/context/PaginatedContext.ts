import {createPaginatedContext} from "/@/context/CreatePaginatedContext";
import {PatientProfile} from "/@/api/schema/PatientSchema";

export const {
    Provider: PatientProvider,
    usePaginatedContext: usePatientContext,
} = createPaginatedContext<PatientProfile>();