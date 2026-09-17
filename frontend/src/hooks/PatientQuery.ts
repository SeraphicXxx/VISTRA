import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {useQuery} from "@tanstack/react-query";
import {getAllPatientProfiles} from "/@/api/patient.api";
import {useDebounce} from "/@/hooks/Debouncer";

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
        refetchOnWindowFocus: false,
    });
}

export function usePatientDebouncedQuery(filters?: PatientFilters) {
    const debouncedFilters = useDebounce(filters, 500);

    return useQuery({
        queryKey: ["patients", debouncedFilters],

        queryFn: async ({ signal }) => {
            const { data } = await getAllPatientProfiles(
                debouncedFilters,
                signal
            );

            return data.data;
        },

        refetchOnWindowFocus: false,
    });
}