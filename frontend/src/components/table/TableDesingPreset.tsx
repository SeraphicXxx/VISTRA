import PanelHeader from "/@/components/PanelHeader";
import {FilterColumn, TableFilters} from "/@/components/Filters";
import {Column, GenericTable, GenericTableBody, GenericTableHeader} from "/@/components/table/Table";
import React from "react";
import {TableProvider} from "/@/context/TableContext";
import LoadingPage from "/@/components/LoadingPage";


interface TablePresetProps<T> {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    panelAddon?: React.ReactNode;

    filterableColumns: FilterColumn<T>[];
    filterOptions: Record<keyof T, string[]>;

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

//used in  overview,dental,medical,appointment and patient tabs
export function DefaultTablePreset<T extends { id: string }>({
                                                                 title,
                                                                 icon: Icon,
                                                                 panelAddon,
                                                                 filterableColumns,
                                                                 filterOptions,
                                                                 data,
                                                                 isLoading,
                                                                 isRefreshing,
                                                                 columns,
                                                                 renderAction,

                                                                 onRun,
                                                             }: TablePresetProps<T>) {
    if (isLoading) {
        return <LoadingPage />;
    }
    return (
        <TableProvider<T> onRun={onRun}>
            <div className="rounded-2xl border border-border bg-surface shadow-card">
                <div className="p-6 overflow-x-auto">

                    <PanelHeader title={title} icon={Icon} action={panelAddon}/>

                    <div className=" border-t border-border"/>

                    <TableFilters<T>
                        filterableColumns={filterableColumns}
                        filterOptions={filterOptions}

                    />

                    <div className="border-t border-border"/>

                    <GenericTable>

                        <GenericTableHeader
                            columns={columns}
                            hasAction
                        />

                        <GenericTableBody
                            data={data}
                            columns={columns}
                            renderAction={renderAction}
                        />
                        {isRefreshing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
                                Loading...
                            </div>
                        )}
                    </GenericTable>

                </div>
            </div>
        </TableProvider>
    );
}