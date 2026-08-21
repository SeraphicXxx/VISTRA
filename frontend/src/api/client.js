import {sessionManager} from "../utils/SessionManager.js";

const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export const apiClient = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(sessionManager.getAccessToken() && {
                Authorization: `Bearer ${sessionManager.getAccessToken()}`,
            }),
            ...options.headers,
        },
        ...options,
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    return {
        response,
        data,
    };
};