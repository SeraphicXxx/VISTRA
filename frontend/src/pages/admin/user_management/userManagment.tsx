import React, {useEffect, useMemo, useState} from "react";
import {Pencil, Plus, Trash2} from "lucide-react";
import {DefaultTablePreset} from "/@/components/table/TableDesignPreset";
import {Column} from "/@/components/table/Table";
import {NewStaffModal, NewStaffData, JobRole, AccessPermission, JOB_ROLES, PERMISSIONS} from "./newStaffModal";
import {avatarColor, getInitials} from "/@/components/avatar";
import {ConfirmModal} from "/@/components/ConfirmModal";
import {useCreateStaff, useDeleteStaff, useStaffList, useUpdateStaffAccess} from "/@/hooks/query/StaffQuery";
import {useDebounce} from "/@/hooks/Debouncer";
import {toast} from "react-toastify";
import type {StaffPermissions} from "/@/api/schema/StaffSchema";
import type {StaffModel} from "/@/repository/StaffModel";

function fullName(data: Pick<NewStaffData, "firstName" | "middleName" | "lastName">): string {
  return [data.firstName, data.middleName, data.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  idNumber: string;
  role: JobRole;
  roles: AccessPermission[];
}

const PERMISSION_LABELS: { key: keyof StaffPermissions; label: AccessPermission }[] = [
  {key: "medical_module", label: "Medical Records"},
  {key: "dental_module", label: "Dental Records"},
  {key: "appointment_module", label: "Appointments"},
  {key: "patient_module", label: "Patient Records"},
  {key: "staff_module", label: "Staff Management"},
];

function toMember(staff: StaffModel): Member {
  const perms = staff.permissions;
  return {
    id: staff.staff_id,
    name: staff.getFullName(),
    idNumber: staff.staff_id,
    // Legacy rows predate the role column: fall back until backfilled.
    role: (staff.role as JobRole | null) ?? "Clinic OJT",
    roles: perms
    ? PERMISSION_LABELS.filter(({key}) => perms[key]).map(({label}) => label)
    : [],
  };
}

const PAGE_SIZE = 10;

type PendingEdit = { role: JobRole; roles: AccessPermission[] };

type ConfirmState =
  | { kind: "save"; id: string; name: string; edit: PendingEdit }
  | { kind: "add"; data: NewStaffData }
  | { kind: "delete"; id: string; name: string }
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
  const {data: staffList, isLoading: staffLoading, error: staffError} = useStaffList();
  const {mutateAsync: deleteStaff} = useDeleteStaff();
  const {mutateAsync: createStaff} = useCreateStaff();
  const {mutateAsync: saveAccess} = useUpdateStaffAccess();
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [editingMembers, setEditingMembers] = useState<Record<string, boolean>>(
    {},
  );
  const [pending, setPending] = useState<Record<string, PendingEdit>>({});

  useEffect(() => {
    if (staffList) {
      setMembers(staffList.map(toMember));
    }
  }, [staffList]);

  const visibleMembers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return members;
    return members.filter((m) =>
      [m.name, m.idNumber, m.role].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [members, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(visibleMembers.length / PAGE_SIZE));

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

  const handleConfirmSave = async (id: string, edit: PendingEdit) => {
    const current = members.find((m) => m.id === id);
    const payload = Object.fromEntries(
      PERMISSION_LABELS.map(({key, label}) => [key, edit.roles.includes(label)]),
    );
    await saveAccess({
      staffId: id,
      payload: {
        ...payload,
        ...(!current || edit.role !== current.role ? {role: edit.role} : {}),
      },
    });

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, role: edit.role, roles: edit.roles } : m,
      ),
    );
    clearPending(id);
  };

  const handleAddStaff = async (data: NewStaffData) => {
    const permissions = Object.fromEntries(
      PERMISSION_LABELS.map(({key, label}) => [key, data.roles.includes(label)]),
    );
    await createStaff({
      staff_id: data.idNumber,
      first_name: data.firstName,
      middle_name: data.middleName.trim() || undefined,
      last_name: data.lastName,
      password: data.password,
      position: data.position,
      role: data.role,
      permissions,
    });
    setMembers((prev) => [
      ...prev,
      {
        id: data.idNumber,
        name: fullName(data),
        idNumber: data.idNumber,
        role: data.role,
        roles: data.roles,
      },
    ]);
    setIsNewOpen(false);
  };

  const runConfirm = async () => {
    if (!confirm || isConfirming) return;

    setIsConfirming(true);

    try {
      if (confirm.kind === "save") {
        await handleConfirmSave(confirm.id, confirm.edit);
        toast.success("Permissions updated");
      } else if (confirm.kind === "add") {
        await handleAddStaff(confirm.data);
        toast.success("Staff member added");
      } else {
        await deleteStaff(confirm.id);
        clearPending(confirm.id);
        toast.success("Staff member deleted");
      }
    } catch (error) {
      console.error("Staff action failed:", error);
      toast.error("Action failed. Check the connection and try again.");
      return;
    } finally {
      setIsConfirming(false);
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
          onClick={() => setConfirm({kind: "delete", id: m.id, name: m.name})}
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
      {staffError && members.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-textMuted">
          Couldn't load staff. Check the connection and try again.
        </div>
      )}

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
        data={visibleMembers}
        isLoading={staffLoading}
        columns={columns}
        renderAction={renderAction}
        totalPages={totalPages}
        page={page}
        onRun={(nextSearch, _filters, nextPage) => {
          setSearch(nextSearch);
          setPage(nextPage);
        }}
      />

      {isNewOpen && (
        <NewStaffModal
          onClose={() => setIsNewOpen(false)}
          onSave={(data) => setConfirm({ kind: "add", data })}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={
            confirm.kind === "save"
              ? "Save changes?"
              : confirm.kind === "add"
                ? "Add new staff?"
                : "Delete staff?"
          }
          message={
            confirm.kind === "save"
              ? `Update the role and access permissions for ${confirm.name}?`
              : confirm.kind === "add"
                ? `Add ${fullName(confirm.data)} as a new staff member?`
                : `Delete ${confirm.name}? Their login and staff record will be removed.`
          }
          confirmLabel={
            confirm.kind === "save" ? "Save" : confirm.kind === "add" ? "Add" : "Delete"
          }
          onConfirm={runConfirm}
          onCancel={() => setConfirm(null)}
          isConfirming={isConfirming}
        />
      )}
    </>
  );
}