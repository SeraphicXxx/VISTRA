import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { broadcast, subscribe, type SyncMessage } from "/@/utils/syncBus";

/**
 * Cross-tab data freshness + presence sync.
 *
 * React Query caches are per-tab. This component:
 *  - broadcasts "data-changed" when a mutation succeeds in this tab;
 *  - invalidates all queries here when another tab broadcasts "data-changed".
 */
export default function CrossTabSync(): null {
    const queryClient = useQueryClient();

    useEffect(() => {
        const broadcasted = new Set<number>();

        const unsubscribe = subscribe((message: SyncMessage) => {
            if (message.type === "data-changed") {
                queryClient.invalidateQueries();
            }
        });

        const mutationUnsubscribe = queryClient.getMutationCache().subscribe((event) => {
            if (event.type !== "updated") return;
            const mutation = event.mutation;
            if (mutation.state.status !== "success") return;
            if (broadcasted.has(mutation.mutationId)) return;
            broadcasted.add(mutation.mutationId);

            broadcast({ type: "data-changed", at: Date.now() });
        });

        return () => {
            unsubscribe();
            mutationUnsubscribe();
        };
    }, [queryClient]);

    return null;
}
