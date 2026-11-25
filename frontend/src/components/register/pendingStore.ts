import {buildSummarySections} from "/@/components/register/RegistrationPreview";

export type PendingRecord = {
    id: string;
    submitted_at: string;
    details: Record<string, unknown>;
    medical_history: Record<string, unknown>;
};

const KEY = "pending-requests-v1";

export function getPending(): PendingRecord[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as PendingRecord[]) : [];
    } catch {
        return [];
    }
}

function save(records: PendingRecord[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(records));
    } catch {
        // Storage full or blocked.
    }
}

export function addPending(details: Record<string, unknown>, medical: Record<string, unknown>) {
    const record: PendingRecord = {
        id: crypto.randomUUID(),
        submitted_at: new Date().toISOString(),
        details,
        medical_history: medical,
    };
    save([record, ...getPending()]);
}

export function removePending(id: string) {
    save(getPending().filter((r) => r.id !== id));
}

export function getSections(record: PendingRecord) {
    return buildSummarySections(record.details, record.medical_history);
}