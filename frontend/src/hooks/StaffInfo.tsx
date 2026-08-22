import { useEffect, useState } from "react";
import { getStaffById } from "../api/staff.api.ts";
import type { StaffModel } from "../models/staff.model.ts";
interface UseStaffInfoResult {
    staffData: StaffModel | null;
    isLoading: boolean;
    error: string;
}

export function useStaffInfo(staffId: string | null): UseStaffInfoResult {
    const [staffData, setStaffData] = useState<StaffModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!staffId) {
            setStaffData(null);
            setIsLoading(false);
            return;
        }

        void (async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await getStaffById(staffId);
                setStaffData(data);
            } catch (err: unknown) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load staff"
                );
                setStaffData(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [staffId]);

    return {
        staffData,
        isLoading,
        error,
    };
}