import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from "react";

import {PatientProfile} from "/@/api/schema/PatientSchema";
import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";

import {
    PatientDashboardRecord,
    PatientModel,
} from "/@/repository/PatientModel";

import {usePatientQuery} from "/@/hooks/PatientQuery";

interface PatientContextType {
    filters: PatientFilters;
    setFilters: React.Dispatch<React.SetStateAction<PatientFilters>>;

    patientProfiles: PatientProfile[];

    patientTableRecords: PatientDashboardRecord[];

    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;

    refreshPatients: () => Promise<unknown>;
}

const PatientContext = createContext<PatientContextType | undefined>(
    undefined
);

interface PatientProviderProps {
    children: ReactNode;
}

export function PatientProvider({
                                    children,
                                }: PatientProviderProps) {
    const [filters, setFilters] = useState<PatientFilters>({});

    const {
        data: patientData,
        isLoading,
        isFetching,
        error,
        refetch,
    } = usePatientQuery(filters);
    const patientProfiles = patientData?.items ?? [];

    const patientRecords = useMemo<PatientDashboardRecord[]>(
        () =>
            patientProfiles.map((patientProfile: PatientProfile) => {
                const patientModel = new PatientModel(patientProfile);

                return patientModel.dataViewPatientDashboardRecord();
            }),
        [patientProfiles]
    );

    const contextValue = useMemo<PatientContextType>(
        () => ({
            filters,
            setFilters,

            patientProfiles,
            patientTableRecords: patientRecords,

            isLoading,
            isRefreshing: isFetching,
            error: error
                ? "Failed to load patient profiles."
                : null,

            refreshPatients: refetch,
        }),
        [
            filters,
            patientProfiles,
            patientRecords,
            isLoading,
            isFetching,
            error,
            refetch,
        ]
    );

    return (
        <PatientContext.Provider value={contextValue}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatientContext(): PatientContextType {
    const context = useContext(PatientContext);

    if (!context) {
        throw new Error(
            "usePatientContext must be used within a PatientProvider"
        );
    }

    return context;
}