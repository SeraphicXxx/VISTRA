import React, { ReactNode } from "react";

interface CardProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export default function Card({
                                 title,
                                 description,
                                 icon,
                                 children,
                                 footer,
                                 className = "",
                             }: CardProps) {
    return (
        <div
            className={`
                rounded-xl
                border border-gray-200
                bg-surface
                shadow-card
                overflow-hidden
                ${className}
            `}
        >
            {/* Header */}
            {(title || description || icon) && (
                <div className="flex items-start gap-3 border-b border-gray-200 p-5">
                    {icon && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            {icon}
                        </div>
                    )}

                    <div>
                        {title && (
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="mt-1 text-sm text-gray-500">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            {children && (
                <div className="p-5">
                    {children}
                </div>
            )}

            {/* Footer */}
            {footer && (
                <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
                    {footer}
                </div>
            )}
        </div>
    );
}