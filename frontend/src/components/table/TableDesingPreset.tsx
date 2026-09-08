import {useNavigate} from "react-router-dom";
import {ChevronRight} from "lucide-react";

import PanelHeader from "/@/components/PanelHeader";
import {FilterColumn, TableFilters} from "/@/components/Filters";
import {Column, GenericTable, GenericTableBody, GenericTableHeader} from "/@/components/table/Table";
import React from "react";


interface TablePresetProps<T> {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    action?: React.ReactNode;

    filterableColumns: FilterColumn<T>[];
    filterOptions: Record<keyof T, string[]>;

    data: T[];

    columns: Column<T>[];

    renderAction?: (row: T) => React.ReactNode;
}

export function DefaultTablePreset <T extends { id: string }>({
                                          title,
                                          icon: Icon,
                                          action,
                                          filterableColumns,
                                          filterOptions,
                                          data,
                                          columns,
                                          renderAction,
                                      }: TablePresetProps<T>) {
    return (
        <>
            <PanelHeader title={title} icon={Icon} action={action}/>

            <TableFilters<T>
                filterableColumns={filterableColumns}
                filterOptions={filterOptions}
            />

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
        </>
    );
}