import React from "react";

interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

export function FormInput({
    label,
    error,
    id,
    icon,
    className,
    ...props
}: FormInputProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-textMuted"
            >
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted">
                        {icon}
                    </div>
                )}

                <input
                    id={id}
                    {...props}
                    className={`w-full rounded-xl border bg-background py-3 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:outline-none focus:ring-2 ${
    icon ? "pl-10 pr-3.5" : "px-3.5"
} ${
    error
        ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
        : "border-border focus:border-primary/50 focus:ring-primary/20"
} ${className ?? ""}`}
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}
