import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {useQuery} from "@tanstack/react-query";
import {getAllPatientProfiles, getPatientSummaryRecord, updatePatientProfile} from "/@/api/patient.api";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {PatientProfile, UpdatePatientProfile} from "/@/api/schema/PatientSchema";
import {useDebounce} from "/@/hooks/Debouncer";
import {createListQueryHook, createUpdateMutationHook} from "/@/hooks/query/visitQuery";

/**
 * Handles patient server state.
 *
 * React Query is responsible for:
 * - fetching
 * - caching
 * - stale state
 * - garbage collection
 * - refetching
 */
export const usePatientQuery = createListQueryHook<PatientFilters, PaginatedData<PatientProfile>>(
    "patients",
    getAllPatientProfiles,
    "Patient data is missing",
);

export function usePatientDebouncedQuery(filters?: PatientFilters) {
    return usePatientQuery(useDebounce(filters, 500));
}

export function usePatientRecordSummaryQuery(patientId: string) {
    return useQuery({
        queryKey: ["summaryRecord", patientId],

        queryFn: async ({ signal }) => {
            const { data } = await getPatientSummaryRecord(
                patientId,
                signal
            );

            if (!data.data) {
                throw new Error("Patient data is missing");
            }

            return data;
        },

        enabled: Boolean(patientId),
        refetchOnWindowFocus: false,
    });
}

interface UpdatePatientProfileArgs {
    patientId: string;
    payload: UpdatePatientProfile;
}

export const useUpdatePatientProfile = createUpdateMutationHook<UpdatePatientProfileArgs, unknown>(
    (args) => updatePatientProfile(args.patientId, args.payload)
);
