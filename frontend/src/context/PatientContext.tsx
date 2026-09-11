import React, {createContext, ReactNode, useContext, useMemo, useState,} from "react";
import {useMutation, useQueryClient,} from "@tanstack/react-query";

import {createPatientAccount,} from "/@/api/patient.api";

import {CreatePatientSchema, PatientProfile} from "/@/api/schema/PatientSchema";

import {PatientDashboardRecord, PatientModel,} from "/@/repository/PatientModel";

import {sessionManager} from "/@/utils/SessionManager";
import {usePatientQuery} from "/@/hooks/PatientQuery";
import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type SavePatientInput = Omit<CreatePatientSchema, "created_by">;

interface PatientContextType {
    // Filters
    filters: PatientFilters;
    setFilters: React.Dispatch<React.SetStateAction<PatientFilters>>;

    // Server data
    patientProfiles: PatientProfile[];

    // Application/domain data
    patientTableRecords: PatientDashboardRecord[];

    // Query state
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;

    // Mutation state
    isSaving: boolean;
    saveError: Error | null | unknown;

    // Actions
    refreshPatients: () => Promise<unknown>;
    savePatient: (record: SavePatientInput) => Promise<unknown>;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const PatientContext = createContext<PatientContextType | undefined>(
    undefined
);

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

interface PatientProviderProps {
    children: ReactNode;
}

export function PatientProvider({
                                    children,
                                }: PatientProviderProps) {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState<PatientFilters>({});

    const {
        data: patientProfiles = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = usePatientQuery(filters);


    const patientRecords = useMemo<PatientDashboardRecord[]>(
        () =>
            patientProfiles.map((patientProfile) => {
                const patientModel = new PatientModel(patientProfile);

                return patientModel.dataViewPatientDashboardRecord();
            }),
        [patientProfiles]
    );

    const savePatientMutation = useMutation({
        mutationFn: async (record: SavePatientInput) => {
            const user = sessionManager.getUser();
            if (!user){
                throw new Error("Not logged in");
            }
            const patientData = {
                ...record,
                created_by: user.staff_id,
            };

            return createPatientAccount(patientData);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["patients"],
            });
        },
    });

    const contextValue = useMemo<PatientContextType>(
        () => ({
            filters,
            setFilters,

            patientProfiles,
            patientTableRecords: patientRecords,

            isLoading,
            isRefreshing: isFetching && !isLoading,
            error: error
                ? "Failed to load patient profiles."
                : null,

            isSaving: savePatientMutation.isPending,
            saveError: savePatientMutation.error,

            refreshPatients: refetch,
            savePatient: savePatientMutation.mutateAsync,
        }),
        [
            filters,
            patientProfiles,
            patientRecords,
            isLoading,
            isFetching,
            error,
            savePatientMutation.isPending,
            savePatientMutation.error,
            refetch,
            savePatientMutation.mutateAsync,
        ]
    );

    return (
        <PatientContext.Provider value={contextValue}>
            {children}
        </PatientContext.Provider>
    );
}

/* -------------------------------------------------------------------------- */
/* Context Hook                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Provides access to patient-specific application functionality.
 *
 * Must be used inside PatientProvider.
 */
export function usePatientContext(): PatientContextType {
    const context = useContext(PatientContext);

    if (!context) {
        throw new Error(
            "usePatientContext must be used within a PatientProvider"
        );
    }

    return context;
}