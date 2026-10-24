export function getHonorific(position: any) {
    return position?.toLowerCase().includes("doctor") ? "Dr." : "";
}

export function getGreeting(date = new Date()) {
    const hour = date.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export function formatDisplayDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(date);
}

export function extractStaffCode(email: any) {
    if (!email || typeof email !== "string") {
        return "";
    }

    return email.split("@")[0].toUpperCase();
}

export function getClinicOperationState(date = new Date()) {
    const day = date.getDay();

    if (day === 0) {
        return "closed";
    }

    const currentTime = date.getHours() * 60 + date.getMinutes();

    const openingTime = 7 * 60;
    const closingTime = 17 * 60;

    return currentTime >= openingTime && currentTime < closingTime
        ? "open"
        : "closed";
}

export interface FieldErrors {
    [key: string]: string;
}

export function getFieldErrors(error: unknown): FieldErrors {
    const errors: FieldErrors = {};

    if (!error) {
        return errors;
    }

    if (Array.isArray((error as any).detail)) {
        (error as any).detail.forEach((item: any) => {
            const field = item.loc?.[item.loc.length - 1];

            if (field) {
                errors[field] = item.msg;
            } else {
                errors.general = item.msg;
            }
        });

        return errors;
    }

    if (typeof (error as any).detail === "string") {
        errors.general = (error as any).detail;
        return errors;
    }

    if (error instanceof Error) {
        errors.general = error.message;
        return errors;
    }

    return errors;
}

export function getFieldErrorString(error: unknown): string {
    return Object.values(getFieldErrors(error)).join(", ");
}

export function removeEmptyValues<T extends Record<string, unknown>>(
    obj: T
): T {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    ) as T;
}