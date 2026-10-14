import React, {useMemo, useState} from "react";
import {Pencil, Plus, Trash2} from "lucide-react";

import {DefaultTablePreset} from "/@/components/table/TableDesignPreset";
import {Column} from "/@/components/table/Table";
import {StaffStatusBadge} from "/@/components/StatusBadge";

type Role =
    | "Super Administrator"
    | "Admin"
    | "Doctor"
    | "Nurse"
    | "Dentist"
    | "Clinic OJT";

const ROLES: Role[] = [
    "Super Administrator",
    "Admin",
    "Doctor",
    "Nurse",
    "Dentist",
    "Clinic OJT",
];

type MemberStatus = "Active" | "Non-login" | "Unconfirmed";

export interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
    email: string;
    idNumber: string;
    roles: Role[];
    status: MemberStatus;
}

const SAMPLE_MEMBERS: Member[] = [
    {id: "1", name: "Jane Cooper", email: "jane.cooper@example.com", idNumber: "STF-001", roles: ["Nurse"], status: "Active"},
    {id: "2", name: "Floyd Miles", email: "floyd.miles@example.com", idNumber: "STF-002", roles: ["Admin"], status: "Non-login"},
    {id: "3", name: "Darlene Robertson", email: "darlene.robertson@example.com", idNumber: "STF-003", roles: ["Super Administrator"], status: "Unconfirmed"},
    {id: "4", name: "Albert Flores", email: "albert.flores@example.com", idNumber: "STF-004", roles: ["Doctor"], status: "Active"},
    {id: "5", name: "Guy Hawkins", email: "guy.hawkins@example.com", idNumber: "STF-005", roles: ["Dentist", "Clinic OJT"], status: "Unconfirmed"},
];

const PAGE_SIZE = 10;

function MemberCell({member}: { member: Member }) {
    const initials = member.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

    return (
        <div className="flex items-center gap-3">
            {member.avatarUrl ? (
                <img src={member.avatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover"/>
            ) : (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {initials}
                </div>
            )}
            <span className="whitespace-nowrap font-medium text-slate-900">{member.name}</span>
        </div>
    );
}

function RoleCheckboxes({
                            roles,
                            isEditing,
                            onChange,
                        }: {
    roles: Role[];
    isEditing: boolean;
    onChange: (roles: Role[]) => void;
}) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 py-2">
                    {ROLES.map((role) => (
                <label
                    key={role}
                    className={`flex items-center gap-1.5 whitespace-nowrap text-md ${
                        isEditing ? "cursor-pointer text-slate-700" : "cursor-default text-slate-500"
                    }`}
                >
                    <input
                        type="checkbox"
                        checked={roles.includes(role)}
                        disabled={!isEditing}
                        onChange={() =>
                            onChange(
                                roles.includes(role)
                                    ? roles.filter((item) => item !== role)
                                    : [...roles, role]
                            )
                        }
                        className="h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:cursor-default disabled:opacity-100"
                    />
                    {role}
                </label>
            ))}
        </div>
    );
}

export function RoleManagementPage() {
    const [members, setMembers] = useState<Member[]>(SAMPLE_MEMBERS);
    const [page, setPage] = useState(1);
    const [editingMembers, setEditingMembers] = useState<Record<string, boolean>>({});
    const [pendingRoles, setPendingRoles] = useState<Record<string, Role[]>>({});

    const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));

    const clearPending = (id: string) => {
        setPendingRoles((prev) => {
            const next = {...prev};
            delete next[id];
            return next;
        });
        setEditingMembers((prev) => ({...prev, [id]: false}));
    };

    const handleRoleConfirm = (id: string, roles: Role[]) => {
        setMembers((prev) => prev.map((m) => (m.id === id ? {...m, roles} : m)));
        clearPending(id);
    };

    const handleRoleCancel = (id: string) => clearPending(id);

    const columns = useMemo<Column<Member>[]>(
        () => [
            {key: "name", label: "Name", render: (_value, m) => <MemberCell member={m}/>},
            {
                key: "roles",
                label: "Role",
                render: (_value, m) => (
                    <RoleCheckboxes
                        roles={pendingRoles[m.id] ?? m.roles}
                        isEditing={!!editingMembers[m.id]}
                        onChange={(roles) => setPendingRoles((prev) => ({...prev, [m.id]: roles}))}
                    />
                ),
            },
            {
                key: "idNumber",
                label: "Staff ID",
                render: (_value, m) => (
                    <span className="whitespace-nowrap font-medium tabular-nums text-slate-700">{m.idNumber}</span>
                ),
            },
            {key: "status", label: "Status", render: (_value, m) => <StaffStatusBadge status={m.status}/>},
        ],
        [pendingRoles, editingMembers]
    );

    const renderAction = (m: Member) => {
        const isEditing = !!editingMembers[m.id];
        const roles = pendingRoles[m.id] ?? m.roles;
        const hasChanges = roles.length !== m.roles.length || roles.some((r) => !m.roles.includes(r));

        if (isEditing) {
            return (
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <button
                        type="button"
                        onClick={() => handleRoleCancel(m.id)}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!hasChanges}
                        onClick={() => handleRoleConfirm(m.id, roles)}
                        className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                        Confirm
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-end gap-3 text-slate-400">
                <button type="button" aria-label={`Delete ${m.name}`} className="transition hover:text-rose-600">
                    <Trash2 className="h-4 w-4"/>
                </button>
                <button
                    type="button"
                    aria-label={`Edit roles for ${m.name}`}
                    onClick={() => {
                        setPendingRoles((prev) => ({...prev, [m.id]: [...m.roles]}));
                        setEditingMembers((prev) => ({...prev, [m.id]: true}));
                    }}
                    className="transition hover:text-teal-700"
                >
                    <Pencil className="h-4 w-4"/>
                </button>
            </div>
        );
    };

    return (
        <DefaultTablePreset<Member>
            title="Access & Permissions"
            subtitle="Manage staff roles and access permissions."
            panelAddon={
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                    <Plus className="h-4 w-4"/>
                    Add New Members
                </button>
            }
            data={members}
            isLoading={false}
            columns={columns}
            renderAction={renderAction}
            totalPages={totalPages}
            page={page}
            onRun={(_search, _filters, nextPage) => setPage(nextPage)}
        />
    );
}