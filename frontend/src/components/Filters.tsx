import React, {useEffect, useRef, useState} from "react";
import {ChevronDown, SlidersHorizontal} from "lucide-react";
import {Default} from "/@/components/table/Table";

interface DateFilterProps {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
}

export function DateFilter({
                               label,
                               value,
                               onChange,
                           }: DateFilterProps) {
    return (
        <div className="relative">
            <input
                type="date"
                value={value ?? ""}
                onChange={(e) =>
                    onChange(e.target.value || null)
                }
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-textSecondary outline-none transition-colors duration-150 focus:border-primary"
            />
        </div>
    );
}
interface FilterDropdownProps {
    label: string;
    options: string[];
    value: string | null;
    onChange: (value: string | null) => void;
}

export function FilterDropdown({
                                   label,
                                   options,
                                   value,
                                   onChange,
                               }: FilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-textSecondary transition-colors duration-150 ${
                    value
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-border bg-surface hover:border-primary/30 hover:text-textPrimary"
                }`}
            >
                <span>{label}</span>

                {value && (
                    <span
                        className="max-w-[110px] truncate rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                        {value}
                    </span>
                )}

                <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
                        open ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                />
            </button>

            {open && (
                <div
                    className="absolute left-0 z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            onChange(null);
                            setOpen(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-xs transition-colors duration-150 ${
                            !value
                                ? "font-semibold text-primary"
                                : "text-textSecondary"
                        } hover:bg-primary/5`}
                    >
                        All {label}
                    </button>

                    <div className="my-1 h-px bg-border"/>

                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`block w-full truncate px-3 py-1.5 text-left text-xs transition-colors duration-150 ${
                                value === opt
                                    ? "font-semibold text-primary"
                                    : "text-textSecondary"
                            } hover:bg-primary/5`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export interface FilterColumn<T> {
    key: keyof T;
    label: string;
    type?: "select" | "date";
}

type Filters<T> = Partial<Record<keyof T, string | null>>;

interface TableFiltersProps<T> {
    filterableColumns: FilterColumn<T>[];
    filterOptions: Partial<Record<keyof T, string[]>>;
}

export function TableFilters<T>({
                                    filterableColumns,
                                    filterOptions,
                                }: TableFiltersProps<T>) {
    const [filters, setFilters] = useState<Filters<T>>({});

    const handleChange = (
        key: keyof T,
        value: string | null,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 py-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-textMuted">
                <SlidersHorizontal
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                />

                Filter
            </span>
            {filterableColumns.map((column) => {
                if (column.type === "date") {
                    return (
                        <DateFilter
                            key={String(column.key)}
                            label={column.label}
                            value={filters[column.key] ?? null}
                            onChange={(value) =>
                                handleChange(column.key, value)
                            }
                        />
                    );
                }

                return (
                    <FilterDropdown
                        key={String(column.key)}
                        label={column.label}
                        value={filters[column.key] ?? null}
                        onChange={(value) =>
                            handleChange(column.key, value)
                        }
                        options={filterOptions[column.key] ?? []}
                    />
                );
            })}
        </div>
    );
}
