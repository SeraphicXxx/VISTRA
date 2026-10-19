import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { sessionManager, type SessionUser } from "/@/utils/SessionManager";
import { logoutSession } from "/@/hooks/UseLogout";

interface AuthContextValue {
    user: SessionUser | null;
    isAuthenticated: boolean;
    isStaff: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<SessionUser | null>(() =>
        sessionManager.getUser()
    );

    const sync = useCallback(() => {
        setUserState(sessionManager.getUser());
    }, []);

    useEffect(() => {
        const onAuthChanged = () => sync();
        const onStorage = (event: StorageEvent) => {
            if (
                event.key === null ||
                event.key === "access_token" ||
                event.key === "refresh_token" ||
                event.key === "user"
            ) {
                sync();
            }
        };

        window.addEventListener("vistra:auth-changed", onAuthChanged);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("vistra:auth-changed", onAuthChanged);
            window.removeEventListener("storage", onStorage);
        };
    }, [sync]);

    const logout = useCallback(async () => {
        await logoutSession();
        sync();
    }, [sync]);

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user || sessionManager.isAuthenticated(),
        isStaff: sessionManager.isStaff(),
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}