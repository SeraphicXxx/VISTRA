import {
    createContext,
    useContext,
    useMemo,
    type ReactNode,
} from "react";

import type { PaginatedData } from "/@/api/schema/ApiResponseSchema";

interface PaginatedContextValue<T, F> {
    items: T[];

    filters?: F;

    total: number;
    page: number;
    pageSize: number;
    totalPages: number;

    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;

    refetch: () => void;
}

interface PaginatedProviderProps<T, F> {
    children: ReactNode;
    data?: PaginatedData<T>;
    filters?: F;
    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;
    refetch: () => void;
}

export function createPaginatedContext<T, F>() {

    const Context = createContext<
        PaginatedContextValue<T, F> | undefined
    >(undefined);

    function Provider({
                          children,
                          data,
                          filters,
                          isLoading,
                          isFetching,
                          error,
                          refetch,
                      }: PaginatedProviderProps<T, F>) {

        const value = useMemo(
            () => ({
                items: data?.items ?? [],

                filters,

                total: data?.total ?? 0,
                page: data?.page ?? 1,
                pageSize: data?.page_sizes ?? 10,
                totalPages: data?.total_pages ?? 0,

                isLoading,
                isFetching,
                error,

                refetch: () => {
                    void refetch();
                },
            }),
            [
                data,
                filters,
                isLoading,
                isFetching,
                error,
                refetch,
            ]
        );

        return (
            <Context.Provider value={value}>
                {children}
            </Context.Provider>
        );
    }

    function usePaginatedContext() {
        const context = useContext(Context);

        if (!context) {
            throw new Error(
                "usePaginatedContext must be used inside its Provider"
            );
        }

        return context;
    }

    return {
        Provider,
        usePaginatedContext,
    };
}