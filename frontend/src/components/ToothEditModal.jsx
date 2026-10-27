import { useState } from "react";
import { Modal } from "/@/components/editModal.jsx";
import { conditionLabels } from "/@/pages/admin/dental/dentalModal.jsx";

export function ToothEditModal({ toothNumber, record, onClose, onSave, isSaving = false }) {
  const [form, setForm] = useState({
    dentition: record?.dentition || "permanent",
    condition: record?.condition || "sound",
    notes: record?.notes || "",
  });

  const update = (key, value) => {
    if (isSaving) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return;
    onSave(form);
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  return (
    <Modal
      title={`Edit Tooth ${toothNumber}`}
      onClose={handleClose}
      footer={
        <>
          <button type="button" onClick={handleClose} disabled={isSaving} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="tooth-edit-form" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving && (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </>
      }
    >
      <form id="tooth-edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-textMuted">Dentition</span>
          <select
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
            value={form.dentition}
            onChange={(e) => update("dentition", e.target.value)}
            disabled={isSaving}
          >
            <option value="permanent">Permanent</option>
            <option value="temporary">Temporary</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-textMuted">Condition</span>
          <select
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
            value={form.condition}
            onChange={(e) => update("condition", e.target.value)}
            disabled={isSaving}
          >
            {Object.entries(conditionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-textMuted">Notes</span>
          <textarea
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Enter notes..."
            disabled={isSaving}
          />
        </label>
      </form>
    </Modal>
  );
}