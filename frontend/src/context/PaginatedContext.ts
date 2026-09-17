import {createPaginatedContext} from "/@/context/CreatePaginatedContext";
import {PatientProfile} from "/@/api/schema/PatientSchema";
import {AppointmentSchema} from "/@/api/schema/AppointmentSchema";

export const {
    Provider: PatientProvider,
    usePaginatedContext: usePatientContext,
} = createPaginatedContext<PatientProfile>();

export const {
    Provider: AppointmentProvider,
    usePaginatedContext: useAppointmentContext,
} = createPaginatedContext<AppointmentSchema>()