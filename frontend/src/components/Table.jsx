import {ChevronRight, FileX2} from "lucide-react";
import React from "react";
import {StatusBadge} from "./statusbadge.jsx";
import {avatarColor, getInitials, getTypeIcon} from "./avatar.jsx";

export const GenericTableTab = ({}) => {

}
export const GenericTable = ({ data, columns }) => {
    return (
        <table className="w-full border-separate border-spacing-0">
            <GenericTableHeader columns={columns} />
            <GenericTableBody data={data} />
        </table>
    )
}
const GenericTableHeader = ({ columns }) => {
    return (
        <thead>
        <tr className="text-left">
            {columns.map((col) => (
                <th
                    key={col}
                    className="border-b border-border pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-textMuted"
                >
                    {col}
                </th>
            ))}
            <th className="border-b border-border pb-2" />
        </tr>
        </thead>
    )
}
const GenericTableBody = ({ data }) => {
    return (
        <tbody>
        {data.map((record) => {
            const TypeIcon = getTypeIcon(record.type);
            return (
                <tr key={record.id} className="group transition-colors duration-150 hover:bg-primary/[0.03]">
                    <td className="border-b border-border py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(
                            record.student
                        )}`}
                    >
                      {getInitials(record.student)}
                    </span>
                            <span className="text-sm font-medium text-textPrimary">{record.student}</span>
                        </div>
                    </td>
                    <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{record.course}</td>
                    <td className="border-b border-border py-3 pr-4 text-sm text-textSecondary">{record.time}</td>
                    <td className="border-b border-border py-3 pr-4">
                        <div className="flex items-center gap-1.5 text-sm text-textSecondary">
                            <TypeIcon className="h-3.5 w-3.5 shrink-0 text-textMuted" strokeWidth={2} />
                            {record.type}
                        </div>
                    </td>
                    <td className="border-b border-border py-3 pr-4">
                        <StatusBadge status={record.status} />
                    </td>
                    <td className="border-b border-border py-3 text-right">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary/10 hover:text-primaryDark"
                        >
                            View
                            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                    </td>
                </tr>
            );
        })}
        {data.length === 0 && (
            <tr>
                <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-textMuted/10 text-textMuted">
                    <FileX2 className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                        <p className="text-sm text-textMuted">No records match your search.</p>
                    </div>
                </td>
            </tr>
        )}
        </tbody>
    )
}