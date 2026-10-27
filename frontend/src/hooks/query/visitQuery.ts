import {useMutation, useQuery} from "@tanstack/react-query";
import type {ApiResponse} from "/@/api/schema/ApiResponseSchema";

interface ClientResult<T> {
    response: unknown;
    data: T;
}

export function createListQueryHook<F, D>(
    queryKeyPrefix: string,
    fetchPage: (filters: F | undefined, signal?: AbortSignal) => Promise<ClientResult<ApiResponse<D>>>,
    missingMessage: string,
) {
    return function useVisitListQuery(filters?: F) {
        return useQuery({
            queryKey: [queryKeyPrefix, filters],
            queryFn: async ({signal}) => {
                const {data} = await fetchPage(filters, signal);

                if (!data.data) {
                    throw new Error(missingMessage);
                }

                return data.data;
            },
            refetchOnWindowFocus: false,
        });
    };
}

export function createMutationHook<C, R>(
    createFn: (payload: C, signal?: AbortSignal) => Promise<ClientResult<R>>,
) {
    return function useCreateVisit() {
        return useMutation({
            mutationFn: async (record: C) => {
                const {data} = await createFn(record);
                return data;
            },
        });
    };
}

export function createDetailQueryHook<D>(
    queryKeyPrefix: string,
    fetchById: (patientId: string, recordId: string, signal?: AbortSignal) => Promise<ClientResult<ApiResponse<D>>>,
    missingMessage: string,
) {
    return function useVisitDetailQuery(patientId?: string, recordId?: string) {
        return useQuery({
            queryKey: [`${queryKeyPrefix}-detail`, patientId, recordId],
            queryFn: async ({signal}): Promise<D | null> => {
                const {data} = await fetchById(
                    patientId as string,
                    recordId as string,
                    signal
                );

                if (!data.data) {
                    throw new Error(missingMessage);
                }

                return data.data;
            },
            enabled: Boolean(patientId && recordId),
            refetchOnWindowFocus: false,
        });
    };
}

export function createUpdateMutationHook<A, R>(
    updateFn: (args: A, signal?: AbortSignal) => Promise<ClientResult<R>>,
) {
    return function useUpdateVisit() {
        return useMutation({
            mutationFn: async (args: A) => {
                const {data} = await updateFn(args);
                return data;
            },
        });
    };
}
