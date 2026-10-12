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
