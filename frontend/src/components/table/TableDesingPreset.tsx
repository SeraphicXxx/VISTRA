import {useNavigate} from "react-router-dom";
import {ChevronRight} from "lucide-react";

import PanelHeader from "/@/components/PanelHeader";
import {FilterColumn, TableFilters} from "/@/components/Filters";
import {Column, GenericTable, GenericTableBody, GenericTableHeader} from "/@/components/table/Table";
import React from "react";


interface TablePresetProps<T> {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    panelAddon?: React.ReactNode;

    filterableColumns: FilterColumn<T>[];
    filterOptions: Record<keyof T, string[]>;

    data: T[];

    columns: Column<T>[];

    renderAction?: (row: T) => React.ReactNode;
}
//used in  overview,dental,medical,appointment and patient tabs
export function DefaultTablePreset<T extends { id: string }>({
                                                                 title,
                                                                 icon: Icon,
                                                                 panelAddon,
                                                                 filterableColumns,
                                                                 filterOptions,
                                                                 data,
                                                                 columns,
                                                                 renderAction,
                                                             }: TablePresetProps<T>) {
    return (
        <>
            <div className="rounded-2xl border border-border bg-surface shadow-card">
                <div className="p-6 overflow-x-auto">

                    <PanelHeader title={title} icon={Icon} action={panelAddon}/>

                    <div className=" border-t border-border"/>

                    <TableFilters<T>
                        filterableColumns={filterableColumns}
                        filterOptions={filterOptions}
                    />

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
                        />
                    </GenericTable>

                </div>
            </div>
        </>
    );
}