import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

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
    refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<
    PatientContextType | undefined
>(undefined);

interface PatientProviderProps {
    children: ReactNode;
}

export function PatientProvider({
                                    children,
                                }: PatientProviderProps) {
    const [patientProfiles, setPatientProfiles] =
        useState<PatientProfile[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const loadPatients = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getAllPatientProfiles();

            setPatientProfiles(data);
        } catch (error: unknown) {
            console.error(
                "Failed to load patient profiles:",
                error
            );

            setError("Failed to load patient profiles.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadPatients();
    }, []);

    const patientRecords: PatientDashboardRecord[] =
        patientProfiles.map((patientProfile) => {
            const patientModel = new PatientModel(patientProfile);

            return patientModel.dataViewPatientDashboardRecord();
        });

    return (
        <PatientContext.Provider
            value={{
        patientProfiles,
            patientRecords,
            isLoading,
            error,
            refreshPatients: loadPatients,
    }}
    >
        {children}
        </PatientContext.Provider>
    );
}

export function usePatients(): PatientContextType {
    const context = useContext(PatientContext);

    if (!context) {
        throw new Error(
            "usePatients must be used inside PatientProvider"
        );
    }

    return context;
}