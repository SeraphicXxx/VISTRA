import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

export function PasswordField({
    id,
    name,
    label,
    placeholder,
    required = false,
    minLength,
}: {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
}) {
    const [visible, setVisible] = useState<boolean>(false);
    const Icon = visible ? EyeOff : Eye;

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-medium text-textSecondary">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={visible ? "text" : "password"}
                    placeholder={placeholder}
                    required={required}
                    minLength={minLength}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 pr-11 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-textMuted transition-colors hover:bg-background hover:text-textPrimary"
                >
                    <Icon className="h-4 w-4" strokeWidth={2}/>
                </button>
            </div>
        </div>
    );
}