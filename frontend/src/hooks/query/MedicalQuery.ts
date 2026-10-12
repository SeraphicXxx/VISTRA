import {createMedicalVisit, getMedicalRecordById, getMedicalVisit} from "/@/api/medical.api";
import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {CreateMedicalVisit, MedicalRecordDetailSchema, MedicalVisitSchema} from "/@/api/schema/MedicalSchema";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {useQuery} from "@tanstack/react-query";
import {createListQueryHook, createMutationHook} from "/@/hooks/query/visitQuery";
import {CreateMedicalVisitResponse} from "/@/api/schema/MedicalSchema";

export const useCreateMedicalVisit = createMutationHook<CreateMedicalVisit, CreateMedicalVisitResponse>(createMedicalVisit);

export const useMedicalQuery = createListQueryHook<MedicalVisitFilters, PaginatedData<MedicalVisitSchema>>(
    "medical",
    getMedicalVisit,
    "Medical data is missing",
);

export function useMedicalVisitDetail(patientId?: string, medicalId?: string) {
    return useQuery({
        queryKey: ["medical", patientId, medicalId],
        queryFn: async ({signal}): Promise<MedicalRecordDetailSchema | null> => {
            const {data} = await getMedicalRecordById(
                patientId as string,
                medicalId as string,
                signal
            );

            return data.data ?? null;
        },
        enabled: Boolean(patientId && medicalId),
        refetchOnWindowFocus: false,
    });
}
