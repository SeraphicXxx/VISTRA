import React, {
    createContext,
    useContext,
    ReactNode,
    useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPatientProfiles } from "/@/api/patient.api";
import { PatientProfile } from "/@/api/schema/PatientSchema";
import {
    PatientModel,
    PatientDashboardRecord,
} from "/@/repository/PatientModel";

interface PatientContextType {
    patientProfiles: PatientProfile[];
    patientRecords: PatientDashboardRecord[];
    isLoading: boolean;
    error: string | null;
    refreshPatients: () => void;
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

    const {
        data: patientProfiles = [],
        isLoading,
        error,
        refetch,
    } = usePatients();

    const patientRecords = useMemo<PatientDashboardRecord[]>(
        () =>
            patientProfiles.map((patientProfile) => {
                const patientModel = new PatientModel(patientProfile);

                return patientModel.dataViewPatientDashboardRecord();
            }),
        [patientProfiles]
    );

    return (
        <PatientContext.Provider
            value={{
                patientProfiles,
                patientRecords,
                isLoading,
                error: error
                    ? "Failed to load patient profiles."
                    : null,
                refreshPatients: refetch,
            }}
        >
            {children}
        </PatientContext.Provider>
    );
}

export function usePatients() {
    return useQuery({
        queryKey: ["patients"],
        queryFn: getAllPatientProfiles,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function usePatientContext() {
    const context = useContext(PatientContext);

    if (!context) {
        throw new Error(
            "usePatientContext must be used within a PatientProvider"
        );
    }

    return context;
}