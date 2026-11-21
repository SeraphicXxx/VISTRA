export type LoginMessageKey =
    | "invalid_credentials"
    | "account_pending"
    | "account_inactive"
    | "account_locked"
    | "terms_required"
    | "too_many_attempts"
    | "session_expired"
    | "invalid_request"
    | "server_error"
    | "network_error"
    | "unknown"
    | "missing_id"
    | "invalid_id"
    | "missing_password";

export type LoginMessageIcon =
    | "credentials"
    | "pending"
    | "disabled"
    | "locked"
    | "terms"
    | "limit"
    | "session"
    | "server"
    | "network"
    | "unknown";

export interface LoginMessage {
    title: string;
    description: string;
    tone: "danger" | "info";
    icon: LoginMessageIcon;
}

// Template catalog. Edit wording here only; the UI reads from this object.
export const LOGIN_MESSAGES: Record<LoginMessageKey, LoginMessage> = {
    invalid_credentials: {
        title: "Sign-in failed",
        description: "The ID number or password you entered is incorrect. Check both and try again.",
        tone: "danger",
        icon: "credentials",
    },
    account_pending: {
        title: "Account awaiting approval",
        description: "Your registration is still under review. We will email you once an admin approves your account.",
        tone: "info",
        icon: "pending",
    },
    account_inactive: {
        title: "Account is inactive",
        description: "This account has been deactivated. Contact the clinic to restore access.",
        tone: "danger",
        icon: "disabled",
    },
    account_locked: {
        title: "Account temporarily locked",
        description: "Too many failed attempts. Wait a few minutes before trying again, or contact the clinic.",
        tone: "danger",
        icon: "locked",
    },
    terms_required: {
        title: "Terms not accepted",
        description: "Please read and accept the terms to continue signing in.",
        tone: "info",
        icon: "terms",
    },
    too_many_attempts: {
        title: "Too many attempts",
        description: "You have tried to sign in too many times. Please wait a moment and try again.",
        tone: "danger",
        icon: "limit",
    },
    session_expired: {
        title: "Session expired",
        description: "Your session has ended. Please sign in again.",
        tone: "info",
        icon: "session",
    },
    invalid_request: {
        title: "Check your details",
        description: "Some information is missing or in the wrong format. Review the form and try again.",
        tone: "danger",
        icon: "credentials",
    },
    server_error: {
        title: "Something went wrong",
        description: "We could not sign you in right now. Please try again in a few minutes.",
        tone: "danger",
        icon: "server",
    },
    network_error: {
        title: "No connection",
        description: "We could not reach the server. Check your internet connection and try again.",
        tone: "danger",
        icon: "network",
    },
    unknown: {
        title: "Unable to sign in",
        description: "An unexpected error occurred. Please try again.",
        tone: "danger",
        icon: "unknown",
    },
    missing_id: {
        title: "ID number required",
        description: "Enter your Student, Faculty, or Staff number to continue.",
        tone: "danger",
        icon: "credentials",
    },
    invalid_id: {
        title: "Invalid ID number",
        description: "Use an 8-digit number followed by -S, -F, or -U.",
        tone: "danger",
        icon: "credentials",
    },
    missing_password: {
        title: "Password required",
        description: "Enter your password to continue.",
        tone: "danger",
        icon: "credentials",
    },
};

interface ErrorLike {
    status?: number;
    code?: string;
    message?: string;
    response?: {
        status?: number;
        data?: {code?: string; message?: string; detail?: string};
    };
}

// Maps any error thrown by the login request (or a plain string) to a template key.
export function resolveLoginError(error: unknown): LoginMessageKey {
    if (!error) return "unknown";

    let status: number | undefined;
    let text = "";

    if (typeof error === "string") {
        text = error;
    } else {
        const e = error as ErrorLike;
        status = e.response?.status ?? e.status;
        text = [
            e.response?.data?.code,
            e.code,
            e.response?.data?.message,
            e.response?.data?.detail,
            e.message,
        ]
            .filter(Boolean)
            .join(" ");
    }

    const haystack = text.toLowerCase();

    if (haystack.includes("pending")) return "account_pending";
    if (haystack.includes("locked")) return "account_locked";
    if (haystack.includes("inactive") || haystack.includes("disabled")) return "account_inactive";
    if (haystack.includes("terms")) return "terms_required";
    if (haystack.includes("expired")) return "session_expired";
    if (haystack.includes("network") || haystack.includes("failed to fetch")) return "network_error";
    if (haystack.includes("invalid_credentials") || haystack.includes("incorrect")) {
        return "invalid_credentials";
    }

    switch (status) {
        case 400:
        case 422:
            return "invalid_request";
        case 401:
        case 404:
            return "invalid_credentials";
        case 403:
            return "account_inactive";
        case 429:
            return "too_many_attempts";
        default:
            break;
    }

    if (status && status >= 500) return "server_error";

    return "unknown";
}