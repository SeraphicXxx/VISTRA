import React, {ReactNode} from "react";

import {getTypeIcon, getInitials, avatarColor} from "/@/components/avatar";
import {Status, StatusBadge} from "/@/components/StatusBadge";

export interface Default {
    id: string;
    student: string;
    course: string;
    time: string;
    type: string;
    status: Status;
}

export const defaultColumns: Column<Default>[] = [
    {
        key: "student",
        label: "Student",
        render: (value) => {
            const student = value as string;

            return (
                <div className="flex items-center gap-2.5">
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(student)}`}
                    >
                        {getInitials(student)}
                    </span>

                    <span className="text-sm font-medium text-textPrimary">
                        {student}
                    </span>
                </div>
            );
        },
    },

    {
        key: "course",
        label: "Course",
    },

    {
        key: "time",
        label: "Time",
    },

    {
        key: "type",
        label: "Type",
        render: (value) => {
            const type = value as string;
            const TypeIcon = getTypeIcon(type);

            return (
                <div className="flex items-center gap-1.5 text-sm text-textSecondary">
                    <TypeIcon
                        className="h-3.5 w-3.5 shrink-0 text-textMuted"
                        strokeWidth={2}
                    />
                    {type}
                </div>
            );
        },
    },

    {
        key: "status",
        label: "Status",
        render: (value) => (
            <StatusBadge status={value as Status}/>
        ),
    },

];

export interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], record: T) => ReactNode;
}

interface GenericTableProps {
    children: ReactNode;
    className?: string;
}

export class GenericTable extends React.Component<GenericTableProps> {
    render() {
        const {children, className = ""} = this.props;

        return (
            <table
                className={`w-full min-w-[640px] border-separate border-spacing-0 ${className}`}
            >
                {children}
            </table>
        );
    }
}

export const GenericTableHeader = <T, >({
                                            columns,
                                            hasAction = false,
                                        }: {
    columns: Column<T>[];
    hasAction?: boolean;
}) => {
    return (
        <thead>
        <tr className="text-left">
            {columns.map((column) => (
                <th
                    key={String(column.key)}
                    className="
                            border-b border-border
                            px-4 py-3
                            text-xs font-semibold
                            uppercase tracking-wide
                            text-textMuted
                        "
                >
                    {column.label}
                </th>
            ))}

            {hasAction && (
                <th
                    className="
                            border-b border-border
                            px-4 py-3
                            text-right
                            text-xs font-semibold
                            uppercase tracking-wide
                            text-textMuted
                        "
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
                                                               renderAction,
                                                           }: {
    data: T[];
    columns: Column<T>[];
    renderAction?: (record: T) => ReactNode;
}) => {
    return (
        <tbody>
        {data.map((record) => (
            <GenericRow key={record.id}>
                {columns.map((column) => (
                    <td
                        key={String(column.key)}
                        className="border-b border-border py-3 pr-4"
                    >
                        {column.render
                            ? column.render(record[column.key], record)
                            : String(record[column.key])}
                    </td>
                ))}

                {renderAction && (
                    <td className="border-b border-border py-3 text-right">
                        {renderAction(record)}
                    </td>
                )}
            </GenericRow>
        ))}
        </tbody>
    );
};

function GenericRow({children}: { children: ReactNode }) {
    return (
        <tr className="group transition-colors duration-150 hover:bg-primary/[0.03]">
            {children}
        </tr>
    );
}


