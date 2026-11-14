import type { ReactNode } from "react";
import {
  GraduationCap,
  HeartPulse,
  MapPin,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import {
  CIVIL_STATUS_OPTIONS,
  COURSE_OPTIONS,
  EMERGENCY_RELATIONSHIP_OPTIONS,
  SECTION_OPTIONS,
  SEX_OPTIONS,
  YEAR_OPTIONS,
} from "/@/utils/NewPatientUtils.jsx";

// Option lists are shared with the admin "New patient record" form (NewPatientUtils.jsx).
// Plain strings are used as both value and label. Course objects use `code` as the
// saved value and `label` as the text shown.
type RawOption = string | { code: string; label: string };
export type Option = { value: string; label: string };

function toOptions(list: readonly RawOption[]): Option[] {
  return list.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : { value: option.code, label: option.label }
  );
}

export const OTHER = "Other";

type SelectKey = "course" | "year" | "section" | "civil_status" | "emergency_relation";
export type OtherKey = `${SelectKey}_other`;

export type FieldKey =
  | "last_name"
  | "first_name"
  | "middle_name"
  | "birthday"
  | "age"
  | "sex"
  | "civil_status"
  | "mobile_number"
  | "email"
  | "emergency_name"
  | "emergency_relation"
  | "emergency_phone"
  | "patient_id"
  | "course"
  | "year"
  | "section"
  | "address"
  | "barangay";

export type DetailKey = FieldKey | OtherKey;
export type DetailValues = Record<DetailKey, string>;
export type ExtractedForm = Partial<Record<DetailKey, string>>;

export type FieldDef = {
  key: FieldKey;
  label: string;
  required?: boolean;
  half?: boolean;
  type?: string;
  inputMode?: "text" | "email" | "numeric";
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  options?: Option[];
  allowOther?: boolean;
  computed?: boolean;
};

export type FieldGroup = {
  title: string;
  icon: LucideIcon;
  note?: string;
  fields: FieldDef[];
};

const SEX_CHOICES = toOptions(SEX_OPTIONS as readonly RawOption[]);
const CIVIL_STATUS_CHOICES = toOptions(CIVIL_STATUS_OPTIONS as readonly RawOption[]);
const COURSE_CHOICES = toOptions(COURSE_OPTIONS as readonly RawOption[]);
const YEAR_CHOICES = toOptions(YEAR_OPTIONS as readonly RawOption[]);
const SECTION_CHOICES = toOptions(SECTION_OPTIONS as readonly RawOption[]);
const EMERGENCY_RELATION_CHOICES = toOptions(
  EMERGENCY_RELATIONSHIP_OPTIONS as readonly RawOption[]
);

export const DETAIL_GROUPS: FieldGroup[] = [
  {
    title: "Personal information",
    icon: User,
    fields: [
      {
        key: "last_name",
        label: "Last name",
        required: true,
        half: true,
        autoComplete: "family-name",
      },
      {
        key: "first_name",
        label: "First name",
        required: true,
        half: true,
        autoComplete: "given-name",
      },
      {
        key: "middle_name",
        label: "Middle name",
        half: true,
        autoComplete: "additional-name",
      },
      { key: "birthday", label: "Birthday", required: true, half: true, type: "date" },
      {
        key: "age",
        label: "Age",
        half: true,
        computed: true,
        hint: "Calculated from your birthday.",
      },
      { key: "sex", label: "Sex", half: true, options: SEX_CHOICES },
      {
        key: "civil_status",
        label: "Civil status",
        half: true,
        options: CIVIL_STATUS_CHOICES,
        allowOther: true,
      },
    ],
  },
  {
    title: "Contact",
    icon: Phone,
    fields: [
      {
        key: "mobile_number",
        label: "Mobile number",
        required: true,
        half: true,
        type: "tel",
        placeholder: "09XXXXXXXXX",
        autoComplete: "tel",
      },
      {
        key: "email",
        label: "Email",
        required: true,
        half: true,
        type: "email",
        inputMode: "email",
        autoComplete: "email",
        hint: "We will email this address once an admin approves your account.",
      },
    ],
  },
  {
    title: "Emergency contact",
    icon: HeartPulse,
    fields: [
      {
        key: "emergency_name",
        label: "Contact name",
        required: true,
        half: true,
        placeholder: "Full name",
      },
      {
        key: "emergency_relation",
        label: "Relationship",
        required: true,
        half: true,
        options: EMERGENCY_RELATION_CHOICES,
        allowOther: true,
      },
      {
        key: "emergency_phone",
        label: "Contact phone",
        required: true,
        half: true,
        type: "tel",
        placeholder: "09XXXXXXXXX",
        autoComplete: "tel",
      },
    ],
  },
  {
    title: "Enrollment",
    icon: GraduationCap,
    fields: [
      {
        key: "patient_id",
        label: "Student ID",
        required: true,
        half: true,
        placeholder: "20230786-S",
        hint: "Use the format 20230786-S.",
      },
      { key: "course", label: "Course", half: true, options: COURSE_CHOICES, allowOther: true },
      { key: "year", label: "Year", half: true, options: YEAR_CHOICES, allowOther: true },
      { key: "section", label: "Section", half: true, options: SECTION_CHOICES, allowOther: true },
    ],
  },
  {
    title: "Residential address",
    icon: MapPin,
    fields: [
      {
        key: "address",
        label: "Address",
        required: true,
        placeholder: "House no., Street",
        autoComplete: "street-address",
      },
      {
        key: "barangay",
        label: "Barangay",
        required: true,
        half: true,
        placeholder: "e.g. Brgy. 176",
      },
    ],
  },
];

export function otherKeyOf(key: FieldKey): OtherKey {
  return `${key}_other` as OtherKey;
}

const ALL_FIELDS: FieldDef[] = DETAIL_GROUPS.flatMap((group) => group.fields);

export const DETAIL_KEYS: DetailKey[] = [
  ...ALL_FIELDS.map((field) => field.key),
  ...ALL_FIELDS.filter((field) => field.allowOther).map((field) => otherKeyOf(field.key)),
];

export const EMPTY_DETAIL_VALUES = Object.fromEntries(
  DETAIL_KEYS.map((key) => [key, ""])
) as DetailValues;

const STUDENT_ID_PATTERN = /^[0-9]{8}-S$/;

export function getStudentIdError(value: string): string | null {
  return STUDENT_ID_PATTERN.test(value.trim()) ? null : "Use the format 20230786-S.";
}

/** Age in whole years from a YYYY-MM-DD birthday. Returns null if invalid or in the future. */
export function calculateAge(birthday: string, today = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const birth = new Date(year, month - 1, day);
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) {
    return null;
  }
  if (birth > today) return null;

  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) age -= 1;
  return age;
}

function ageText(birthday: string): string {
  const age = calculateAge(birthday);
  return age === null ? "" : String(age);
}

const PHONE_KEYS: FieldKey[] = ["mobile_number", "emergency_phone"];

function isValidPhone(value: string) {
  return /^\+?[\d\s-]+$/.test(value.trim()) && value.replace(/\D/g, "").length >= 7;
}

function validateField(field: FieldDef, raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    if (!field.required) return null;
    return field.options
      ? `Select ${field.label.toLowerCase()}.`
      : `Enter ${field.label.toLowerCase()}.`;
  }
  if (field.key === "patient_id") return getStudentIdError(value);
  if (field.key === "birthday" && calculateAge(value) === null) {
    return "Enter a valid birthday that is not in the future.";
  }
  if (field.key === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
    return "Enter a valid email address.";
  }
  if (PHONE_KEYS.includes(field.key) && !isValidPhone(value)) {
    return "Enter a valid phone number.";
  }
  return null;
}

export function getGroupErrors(
  group: FieldGroup,
  values: DetailValues
): Partial<Record<DetailKey, string>> {
  const errors: Partial<Record<DetailKey, string>> = {};

  for (const field of group.fields) {
    if (field.computed) continue;

    const message = validateField(field, values[field.key]);
    if (message) errors[field.key] = message;

    if (field.allowOther && values[field.key] === OTHER) {
      const otherKey = otherKeyOf(field.key);
      if (!values[otherKey].trim()) {
        errors[otherKey] = `Specify ${field.label.toLowerCase()}.`;
      }
    }
  }

  return errors;
}

export function hasGroupErrors(group: FieldGroup, values: DetailValues): boolean {
  return Object.keys(getGroupErrors(group, values)).length > 0;
}

/** Fills fields from the OCR result. Dropdown values that are not in the list become "Other". */
export function mergeExtracted(prev: DetailValues, data: ExtractedForm): DetailValues {
  const next = { ...prev };

  for (const field of ALL_FIELDS) {
    if (field.computed) continue;

    const incoming = data[field.key]?.trim();
    if (!incoming) continue;

    if (field.options) {
      const lower = incoming.toLowerCase();
      const match = field.options.find(
        (option) => option.value.toLowerCase() === lower || option.label.toLowerCase() === lower
      );

      if (match) {
        next[field.key] = match.value;
        if (field.allowOther) next[otherKeyOf(field.key)] = "";
      } else if (field.allowOther) {
        next[field.key] = OTHER;
        next[otherKeyOf(field.key)] = incoming;
      }
      continue;
    }

    next[field.key] = incoming;
  }

  return next;
}

/** Final values to send. A typed "Other" answer replaces the word "Other". */
export function resolveDetails(values: DetailValues): Record<string, string> {
  const out: Record<string, string> = {};

  for (const field of ALL_FIELDS) {
    if (field.computed) continue;

    const raw = values[field.key].trim();
    out[field.key] =
      field.allowOther && raw === OTHER ? values[otherKeyOf(field.key)].trim() : raw;
  }

  return out;
}

function withOther(options: Option[]): Option[] {
  return options.some((option) => option.value === OTHER)
    ? options
    : [...options, { value: OTHER, label: OTHER }];
}

type RegisterDetailsStepProps = {
  group: FieldGroup;
  values: DetailValues;
  errors: Partial<Record<DetailKey, string>>;
  showErrors: boolean;
  onChange: (key: DetailKey, value: string) => void;
};

export function RegisterDetailsStep({
  group,
  values,
  errors,
  showErrors,
  onChange,
}: RegisterDetailsStepProps) {
  const shownError = (key: DetailKey) => (showErrors ? (errors[key] ?? null) : null);

  return (
    <section className="flex flex-col gap-5">
      <SectionTitle icon={group.icon} note={group.note}>
        {group.title}
      </SectionTitle>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {group.fields.map((field) => {
          const key = field.key;
          const otherKey = otherKeyOf(key);
          const isOther = Boolean(field.allowOther) && values[key] === OTHER;
          const value = field.computed ? ageText(values.birthday) : values[key];

          return (
            <div key={key} className={field.half ? "" : "md:col-span-2"}>
              {field.options ? (
                <SelectField
                  id={`reg-${key}`}
                  name={key}
                  label={field.label}
                  value={value}
                  onChange={(v) => onChange(key, v)}
                  error={shownError(key)}
                  options={field.allowOther ? withOther(field.options) : field.options}
                />
              ) : (
                <Field
                  id={`reg-${key}`}
                  name={key}
                  label={field.label}
                  value={value}
                  onChange={(v) => onChange(key, v)}
                  error={shownError(key)}
                  type={field.type}
                  inputMode={field.inputMode}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  hint={field.hint}
                  readOnly={field.computed}
                />
              )}

              {isOther ? (
                <div className="mt-4">
                  <Field
                    id={`reg-${otherKey}`}
                    name={otherKey}
                    label={`Specify ${field.label.toLowerCase()}`}
                    value={values[otherKey]}
                    onChange={(v) => onChange(otherKey, v)}
                    error={shownError(otherKey)}
                    placeholder="Type your answer"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  type?: string;
  inputMode?: "text" | "email" | "numeric";
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  readOnly?: boolean;
};

function Field({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  hint,
  readOnly,
}: FieldProps) {
  const showError = Boolean(error);
  const message = showError ? error : hint;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-left text-sm font-semibold uppercase tracking-wide text-textMuted"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        readOnly={readOnly}
        aria-invalid={showError}
        aria-describedby={message ? `${id}-msg` : undefined}
        className={`w-full rounded-xl border px-4 py-3 text-base text-textPrimary transition-all duration-200 focus:outline-none focus:ring-2 ${
          readOnly ? "bg-surface" : "bg-background hover:border-primary/30"
        } ${
          showError
            ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
            : "border-border focus:border-primary/50 focus:ring-primary/20"
        }`}
      />
      {message ? (
        <p
          id={`${id}-msg`}
          role={showError ? "alert" : undefined}
          className={`mt-2 text-left text-sm leading-relaxed ${
            showError ? "text-danger" : "text-textMuted"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string | null;
};

function SelectField({ id, name, label, value, onChange, options, error }: SelectFieldProps) {
  const showError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-left text-sm font-semibold uppercase tracking-wide text-textMuted"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={showError}
        className={`w-full appearance-none rounded-xl border bg-background px-4 py-3 text-base text-textPrimary transition-all duration-200 hover:border-primary/30 focus:outline-none focus:ring-2 ${
          showError
            ? "border-danger/50 focus:border-danger/50 focus:ring-danger/20"
            : "border-border focus:border-primary/50 focus:ring-primary/20"
        }`}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showError ? (
        <p role="alert" className="mt-2 text-left text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
  note,
}: {
  icon: LucideIcon;
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
        <p className="text-sm font-semibold text-textPrimary">{children}</p>
      </div>
      {note ? <p className="mt-1 text-xs text-textMuted">{note}</p> : null}
    </div>
  );
}