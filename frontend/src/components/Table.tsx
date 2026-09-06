import { ChevronRight, FileX2 } from "lucide-react";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { StatusBadge } from "./statusbadge";
import { avatarColor, getInitials, getTypeIcon } from "./avatar";
import { filterByQuery } from "../utils/FilterByQuery";
import PanelHeader from "./PanelHeader";
import { LinkButton } from "./Button";
import { FilterBar, resolveColumn, useTableFilters } from "/@/components/filterTableBar";
import type { Column, TableRecord } from "/@/types/table";

interface OutletContext {
  searchQuery: string;
}

interface RecordsTablePanelProps {
  name: string;
  data: TableRecord[];
  columns: Column[];
  createRecordPath?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showCreate?: boolean;
  createDisabled?: boolean;
  renderRow?: (data: TableRecord) => React.ReactNode;
  showRecordsSuffix?: boolean;
  showRecordCount?: boolean;
  showFilter?: boolean;
  maxRecords?: number;
}

export const RecordsTablePanel = ({
  name,
  data,
  columns,
  createRecordPath,
  icon: Icon,
  showCreate = true,
  createDisabled = false,
  renderRow = (data) => <GenericRow data={data} />,
  showRecordsSuffix = true,
  showRecordCount = true,
  showFilter = true,
  maxRecords,
}: RecordsTablePanelProps) => {
  const { searchQuery } = useOutletContext<OutletContext>();

  const filteredData = filterByQuery(data, searchQuery, columns) ?? [];
  const displayData = maxRecords ? filteredData.slice(0, maxRecords) : filteredData;

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-card">
      <div className="p-6 overflow-x-auto">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <PanelHeader
              title={showRecordsSuffix ? `${name} Records` : name}
              icon={Icon}
              action={
                showCreate ? (
                  <LinkButton
                    title={`New ${name} Record`}
                    route={createRecordPath}
                    disabled={createDisabled}
                  />
                ) : null
              }
            />

            {showRecordCount && (
              <p className="mt-5 text-xs text-textMuted">
                {filteredData.length}{" "}
                {filteredData.length === 1 ? "record" : "records"}
                {searchQuery ? ` matching "${searchQuery}"` : " on file"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="overflow-x-auto max-h-96">
            <GenericTable data={displayData} columns={columns} renderRow={renderRow} showFilter={showFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface GenericTableProps {
  data: TableRecord[];
  columns: Column[];
  renderRow: (data: TableRecord) => React.ReactNode;
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  showFilter?: boolean;
  maxRecords?: number;
}

export const GenericTable = ({
  data = [],
  columns,
  renderRow,
  title,
  icon: Icon,
  action,
  showFilter = true,
  maxRecords,
}: GenericTableProps) => {
  const { filteredData, filterableColumns, filters, handleFilterChange, clearFilters, activeCount } =
    useTableFilters(data, columns);

  const displayData = maxRecords ? filteredData.slice(0, maxRecords) : filteredData;

  return (
    <div>
      {title && <PanelHeader title={title} icon={Icon} action={action} />}

      {showFilter && (
        <FilterBar
          data={data}
          filterableColumns={filterableColumns}
          filters={filters}
          onChange={handleFilterChange}
          onClear={clearFilters}
          activeCount={activeCount}
        />
      )}

      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <GenericTableHeader columns={columns} />

        <GenericTableBody
          data={displayData}
          colSpan={columns.length + 1}
          renderRow={renderRow}
          emptyState={
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-textMuted/10 text-textMuted">
                <FileX2 className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <p className="text-sm text-textMuted">No records match your search.</p>
            </div>
          }
        />
      </table>
    </div>
  );
};

interface GenericTableBodyProps {
  data: TableRecord[];
  colSpan: number;
  renderRow: (data: TableRecord) => React.ReactNode;
  emptyState: React.ReactNode;
}

export const GenericTableBody = ({ data, colSpan, renderRow, emptyState }: GenericTableBodyProps) => {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={colSpan}>{emptyState}</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((record) => (
        <React.Fragment key={record.id}>{renderRow(record)}</React.Fragment>
      ))}
    </tbody>
  );
};

const GenericTableHeader = ({ columns }: { columns: Column[] }) => {
  return (
    <thead>
      <tr className="text-left">
        {columns.map((col) => {
          const { key, label } = resolveColumn(col);
          return (
            <th
              key={key || label}
              className="border-b border-border pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-textMuted"
            >
              {label}
            </th>
          );
        })}

        <th className="border-b border-border pb-2" />
      </tr>
    </thead>
  );
};

interface RowProps {
  data: TableRecord;
  viewRecordPath?: string;
}

export function GenericRow({ data, viewRecordPath = "#" }: RowProps) {
  const navigate = useNavigate();
  const TypeIcon = getTypeIcon(data.type as string);

  return (
    <tr className="group transition-colors duration-150 hover:bg-primary/[0.03]">
      <td className="border-b border-border py-4 pr-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(
              data.student as string,
            )}`}
          >
            {getInitials(data.student as string)}
          </span>

          <span className="text-sm font-medium text-textPrimary">{data.student as string}</span>
        </div>
      </td>

      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{data.course as string}</td>

      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{data.time as string}</td>

      <td className="border-b border-border py-3 pr-4">
        <div className="flex items-center gap-1.5 text-sm text-textSecondary">
          <TypeIcon className="h-3.5 w-3.5 shrink-0 text-textMuted" strokeWidth={2} />
          {data.type as string}
        </div>
      </td>

      <td className="border-b border-border py-3 pr-4">
        <StatusBadge status={data.status as string} />
      </td>

      <td className="border-b border-border py-3 text-right">
        <button
          type="button"
          onClick={() => navigate(viewRecordPath)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary/10 hover:text-primaryDark"
        >
          View
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </td>
    </tr>
  );
}

export function PatientRow({ data, viewRecordPath = "#" }: RowProps) {
  const navigate = useNavigate();

  return (
    <tr className="group transition-colors duration-150 hover:bg-primary/[0.03]">
      <td className="border-b border-border py-4 pr-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(
              data.name as string,
            )}`}
          >
            {getInitials(data.name as string)}
          </span>

          <span className="text-sm font-medium text-textPrimary">{data.name as string}</span>
        </div>
      </td>

      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{data.userId as string}</td>
      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{data.userType as string}</td>
      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">
        {(data.course as string) || (data.department as string) || "—"}
      </td>
      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">
        {(data.yearSection as string) || "—"}
      </td>
      <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{data.lastVisit as string}</td>

      <td className="border-b border-border py-3 text-right">
        <button
          type="button"
          onClick={() => navigate(`${viewRecordPath}/${data.id}`)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary/10 hover:text-primaryDark"
        >
          View
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </td>
    </tr>
  );
}