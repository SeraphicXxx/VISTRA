import {useState, type ComponentType, type ReactNode} from "react";
import type {UseQueryResult} from "@tanstack/react-query";
import type {PaginatedData} from "/@/api/schema/ApiResponseSchema";

interface VisitPageConfig<F, T> {
    initialFilters: F;
    useListQuery: (filters?: F) => UseQueryResult<PaginatedData<T>, Error>;
    Provider: ComponentType<{
        children: ReactNode;
        query: UseQueryResult<PaginatedData<T>, Error>;
    }>;
    Tab: ComponentType<{
        setFilters: (filters: F) => void;
    }>;
}

export function createVisitPage<F, T>({
    initialFilters,
    useListQuery,
    Provider,
    Tab,
}: VisitPageConfig<F, T>) {
    return function VisitPage() {
        const [filters, setFilters] = useState<F>(initialFilters);
        const query = useListQuery(filters);

        return (
            <Provider query={query}>
                <Tab setFilters={setFilters}/>
            </Provider>
        );
    };
}
