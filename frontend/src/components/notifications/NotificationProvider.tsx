import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import {createPortal} from "react-dom";
import {AlertTriangle, CheckCircle2, Info, X, XCircle, type LucideIcon} from "lucide-react";

export type NotifyVariant = "success" | "error" | "warning" | "info";

export interface NotifyOptions {
    title?: string;
    /** Milliseconds before the toast closes. Use 0 to keep it open until dismissed. */
    duration?: number;
}

interface NotifyItem {
    id: number;
    variant: NotifyVariant;
    message: string;
    title?: string;
    duration: number;
}

export interface NotifyApi {
    show: (variant: NotifyVariant, message: string, options?: NotifyOptions) => void;
    success: (message: string, options?: NotifyOptions) => void;
    error: (message: string, options?: NotifyOptions) => void;
    warning: (message: string, options?: NotifyOptions) => void;
    info: (message: string, options?: NotifyOptions) => void;
}

const MAX_VISIBLE = 4;

const DEFAULT_DURATION: Record<NotifyVariant, number> = {
    success: 3500,
    info: 4000,
    warning: 5000,
    error: 6000,
};

const VARIANT_META: Record<
    NotifyVariant,
    {icon: LucideIcon; iconClass: string; bar: string; defaultTitle: string}
> = {
    success: {
        icon: CheckCircle2,
        iconClass: "text-emerald-600",
        bar: "bg-emerald-500",
        defaultTitle: "Success",
    },
    error: {
        icon: XCircle,
        iconClass: "text-red-600",
        bar: "bg-red-500",
        defaultTitle: "Something went wrong",
    },
    warning: {
        icon: AlertTriangle,
        iconClass: "text-amber-600",
        bar: "bg-amber-500",
        defaultTitle: "Please check",
    },
    info: {
        icon: Info,
        iconClass: "text-info",
        bar: "bg-info",
        defaultTitle: "Notice",
    },
};

const NotifyContext = createContext<NotifyApi | null>(null);

function NotificationItem({
    item,
    onDismiss,
}: {
    item: NotifyItem;
    onDismiss: (id: number) => void;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const meta = VARIANT_META[item.variant];
    const Icon = meta.icon;
    const isUrgent = item.variant === "error" || item.variant === "warning";

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));

        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (item.duration <= 0) return;

        const timer = window.setTimeout(() => onDismiss(item.id), item.duration);

        return () => window.clearTimeout(timer);
    }, [item.id, item.duration, onDismiss]);

    return (
        <div
            role={isUrgent ? "alert" : "status"}
            className={`pointer-events-auto relative w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-all duration-300 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
        >
            <span className={`absolute inset-y-0 left-0 w-1 ${meta.bar}`} aria-hidden="true" />

            <div className="flex items-start gap-3 py-3.5 pl-5 pr-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${meta.iconClass}`} strokeWidth={2} />

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-textPrimary">
                        {item.title ?? meta.defaultTitle}
                    </p>
                    <p className="mt-0.5 text-sm text-textSecondary">{item.message}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onDismiss(item.id)}
                    aria-label="Dismiss notification"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-textMuted transition-colors hover:bg-background hover:text-textPrimary"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function NotificationStack({
    items,
    onDismiss,
}: {
    items: NotifyItem[];
    onDismiss: (id: number) => void;
}) {
    if (typeof document === "undefined" || items.length === 0) return null;

    return createPortal(
        <div
            aria-live="polite"
            className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
        >
            {items.map((item) => (
                <NotificationItem key={item.id} item={item} onDismiss={onDismiss} />
            ))}
        </div>,
        document.body
    );
}

export function NotificationProvider({children}: {children: ReactNode}) {
    const [items, setItems] = useState<NotifyItem[]>([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const show = useCallback(
        (variant: NotifyVariant, message: string, options: NotifyOptions = {}) => {
            nextId.current += 1;

            const item: NotifyItem = {
                id: nextId.current,
                variant,
                message,
                title: options.title,
                duration: options.duration ?? DEFAULT_DURATION[variant],
            };

            setItems((prev) => [...prev, item].slice(-MAX_VISIBLE));
        },
        []
    );

    const api = useMemo<NotifyApi>(
        () => ({
            show,
            success: (message, options) => show("success", message, options),
            error: (message, options) => show("error", message, options),
            warning: (message, options) => show("warning", message, options),
            info: (message, options) => show("info", message, options),
        }),
        [show]
    );

    return (
        <NotifyContext.Provider value={api}>
            {children}
            <NotificationStack items={items} onDismiss={dismiss} />
        </NotifyContext.Provider>
    );
}

export function useNotify(): NotifyApi {
    const context = useContext(NotifyContext);

    if (!context) {
        throw new Error("useNotify must be used inside <NotificationProvider>.");
    }

    return context;
}