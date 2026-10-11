import React from "react";
import { Pagination } from "@mui/material";
import { TableFilters } from "/@/components/Filters";
import {
  Column,
  GenericTable,
  GenericTableBody,
  GenericTableHeader,
} from "/@/components/table/Table";
import {
  Filters,
  TableProvider,
  useTableContext,
} from "/@/context/TableContext";

interface TablePresetProps<T> {
  title: string;
  subtitle?: string;
  panelAddon?: React.ReactNode;
  data: T[];
  isLoading: boolean;
  columns: Column<T>[];
  renderAction?: (row: T) => React.ReactNode;
  onRun?: (
    search: string,
    filters: Filters<T>,
    page: number,
    pageSize: number,
  ) => void;
  totalPages?: number;
  page?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  fillHeight?: boolean;
}

export function DefaultTablePreset<T extends { id: string }>({
  title,
  subtitle = "Keep information organized and up to date.",
  panelAddon,
  data,
  isLoading,
  columns,
  renderAction,
  onRun,
  totalPages,
  page,
  showFilters = true,
  showPagination = true,
}: TablePresetProps<T>) {
  return (
    <TableProvider<T> onRun={onRun}>
      <DefaultTableContent
        totalPages={totalPages}
        page={page}
        title={title}
        subtitle={subtitle}
        isLoading={isLoading}
        panelAddon={panelAddon}
        data={data}
        columns={columns}
        renderAction={renderAction}
        showFilters={showFilters}
        showPagination={showPagination}
      />
    </TableProvider>
  );
}

function DefaultTableContent<T extends { id: string }>({
  title,
  subtitle,
  panelAddon,
  data,
  isLoading,
  columns,
  renderAction,
  page,
  totalPages,
  showFilters = true,
  showPagination = true,
}: Omit<TablePresetProps<T>, "onRun" | "fillHeight">) {
  const { goToPage } = useTableContext<T>();

  const currentPage = page ?? 1;
  const pageCount = Math.max(totalPages ?? 1, 1);
  const recordCount = data.length;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card">
      <div className="px-6 pb-4 pt-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-textPrimary">
                {title}
              </h2>
              <span className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-textSecondary">
                {recordCount}
              </span>
            </div>
            <p className="mt-1 text-sm text-textMuted">{subtitle}</p>
          </div>

          {panelAddon && (
            <div className="flex shrink-0 items-center gap-2">{panelAddon}</div>
          )}
        </div>

        {showFilters && (
          <div className="relative mt-5 overflow-visible">
            <TableFilters columns={columns} />
          </div>
        )}
      </div>

     <div className="border-t border-border">
  <div className="h-[min(460px,50vh)] min-h-[240px] w-full max-w-full overflow-auto overscroll-contain px-2 sm:px-4">
    <GenericTable>
      <GenericTableHeader
        columns={columns}
        hasAction={Boolean(renderAction)}
      />
      <GenericTableBody
        data={data}
        columns={columns}
        renderAction={renderAction}
        isLoading={isLoading}
      />
    </GenericTable>
  </div>
</div>

      {showPagination && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-6 py-4 sm:flex-row sm:px-8">
          <p className="text-xs font-medium text-textMuted">
            Page{" "}
            <span className="font-semibold text-textPrimary">{currentPage}</span>{" "}
            of{" "}
            <span className="font-semibold text-textPrimary">{pageCount}</span>
          </p>

          <Pagination
            count={pageCount}
            page={Math.min(currentPage, pageCount)}
            onChange={(_, newPage) => goToPage(newPage)}
            shape="rounded"
            size="small"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPagination-ul": {
                gap: "4px",
                flexWrap: "nowrap",
              },
              "& .MuiPaginationItem-root": {
                minWidth: "32px",
                height: "32px",
                margin: 0,
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#475569",
                fontSize: "12px",
                fontWeight: 500,
                transition: "all 0.18s ease",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#f0fdfa",
                borderColor: "#99f6e4",
                color: "#0f766e",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#0d9488",
                borderColor: "#0d9488",
                color: "#ffffff",
                fontWeight: 600,
              },
              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: "#0f766e",
                borderColor: "#0f766e",
                color: "#ffffff",
              },
              "& .MuiPaginationItem-root.Mui-disabled": {
                backgroundColor: "#f8fafc",
                borderColor: "#f1f5f9",
                color: "#cbd5e1",
              },
              "& .MuiPaginationItem-ellipsis": {
                border: "none",
                backgroundColor: "transparent",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}