import { logout as logoutRequest } from "/@/api/auth.api";
import { sessionManager } from "/@/utils/SessionManager";

/**
 * Best-effort server logout, then always clear the local session.
 * Server failure (unreachable backend, already-dead session) never
 * blocks sign-out here: local clear still ends it on this device.
 */
export async function logoutSession(): Promise<void> {
    try {
        await logoutRequest();
    } catch {
        // Session already dead server-side or backend unreachable.
    } finally {
        sessionManager.logout();
    }
}
