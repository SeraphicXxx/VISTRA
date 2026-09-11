import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {useQuery} from "@tanstack/react-query";
import {getAllPatientProfiles} from "/@/api/patient.api";

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
export function usePatientQuery(filters?: PatientFilters) {
    return useQuery({
        queryKey: ["patients", filters],

        queryFn: async ({signal}) => {
            const {data} = await getAllPatientProfiles(
                filters,
                signal
            );

            return data.data;
        },

        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,

        refetchOnWindowFocus: false,
    });
}