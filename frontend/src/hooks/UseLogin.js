import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { sessionManager } from "/@/utils/SessionManager.ts";
import { ROUTES } from "/@/config/RoutePaths.js";
import { loginStaff } from "/@/api/auth.api.ts";

export function useLogin() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: loginStaff,

        onSuccess: (data) => {
            sessionManager.setLogin(
                data.access_token,
                data.refresh_token,
                data.user
            );

            navigate(
                ROUTES.admin.dashboard.overview
            );
        },

        onError: (error) => {
            if (error.message === "Invalid email or password") {
                setError("Invalid staff ID or password.");
            } else {
                setError("Unable to connect to the server.");
            }
        },
    });

    const login = (credentials) => {
        if (!credentials.staffId.trim() || !credentials.password) {
            setError(
                "Enter your staff ID and password to continue."
            );
            return;
        }

        setError("");
        mutation.mutate(credentials);
    };

    return {
        login,
        isLoading: mutation.isPending,
        error,
    };
}

export function useLoginForm() {
    const [credentials, setCredentials] = useState({
        staffId: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return {
        credentials,
        handleChange,
    };
}