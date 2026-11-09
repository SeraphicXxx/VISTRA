import {PatientFilters, MedicalVisitFilters, DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {useQuery} from "@tanstack/react-query";
import {getAllPatientProfiles, getPatientSummaryRecord, updatePatientProfile, getPatientMedicalTab, getPatientDentalTab, getPatientMedicalDentalSummary, getPatientMedicalRecord, getPatientDentalRecord, getPatientMedicalHistory, getPatientFamilyHistory, getMyProfile, getLatestVitalSigns} from "/@/api/patient.api";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {PatientProfile, UpdatePatientProfile} from "/@/api/schema/PatientSchema";
import {PatientMedicalTabVisit} from "/@/api/schema/PatientMedicalTabSchema";
import {PatientDentalTabVisit} from "/@/api/schema/PatientDentalTabSchema";
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

export const usePatientMedicalTabQuery = createListQueryHook<
    MedicalVisitFilters,
    PaginatedData<PatientMedicalTabVisit>
>("patient-medical-tab", getPatientMedicalTab, "Patient medical tab data is missing");

export const usePatientDentalTabQuery = createListQueryHook<
    DentalVisitFilters,
    PaginatedData<PatientDentalTabVisit>
>("patient-dental-tab", getPatientDentalTab, "Patient dental tab data is missing");

export function usePatientMedicalDentalSummaryQuery() {
    return useQuery({
        queryKey: ["patient", "medical-dental-summary"],
        queryFn: async ({ signal }) => {
            const { data } = await getPatientMedicalDentalSummary(signal);

            if (!data.data) {
                throw new Error("Medical-dental summary data is missing");
            }

            return data.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function usePatientMedicalRecordQuery(medicalId: string) {
    return useQuery({
        queryKey: ["patient", "medical-record", medicalId],
        queryFn: async ({ signal }) => {
            const { data } = await getPatientMedicalRecord(medicalId, signal);

            if (!data.data) {
                throw new Error("Medical record data is missing");
            }

            return data.data;
        },
        enabled: Boolean(medicalId),
        refetchOnWindowFocus: false,
    });
}

export function usePatientDentalRecordQuery(dentalId: string) {
    return useQuery({
        queryKey: ["patient", "dental-record", dentalId],
        queryFn: async ({ signal }) => {
            const { data } = await getPatientDentalRecord(dentalId, signal);

            if (!data.data) {
                throw new Error("Dental record data is missing");
            }

            return data.data;
        },
        enabled: Boolean(dentalId),
        refetchOnWindowFocus: false,
    });
}

export function usePatientMedicalHistoryQuery() {
    return useQuery({
        queryKey: ["patient", "medical-history"],
        queryFn: async ({ signal }) => {
            const { data } = await getPatientMedicalHistory(signal);

            if (!data.data) {
                throw new Error("Medical history data is missing");
            }

            return data.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function usePatientFamilyHistoryQuery() {
    return useQuery({
        queryKey: ["patient", "family-history"],
        queryFn: async ({ signal }) => {
            const { data } = await getPatientFamilyHistory(signal);

            if (!data.data) {
                throw new Error("Family history data is missing");
            }

            return data.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function useMyProfileQuery() {
    return useQuery({
        queryKey: ["patient", "my-profile"],
        queryFn: async ({ signal }) => {
            const { data } = await getMyProfile(signal);

            if (!data.data) {
                throw new Error("Profile data is missing");
            }

            return data.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function usePatientLatestVitalSignsQuery(patientId: string) {
    return useQuery({
        queryKey: ["patient", "latest-vital-signs", patientId],
        queryFn: async ({ signal }) => {
            const { data } = await getLatestVitalSigns(patientId, signal);

            if (!data.data) {
                throw new Error("Vital signs data is missing");
            }

            return data.data;
        },
        enabled: Boolean(patientId),
        refetchOnWindowFocus: false,
    });
}
