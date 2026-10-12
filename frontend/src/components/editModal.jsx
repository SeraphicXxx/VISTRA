import { useState } from "react";
import { X } from "lucide-react";
import { ReadOnlyField } from "/@/utils/ReadOnlyField";

export const patientEditFields = [
  { key: "name", label: "Full name", required: true, readOnly: true },
  { key: "studentId", label: "Student ID", readOnly: true },
  { key: "yearSection", label: "Year & section" },
  { key: "age", label: "Age" },
  { key: "sex", label: "Sex", type: "select", options: ["Male", "Female", "Other"] },
  { key: "civilStatus", label: "Civil status" },
  { key: "birthday", label: "Birthday", type: "date" },
  { key: "mobileNumber", label: "Mobile number" },
  { key: "barangay", label: "Barangay" },
  { key: "address", label: "Address" },
];

// Standalone field list for the "Update status" modal, so status changes
// go through their own small form instead of the full patient edit form.
export const statusEditFields = [
  { key: "status", label: "Status", type: "select", options: ["Cleared", "Not Cleared","Second Option", "Recovered", "Referred","Ongoing Treatment"] },
];

export const dentalEditFields = [

  { key: "date", label: "Exam date", type: "date" },
  { key: "lastVisit", label: "Last dental visit" },
  {
    key: "floss",
    label: "Flosses regularly",
    type: "select",
    options: ["Yes", "No"],
  },
  { key: "brushFrequency", label: "Brushing frequency", type: "select", options: ["Once a day", "Twice a day", "More than twice a day"] },
  {
    key: "calculus",
    label: "Calculus",
    type: "select",
    options: ["None", "Light", "Moderate", "Heavy"],
  },
  { key: "medication", label: "Medication" },
  { key: "status", label: "Status", type: "select", options: ["Cleared", "Not Cleared","Second Option", "Recovered", "Referred","Ongoing Treatment"] },
  { key: "notes", label: "Notes", type: "textarea", span: true },
  
];

export function Modal({
  title,
  onClose,
  children,
  footer,
  maxWidth = "max-w-2xl",
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-border bg-surface shadow-lg`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-semibold text-primaryDark">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-textMuted hover:bg-surfaceMuted hover:text-textPrimary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/40";

export function FormField({ field, value, onChange, disabled = false }) {
  const {
    key,
    label,
    type = "text",
    options,
    required,
    span,
    readOnly,
  } = field;

  if (readOnly) {
    return <ReadOnlyField id={key} label={label} value={value} />;
  }

  const disabledClass = disabled ? "cursor-not-allowed opacity-60" : "";

  return (
    <label className={`flex flex-col gap-1.5 ${span ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-textMuted">{label}</span>

      {type === "select" ? (
        <select
          className={inputClass}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={`${inputClass} resize-none ${disabledClass}`}
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className={`${inputClass} ${disabledClass}`}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          required={required}
          disabled={disabled}
        />
      )}
    </label>
  );
}

export function EditRecordModal({
  title = "Edit record",
  fields,
  data,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [form, setForm] = useState(data);

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
      title={title}
      onClose={handleClose}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="edit-record-form"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
          >
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
      <form
        id="edit-record-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {fields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={form[field.key]}
            onChange={update}
            disabled={isSaving}
          />
        ))}
      </form>
    </Modal>
  );
}