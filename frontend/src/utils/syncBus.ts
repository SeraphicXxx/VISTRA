export type SyncMessage =
    | { type: "auth-changed"; at: number }
    | { type: "data-changed"; at: number };

const CHANNEL_NAME = "vistra-sync";
const STORAGE_KEY = "vistra-sync";
const EVENT_NAME = "vistra:sync";

let channel: BroadcastChannel | null = null;
const handlers = new Set<(message: SyncMessage) => void>();

function ensureChannel(): void {
    if (channel) return;
    try {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (event: MessageEvent<SyncMessage>) => {
            handlers.forEach((handler) => handler(event.data));
        };
    } catch {
        channel = null;
    }
}

export function broadcast(message: SyncMessage): void {
    ensureChannel();

    // Same-tab delivery (BroadcastChannel does not echo to the sender).
    window.dispatchEvent(new CustomEvent<SyncMessage>(EVENT_NAME, { detail: message }));

    // Cross-tab delivery.
    try {
        channel?.postMessage(message);
    } catch {
        // BroadcastChannel unavailable; storage fallback below covers it.
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage may be unavailable (private mode); ignore.
    }
}

export function subscribe(handler: (message: SyncMessage) => void): () => void {
    ensureChannel();
    handlers.add(handler);

    const onCustom = (event: Event) => {
        const detail = (event as CustomEvent<SyncMessage>).detail;
        if (detail) handler(detail);
    };
    window.addEventListener(EVENT_NAME, onCustom);

    const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY || !event.newValue) return;
        try {
            handler(JSON.parse(event.newValue) as SyncMessage);
        } catch {
            // Ignore malformed payloads.
        }
    };
    window.addEventListener("storage", onStorage);

    return () => {
        handlers.delete(handler);
        window.removeEventListener(EVENT_NAME, onCustom);
        window.removeEventListener("storage", onStorage);
    };
}
