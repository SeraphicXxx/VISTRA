import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getAllPatientProfiles, getPatientSummaryRecord, updatePatientProfile} from "/@/api/patient.api";
import {UpdatePatientProfile} from "/@/api/schema/PatientSchema";
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

        queryFn: async ({signal}) => fetchPatientProfiles(filters, signal),
        refetchOnWindowFocus: false,
    });
}

export function usePatientDebouncedQuery(filters?: PatientFilters) {
    const debouncedFilters = useDebounce(filters, 500);

    return useQuery({
        queryKey: ["patients", debouncedFilters],

        queryFn: async ({ signal }) => fetchPatientProfiles(debouncedFilters, signal),

        refetchOnWindowFocus: false,
    });
}

async function fetchPatientProfiles(filters?: PatientFilters, signal?: AbortSignal) {
    const {data} = await getAllPatientProfiles(
        filters,
        signal
    );

    if (!data.data) {
        throw new Error("Patient data is missing");
    }

    return data.data;
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

export function useUpdatePatientProfile() {
    return useMutation({
        mutationFn: async ({
            patientId,
            payload,
        }: {
            patientId: string;
            payload: UpdatePatientProfile;
        }) => {
            const {data} = await updatePatientProfile(patientId, payload);
            return data;
        },
    });
}
