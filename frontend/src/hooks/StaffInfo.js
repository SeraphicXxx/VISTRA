import {useEffect, useState} from "react";
import {getStaffById} from "../api/staff.api.js";

export function useStaffInfo(staffId) {
    const [staffData, setStaffData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        void (async () => {
            try {
                setIsLoading(true);
                const data = await getStaffById(staffId);
                setStaffData(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load staff"
                );
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