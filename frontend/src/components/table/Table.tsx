import type { ReactNode } from "react";

import { avatarColor, getInitials } from "/@/components/avatar";

export interface ColumnFilterOption {
    value: string;
    label: string;
}

export function optionsFromValues(values: string[]): ColumnFilterOption[] {
    return values.map((value) => ({ value, label: value }));
}

export function optionsFromMap<T extends Record<string, string>>(
    map: T
): ColumnFilterOption[] {
    return Object.entries(map).map(([value, label]) => ({
        value,
        label,
    }));
}

export const courseFilterOptions: ColumnFilterOption[] = optionsFromValues([
    "BS Computer Science",
    "BS Business Administration",
    "BS Psychology",
    "BS Nursing",
    "BS Information Technology",
    "BS Education",
    "BS Accountancy",
]);

export function StudentCell({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(name)}`}
            >
                {getInitials(name)}
            </span>

            <span className="text-sm font-medium text-textPrimary">
                {name}
            </span>
        </div>
    );
}

export type ColumnType = "select" | "date";

export interface Column<T, K extends keyof T = keyof T> {
    key: K;
    label: string;
    render?: (value: T[K], record: T) => ReactNode;
    filterType?: ColumnType;
    options?: ColumnFilterOption[];
    filterKey?: string;
}

const CELL_PAD = "px-3 sm:px-4";
const HEAD_TEXT =
    "whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-textMuted sm:text-xs";
const BODY_TEXT = "text-sm text-slate-600";

interface GenericTableProps {
    children: ReactNode;
    className?: string;
}

export function GenericTable({ children, className = "" }: GenericTableProps) {
    return (
        <table
            className={`w-full min-w-[640px] table-auto border-separate border-spacing-0 text-left ${className}`}
        >
            {children}
        </table>
    );
}

export const GenericTableHeader = <T,>({
    columns,
    hasAction = false,
}: {
    columns: Column<T>[];
    hasAction?: boolean;
}) => {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <th
                        key={String(column.key)}
                        scope="col"
                        className={`sticky top-0 z-10 border-b border-border bg-surface py-3 text-left ${CELL_PAD} ${HEAD_TEXT}`}
                    >
                        {column.label}
                    </th>
                ))}

                {hasAction && (
                    <th
                        scope="col"
                        className={`sticky top-0 z-10 w-px border-b border-border bg-surface py-3 text-center ${CELL_PAD} ${HEAD_TEXT}`}
                    >
                        Action
                    </th>
                )}
            </tr>
        </thead>
    );
};

export const GenericTableBody = <T extends { id: string }>({
    data,
    columns,
    isLoading,
    renderAction,
}: {
    data: T[];
    columns: Column<T>[];
    isLoading: boolean;
    renderAction?: (record: T) => ReactNode;
}) => {
    const colSpan = columns.length + (renderAction ? 1 : 0);

    if (isLoading && data.length === 0) {
        return (
            <tbody aria-label="Loading">
                {Array.from({ length: 5 }).map((_, row) => (
                    <tr key={row} className="animate-pulse">
                        {Array.from({ length: colSpan }).map((_, col) => (
                            <td
                                key={col}
                                className={`border-b border-border py-4 ${CELL_PAD}`}
                            >
                                <div className="h-4 w-full max-w-[140px] rounded bg-border" />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    }

    return (
        <tbody>
            {data.length === 0 ? (
                <tr>
                    <td
                        colSpan={colSpan}
                        className={`h-[200px] py-10 text-center text-sm text-textMuted ${CELL_PAD}`}
                    >
                        No records found.
                    </td>
                </tr>
            ) : (
                data.map((record) => (
                    <GenericRow key={record.id}>
                        {columns.map((column) => (
                            <td
                                key={String(column.key)}
                                className={`max-w-[280px] border-b border-border py-3 align-middle sm:py-4 ${CELL_PAD} ${BODY_TEXT}`}
                            >
                                <div className="min-w-0 break-words">
                                    {column.render
                                        ? column.render(
                                              record[column.key],
                                              record
                                          )
                                        : formatCellValue(
                                              record[column.key]
                                          )}
                                </div>
                            </td>
                        ))}

                        {renderAction && (
                            <td
                                className={`w-px whitespace-nowrap border-b border-border py-3 text-center align-middle sm:py-4 ${CELL_PAD}`}
                            >
                                <div className="flex justify-center">
                                    {renderAction(record)}
                                </div>
                            </td>
                        )}
                    </GenericRow>
                ))
            )}

            {isLoading && data.length > 0 && (
                <tr className="animate-pulse" aria-label="Loading more">
                    <td colSpan={colSpan} className="px-4 py-4">
                        <div className="mx-auto h-3 w-32 rounded bg-border" />
                    </td>
                </tr>
            )}
        </tbody>
    );
};

function formatCellValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return String(value);
}

function GenericRow({ children }: { children: ReactNode }) {
    return (
        <tr className="group transition-colors duration-150 hover:bg-primary/[0.03]">
            {children}
        </tr>
    );
}