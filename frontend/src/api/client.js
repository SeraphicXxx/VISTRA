const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export const apiClient = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json();

    return {
        response,
        data,
    };
};