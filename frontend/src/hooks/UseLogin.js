import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionManager } from "../utils/SessionManager";
import {ROUTES} from "../config/RoutePaths.js";

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

export function useLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (credentials) => {
        const { staffId, password } = credentials;

        if (!staffId.trim() || !password) {
            setError("Enter your staff ID and password to continue.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_LOCAL_API_URL}staff/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: staffId,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                setError(data.message || "Invalid staff ID or password.");
                return;
            }

            sessionManager.setLogin(
                data.access_token,
                data.user
            );

            navigate(ROUTES.admin.dashboard.overview);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server.");

        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
        setError,
    };
}