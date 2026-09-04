import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { sessionManager } from "/@/utils/SessionManager.ts";
import { loginStaff } from "/@/api/auth.api.ts";

export function useLogin() {
    const mutation = useMutation({
        mutationFn: loginStaff,

        onSuccess: (data) => {
            console.log(data);
            sessionManager.setLogin(
                data.access_token,
                data.refresh_token,
                data.user
            );
        },
    });

    return {
        login: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error?.message ?? null,
    };
}



export function useLoginForm() {
    const [credentials, setCredentials] = useState({
        staffId: "",
        password: "",
    });
    const [validationErrors, setValidationErrors] = useState({
        staffId: "",
        password: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;

        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear the field's error when the user starts correcting it
        setValidationErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }))
    };
    const validate = () => {
        const newErrors = {};

        if (!credentials.staffId.trim()) {
            newErrors.staffId = "Staff ID is required.";
        }

        if (!credentials.password) {
            newErrors.password = "Password is required.";
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    return {
        credentials,
        validationErrors,
        handleChange,
        validate
    };
}