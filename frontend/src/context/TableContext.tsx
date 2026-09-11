import React, {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

type Filters<T> = Partial<Record<keyof T, string | null>>;

interface TableContextValue<T> {
    search: string;
    setSearch: (value: string) => void;

    filters: Filters<T>;
    setFilter: (key: keyof T, value: string | null) => void;
    clearFilters: () => void;

    run: () => void;
}

const TableContext =
    createContext<TableContextValue<any> | undefined>(undefined);

interface TableProviderProps<T> {
    children: React.ReactNode;
}

export function TableProvider<T>({
    children,
}: TableProviderProps<T>) {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Filters<T>>({});

    const setFilter = (
        key: keyof T,
        value: string | null,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({});
        setSearch("");
    };

    const run = () => {
        console.log("Search:", search);
        console.log("Filters:", filters);
    };

    const contextValue = useMemo<TableContextValue<T>>(
        () => ({
            search,
            setSearch,

            filters,
            setFilter,
            clearFilters,

            run,
        }),
        [search, filters],
    );

    return (
        <TableContext.Provider value={contextValue}>
            {children}
        </TableContext.Provider>
    );
}

export function useTableContext<T>(): TableContextValue<T> {
    const context = useContext(TableContext);

    if (!context) {
        throw new Error(
            "useTableContext must be used within a TableProvider",
        );
    }

    return context;
}