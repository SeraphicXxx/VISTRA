import React, {useMemo, useState} from "react";
import {Pencil, Plus, Trash2} from "lucide-react";
import {DefaultTablePreset} from "/@/components/table/TableDesignPreset";
import {Column} from "/@/components/table/Table";
import {NewStaffModal, NewStaffData} from "./newStaffModal";
import {avatarColor, getInitials} from "/@/components/avatar";
import {ConfirmModal} from "/@/components/ConfirmModal";

type JobRole =
  | "Super Administrator"
  | "Admin"
  | "Doctor"
  | "Nurse"
  | "Dentist"
  | "Clinic OJT";

const JOB_ROLES: JobRole[] = [
  "Super Administrator",
  "Admin",
  "Doctor",
  "Nurse",
  "Dentist",
  "Clinic OJT",
];

type Access_permission =
  | "Overview"
  | "Medical Records"
  | "Dental Records"
  | "Appointments"
  | "Patient Records"
  | "Staff Management";

const PERMISSIONS: Access_permission[] = [
  "Overview",
  "Medical Records",
  "Dental Records",
  "Appointments",
  "Patient Records",
  "Staff Management",
];

export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  idNumber: string;
  role: JobRole;
  roles: Access_permission[];
}

const SAMPLE_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Kenji Chua",
    idNumber: "STF-001",
    role: "Nurse",
    roles: ["Overview", "Medical Records"],
  },
  {
    id: "2",
    name: "Angel Emie Jane Bien",
    idNumber: "STF-002",
    role: "Admin",
    roles: ["Overview", "Appointments", "Patient Records"],
  },
  {
    id: "3",
    name: "Gillian Marc Lorenzo",
    idNumber: "STF-003",
    role: "Super Administrator",
    roles: [...PERMISSIONS],
  },
  {
    id: "4",
    name: "Cjay Gonzales",
    idNumber: "STF-004",
    role: "Doctor",
    roles: ["Medical Records", "Dental Records"],
  },
  {
    id: "5",
    name: "Joshua Lapitan",
    idNumber: "STF-005",
    role: "Dentist",
    roles: ["Dental Records", "Appointments"],
  },
];

const PAGE_SIZE = 10;

type PendingEdit = { role: JobRole; roles: Access_permission[] };

type ConfirmState =
  | { kind: "save"; id: string; name: string; edit: PendingEdit }
  | { kind: "add"; data: NewStaffData }
  | null;

function MemberCell({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(member.name)}`}
      >
        {getInitials(member.name)}
      </div>
      <span className="whitespace-nowrap font-medium text-slate-900">
        {member.name}
      </span>
    </div>
  );
}

function PermissionCheckbox({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500 disabled:cursor-default disabled:opacity-100"
    />
  );
}

export function RoleManagementPage() {
  const [members, setMembers] = useState<Member[]>(SAMPLE_MEMBERS);
  const [page, setPage] = useState(1);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [editingMembers, setEditingMembers] = useState<Record<string, boolean>>(
    {},
  );
  const [pending, setPending] = useState<Record<string, PendingEdit>>({});

  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));

  const getCurrent = (m: Member): PendingEdit =>
    pending[m.id] ?? { role: m.role, roles: m.roles };

  const clearPending = (id: string) => {
    setPending((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEditingMembers((prev) => ({ ...prev, [id]: false }));
  };

  const handleConfirmSave = (id: string, edit: PendingEdit) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, role: edit.role, roles: edit.roles } : m,
      ),
    );
    clearPending(id);
  };

  const handleAddStaff = (data: NewStaffData) => {
    setMembers((prev) => [...prev, { ...data, id: String(Date.now()) }]);
    setIsNewOpen(false);
  };

  const runConfirm = () => {
    if (!confirm) return;

    if (confirm.kind === "save") {
      handleConfirmSave(confirm.id, confirm.edit);
    } else {
      handleAddStaff(confirm.data);
    }

    setConfirm(null);
  };

  const columns = useMemo<Column<Member>[]>(
    () => [
      {
        key: "name",
        label: "Name",
        render: (_value, m) => <MemberCell member={m} />,
      },
      {
        key: "role",
        label: "Role",
        render: (_value, m) => {
          const current = getCurrent(m);

          if (!editingMembers[m.id]) {
            return (
              <span className="whitespace-nowrap text-slate-700">{m.role}</span>
            );
          }

          return (
            <select
              value={current.role}
              onChange={(e) =>
                setPending((prev) => ({
                  ...prev,
                  [m.id]: { ...current, role: e.target.value as JobRole },
                }))
              }
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-teal-500 focus:ring-teal-500"
            >
              {JOB_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          );
        },
      },
      ...PERMISSIONS.map((permission) => ({
        key: permission as unknown as keyof Member,
        label: permission,
        render: (_value: unknown, m: Member) => {
          const current = getCurrent(m);

          return (
            <div className="flex justify-center">
              <PermissionCheckbox
                checked={current.roles.includes(permission)}
                disabled={!editingMembers[m.id]}
                onChange={(checked) =>
                  setPending((prev) => {
                    const base = prev[m.id] ?? { role: m.role, roles: m.roles };
                    const roles = checked
                      ? [
                          ...base.roles.filter((p) => p !== permission),
                          permission,
                        ]
                      : base.roles.filter((p) => p !== permission);
                    return { ...prev, [m.id]: { ...base, roles } };
                  })
                }
              />
            </div>
          );
        },
      })),
      {
        key: "idNumber",
        label: "Staff ID",
        render: (_value, m) => (
          <span className="whitespace-nowrap font-medium tabular-nums text-slate-700">
            {m.idNumber}
          </span>
        ),
      },
    ],
    [pending, editingMembers],
  );

  const renderAction = (m: Member) => {
    const isEditing = !!editingMembers[m.id];
    const current = getCurrent(m);

    const hasChanges =
      current.role !== m.role ||
      current.roles.length !== m.roles.length ||
      current.roles.some((r) => !m.roles.includes(r));

    if (isEditing) {
      return (
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <button
            type="button"
            onClick={() => clearPending(m.id)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!hasChanges}
            onClick={() =>
              setConfirm({ kind: "save", id: m.id, name: m.name, edit: current })
            }
            className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Confirm
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-3 text-slate-400">
        <button
          type="button"
          aria-label={`Delete ${m.name}`}
          className="transition hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={`Edit ${m.name}`}
          onClick={() => {
            setPending((prev) => ({
              ...prev,
              [m.id]: { role: m.role, roles: [...m.roles] },
            }));
            setEditingMembers((prev) => ({ ...prev, [m.id]: true }));
          }}
          className="transition hover:text-teal-700"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <>
      <DefaultTablePreset<Member>
        title="Access & Permissions"
        subtitle="Manage staff roles and access permissions."
        panelAddon={
          <button
            type="button"
            onClick={() => setIsNewOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primaryDark hover:shadow-md active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            Add New Staff
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

      {isNewOpen && (
        <NewStaffModal
          onClose={() => setIsNewOpen(false)}
          onSave={(data) => setConfirm({ kind: "add", data })}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.kind === "save" ? "Save changes?" : "Add new staff?"}
          message={
            confirm.kind === "save"
              ? `Update the role and access permissions for ${confirm.name}?`
              : `Add ${confirm.data.name} as a new staff member?`
          }
          confirmLabel={confirm.kind === "save" ? "Save" : "Add"}
          onConfirm={runConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}