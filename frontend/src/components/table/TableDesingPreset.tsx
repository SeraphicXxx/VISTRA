import React from "react";
import { Pagination } from "@mui/material";

import PanelHeader from "/@/components/PanelHeader";
import LoadingPage from "/@/components/LoadingPage";
import { TableFilters } from "/@/components/Filters";
import {
    Column,
    GenericTable,
    GenericTableBody,
    GenericTableHeader,
} from "/@/components/table/Table";
import { TableProvider } from "/@/context/TableContext";

interface TablePresetProps<T> {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    panelAddon?: React.ReactNode;

    data: T[];
    isLoading: boolean;
    isRefreshing: boolean;

    columns: Column<T>[];

    renderAction?: (row: T) => React.ReactNode;

    onRun?: (
        search: string,
        filters: Partial<Record<keyof T, string | null>>
    ) => void;
}

export function DefaultTablePreset<T extends { id: string }>({
                                                                 title,
                                                                 icon: Icon,
                                                                 panelAddon,
                                                                 data,
                                                                 isLoading,
                                                                 isRefreshing,
                                                                 columns,
                                                                 renderAction,
                                                                 onRun,
                                                             }: TablePresetProps<T>) {
    if (isLoading && isRefreshing) {
        return <LoadingPage />;
    }

    return (
        <TableProvider<T> onRun={onRun}>
            <div className="rounded-2xl border border-border bg-surface shadow-card">
                <div className="overflow-x-auto p-6">
                    <PanelHeader
                        title={title}
                        icon={Icon}
                        action={panelAddon}
                    />

                    <div className="border-t border-border" />

                    <div className="relative overflow-visible">
                        <TableFilters
                            columns={columns}
                        />
                    </div>

                    <div className="border-t border-border" />

                    <GenericTable>
                        <GenericTableHeader
                            columns={columns}
                            hasAction
                        />

                        <GenericTableBody
                            data={data}
                            columns={columns}
                            renderAction={renderAction}
                            isRefreshing={isRefreshing}
                        />
                    </GenericTable>

                    <div className="flex justify-center">
                        <Pagination count={10} />
                    </div>
                </div>
            </div>
        </TableProvider>
    );
}