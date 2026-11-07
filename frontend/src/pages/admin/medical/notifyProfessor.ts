export interface Professional {
    id: string;
    name: string;
    role: string;
    course: string;
    email: string;
}

export interface MedicalNotification {
    professional: Professional;
    subject: string;
    message: string;
    sentAt: string;
}

const EXTRA_PROFESSIONALS_KEY = "vistra_extra_professors";
const NOTIFICATION_HISTORY_KEY = "vistra_notification_history";

export function loadExtraProfessors(): Professional[] {
    try {
        const raw = localStorage.getItem(EXTRA_PROFESSIONALS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (item: unknown) =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                "name" in item &&
                "email" in item
        ) as Professional[];
    } catch {
        return [];
    }
}

export function saveExtraProfessors(professors: Professional[]): void {
    try {
        localStorage.setItem(EXTRA_PROFESSIONALS_KEY, JSON.stringify(professors));
    } catch {
        // ignore storage errors
    }
}

export function loadNotificationHistory(): MedicalNotification[] {
    try {
        const raw = localStorage.getItem(NOTIFICATION_HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed as MedicalNotification[];
    } catch {
        return [];
    }
}

export function saveNotification(notification: MedicalNotification): void {
    try {
        const history = loadNotificationHistory();
        history.unshift(notification);
        // Keep last 50 notifications
        const trimmed = history.slice(0, 50);
        localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(trimmed));
    } catch {
        // ignore storage errors
    }
}

export const NOTIFY_PROFESSIONALS: Professional[] = [];