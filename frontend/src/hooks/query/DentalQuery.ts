import {CreateDentalVisit, DentalRecordDetailSchema, DentalVisitSchema, UpdateDentalVisit} from "/@/api/schema/DentalSchema";
import {createDentalVisit, getDentalRecordById, getDentalVisit, updateDentalVisit} from "/@/api/dental.api";

import {useMutation, useQuery} from "@tanstack/react-query";
import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {ApiMessageResponse} from "/@/api/schema/ApiResponseSchema";
import {createListQueryHook, createMutationHook} from "/@/hooks/query/visitQuery";

export const useCreateDentalVisit = createMutationHook<CreateDentalVisit, ApiMessageResponse>(createDentalVisit);

export const useDentalQuery = createListQueryHook<DentalVisitFilters, PaginatedData<DentalVisitSchema>>(
    "dental",
    getDentalVisit,
    "Dental data is missing",
);

export function useDentalVisitDetail(patientId?: string, dentalId?: string) {
    return useQuery({
        queryKey: ["dental", patientId, dentalId],
        queryFn: async ({signal}): Promise<DentalRecordDetailSchema | null> => {
            const {data} = await getDentalRecordById(
                patientId as string,
                dentalId as string,
                signal
            );

            return data.data ?? null;
        },
        enabled: Boolean(patientId && dentalId),
        refetchOnWindowFocus: false,
    });
}

export function useUpdateDentalVisit() {
    return useMutation({
        mutationFn: async ({
            patientId,
            dentalId,
            payload,
        }: {
            patientId: string;
            dentalId: string;
            payload: UpdateDentalVisit;
        }) => {
            const {data} = await updateDentalVisit(patientId, dentalId, payload);
            return data;
        },
    });
}
