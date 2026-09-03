import React, {
    createContext,
    useContext,
    ReactNode,
    useMemo,
} from "react";
import {
    useMutation,
    useQuery,
    useQueryClient, } from "@tanstack/react-query";
import {createPatientAccount, getAllPatientProfiles} from "/@/api/patient.api";
import { PatientProfile } from "/@/api/schema/PatientSchema";
import {
    PatientModel,
    PatientDashboardRecord,
} from "/@/repository/PatientModel";
import {sessionManager} from "/@/utils/SessionManager";

interface PatientContextType {
    patientProfiles: PatientProfile[];
    patientRecords: PatientDashboardRecord[];

    isLoading: boolean;
    isRefreshing: boolean;
    isSaving: boolean;

    error: string | null;
    saveError: any;

    refreshPatients: () => void;
    savePatient: (record: any) => Promise<unknown>;
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
    const queryClient = useQueryClient();

    const {
        data: patientProfiles = [],
        isLoading,
        isFetching,
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
    const refreshPatients = async () => {
        await refetch();
    };
    const savePatientMutation = useMutation({
        mutationFn: async (record: any) => {
            const user = sessionManager.getUser();

            const patientData = {
                ...record,
                created_by: user?.staff_id,
            };

            return createPatientAccount(patientData);
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["patients"],
            });
        },
    });
    return (
        <PatientContext.Provider
            value={{
                patientProfiles,
                patientRecords,

                isLoading,
                isRefreshing: isFetching,
                isSaving: savePatientMutation.isPending,

                error: error
                    ? "Failed to load patient profiles."
                    : null,

                saveError: savePatientMutation.error,

                refreshPatients: refetch,

                savePatient: savePatientMutation.mutateAsync,
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