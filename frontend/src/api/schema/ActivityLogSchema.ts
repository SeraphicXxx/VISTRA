export type ActivityAction =
    | "login"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "view"
    | "permission_change";

export type ActivityModule =
    | "Authentication"
    | "Medical Records"
    | "Dental Records"
    | "Appointments"
    | "Patient Records"
    | "Staff Management";

export interface ActivityLog {
    id: string;
    staff_id: string;
    staff_name: string;
    action: ActivityAction;
    module: ActivityModule;
    target: string;
    details: string;
    created_at: string;
}

export type ActivityTone = "primary" | "info" | "success" | "danger";

export const ACTION_META: Record<ActivityAction, { label: string; tone: ActivityTone }> = {
    login: {label: "Signed in", tone: "success"},
    logout: {label: "Signed out", tone: "info"},
    create: {label: "Created", tone: "primary"},
    update: {label: "Updated", tone: "primary"},
    delete: {label: "Deleted", tone: "danger"},
    view: {label: "Viewed", tone: "info"},
    permission_change: {label: "Permissions changed", tone: "danger"},
};