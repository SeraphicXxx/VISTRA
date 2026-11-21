import {
    AlertCircle,
    Ban,
    Clock,
    KeyRound,
    Lock,
    RefreshCw,
    ServerCrash,
    ShieldAlert,
    WifiOff,
    type LucideIcon,
} from "lucide-react";
import {
    LOGIN_MESSAGES,
    resolveLoginError,
    type LoginMessageIcon,
    type LoginMessageKey,
} from "/@/components/login/loginMessages";

const ICONS: Record<LoginMessageIcon, LucideIcon> = {
    credentials: KeyRound,
    pending: Clock,
    disabled: Ban,
    locked: Lock,
    terms: ShieldAlert,
    limit: Clock,
    session: RefreshCw,
    server: ServerCrash,
    network: WifiOff,
    unknown: AlertCircle,
};

const TONES = {
    danger: {
        box: "border-danger/30 bg-danger/10",
        iconBox: "bg-danger/15 text-danger",
    },
    info: {
        box: "border-info/30 bg-info/10",
        iconBox: "bg-info/15 text-info",
    },
} as const;

interface LoginErrorNoticeProps {
    // Raw error from the login request. Ignored when messageKey is given.
    error?: unknown;
    // Use this for client-side validation messages, such as missing_id.
    messageKey?: LoginMessageKey;
    className?: string;
}

export default function LoginErrorNotice({error, messageKey, className = ""}: LoginErrorNoticeProps) {
    if (!messageKey && !error) return null;

    const key = messageKey ?? resolveLoginError(error);
    const message = LOGIN_MESSAGES[key];
    const Icon = ICONS[message.icon];
    const tone = TONES[message.tone];

    return (
        <div
            role="alert"
            className={`shake mb-5 flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left ${tone.box} ${className}`}
        >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tone.iconBox}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2.2}/>
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-textPrimary">{message.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-textSecondary">{message.description}</p>
            </div>
        </div>
    );
}