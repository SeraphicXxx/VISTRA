import { SlidersHorizontal } from "lucide-react";
import React, { useMemo, useState } from "react";
import { FilterDropdown } from "./filterDropdown";
import type { Column, ResolvedColumn, TableRecord } from "/@/types/table";

const LABEL_TO_FIELD: Record<string, string> = {
  student: "student",
  name: "name",
  course: "course",
  department: "department",
  time: "time",
  type: "type",
  status: "status",
  userid: "userId",
  usertype: "userType",
  yearsection: "yearSection",
  lastvisit: "lastVisit",
};

const FIELD_TO_LABEL: Record<string, string> = {
  student: "STUDENT",
  name: "NAME",
  course: "COURSE",
  department: "DEPARTMENT",
  time: "TIME",
  type: "TYPE",
  status: "STATUS",
  userId: "USER ID",
  userType: "USER TYPE",
  yearSection: "YEAR SECTION",
  lastVisit: "LAST VISIT",
};

const FILTERABLE_FIELDS = new Set([
  "course",
  "department",
  "type",
  "status",
  "userType",
  "yearSection",
  "time",
  "lastVisit",
]);

function toDisplayLabel(key: string): string {
  if (FIELD_TO_LABEL[key]) return FIELD_TO_LABEL[key];
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toUpperCase();
}

export function resolveColumn(col: Column): ResolvedColumn {
  if (typeof col === "object" && col !== null) {
    const key = col.key;
    return {
      key,
      label: col.label ? col.label.toUpperCase() : key ? toDisplayLabel(key) : "",
      filterable: col.filterable !== false && !!key && FILTERABLE_FIELDS.has(key),
    };
  }
  const normalized = col.toLowerCase().replace(/\s+/g, "");
  const key = LABEL_TO_FIELD[normalized];
  return {
    key,
    label: key ? toDisplayLabel(key) : col.toUpperCase(),
    filterable: !!key && FILTERABLE_FIELDS.has(key),
  };
}

export function getUniqueOptions(data: TableRecord[], key: string): string[] {
  return [
    ...new Set(
      data
        .map((row) => row[key])
        .filter((v): v is string | number => v !== undefined && v !== null && v !== ""),
    ),
  ]
    .map(String)
    .sort((a, b) => a.localeCompare(b));
}

export type TableFilters = Record<string, string | null>;

interface UseTableFiltersResult {
  filteredData: TableRecord[];
  filterableColumns: ResolvedColumn[];
  filters: TableFilters;
  handleFilterChange: (key: string, value: string | null) => void;
  clearFilters: () => void;
  activeCount: number;
}

export function useTableFilters(data: TableRecord[], columns: Column[]): UseTableFiltersResult {
  const resolvedColumns = useMemo(() => columns.map(resolveColumn), [columns]);
  const filterableColumns = useMemo(
    () => resolvedColumns.filter((c): c is ResolvedColumn & { key: string } => c.filterable && !!c.key),
    [resolvedColumns],
  );

  const [filters, setFilters] = useState<TableFilters>({});

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      filterableColumns.every((col) => {
        const selected = filters[col.key as string];
        return !selected || String(row[col.key as string]) === String(selected);
      }),
    );
  }, [data, filters, filterableColumns]);

  const handleFilterChange = (key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({});

  const activeCount = Object.values(filters).filter(Boolean).length;

  return { filteredData, filterableColumns, filters, handleFilterChange, clearFilters, activeCount };
}

interface FilterBarProps {
  data: TableRecord[];
  filterableColumns: ResolvedColumn[];
  filters: TableFilters;
  onChange: (key: string, value: string | null) => void;
  onClear: () => void;
  activeCount: number;
}

export function FilterBar({ data, filterableColumns, filters, onChange, onClear, activeCount }: FilterBarProps) {
  if (filterableColumns.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-4">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-textMuted">
        <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
        Filter
      </span>

      {filterableColumns.map((col) => (
        <FilterDropdown
          key={col.key}
          label={col.label}
          value={filters[col.key as string] || null}
          onChange={(v) => onChange(col.key as string, v)}
          options={getUniqueOptions(data, col.key as string)}
        />
      ))}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="ml-1 text-xs font-medium text-textMuted underline-offset-2 hover:text-primary hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}