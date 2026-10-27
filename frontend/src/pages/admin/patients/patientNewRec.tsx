import {useState, type FormEvent, type FocusEvent} from "react";
import {ArrowLeft, Save, UserPlus, Info, Eye, EyeOff} from "lucide-react";
import {FormInput, SelectField} from "/@/components/InputCollection.jsx";
import {
    COURSE_OPTIONS,
    YEAR_OPTIONS,
    SECTION_OPTIONS,
    SEX_OPTIONS,
    CIVIL_STATUS_OPTIONS,
    POSITION_OPTIONS,
    DEPARTMENT_OPTIONS,
} from "/@/utils/NewPatientUtils.jsx";
import MedicalHistoryForm from "/@/components/MedicalHistoryForm";
import {
    FACULTY_ID_PATTERN,
    validateFacultyId,
} from "/@/utils/NewPatientValidation.jsx";
import {useSavePatient} from "/@/hooks/SavePatient";
import {getFieldErrors, FieldErrors, getFieldErrorString} from "/@/utils/Formatters.js";
import {ConfirmModal} from "/@/components/ConfirmModal";
import {useNotify} from "/@/components/notifications/NotificationProvider";

type Classification = "student" | "faculty" | "university_staff";
type PatientRecord = Record<string, FormDataEntryValue>;

const CLASSIFICATION_OPTIONS: {value: Classification; label: string}[] = [
    {value: "student", label: "Student"},
    {value: "faculty", label: "Faculty/Professor"},
    {value: "university_staff", label: "University Staff"},
];

const STAFF_POSITION_OPTIONS: string[] = [
    "Maintenance",
    "Security",
    "Other University Facilities",
];

const STAFF_ID_PATTERN = "UF-[0-9]{4}-[0-9]{3}";

const validateStaffId = (value: string): string =>
    /^UF-[0-9]{4}-[0-9]{3}$/.test(value) ? "" : "Use the format UF-2023-045";

const ID_FIELDS: Record<Classification, {
    label: string;
    placeholder: string;
    pattern: string;
    validate: (value: string) => string;
}> = {
    student: {
        label: "Student ID",
        placeholder: "20230786-S",
        pattern: "[0-9]{8}-S",
        validate: (value: string) => (/^[0-9]{8}-S$/.test(value) ? "" : "Use the format 20230786-S"),
    },
    faculty: {
        label: "Faculty/Professor ID",
        placeholder: "F-2023-045",
        pattern: FACULTY_ID_PATTERN,
        validate: validateFacultyId,
    },
    university_staff: {
        label: "University Staff ID",
        placeholder: "UF-2023-045",
        pattern: STAFF_ID_PATTERN,
        validate: validateStaffId,
    },
};

function PatientTypeToggle({value, onChange}: {value: Classification; onChange: (value: Classification) => void}) {
    return (
        <div role="radiogroup" className="inline-flex flex-wrap gap-2 rounded-xl border border-border bg-background p-1">
            {CLASSIFICATION_OPTIONS.map((option) => {
                const selected = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(option.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                            selected
                                ? "bg-primary text-white shadow-sm"
                                : "text-textSecondary hover:text-textPrimary"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export default function NewPatientRecordForm() {
    const {
        mutateAsync: savePatient,
        isPending: isSaving,
        error: saveError,
    } = useSavePatient();
    const notify = useNotify();

    const saveErrorMessage: FieldErrors = getFieldErrors(saveError);
    const [classification, setClassification] = useState<Classification>("student");
    const [idError, setIdError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [pendingRecord, setPendingRecord] = useState<PatientRecord | null>(null);

    const isStudent = classification === "student";
    const isFaculty = classification === "faculty";
    const isUniversityStaff = classification === "university_staff";
    const idField = ID_FIELDS[classification];
    const PasswordIcon = showPassword ? EyeOff : Eye;

    const handleBack = (): void => {
        window.history.back();
    };

    const handleClassificationChange = (value: Classification): void => {
        setClassification(value);
        setIdError("");
    };

    const handleIdBlur = (e: FocusEvent<HTMLInputElement>): void => {
        setIdError(idField.validate(e.target.value));
    };

    const handleIdChange = (): void => {
        if (idError) {
            setIdError("");
        }
    };

    const togglePassword = (): void => {
        setShowPassword((prev) => !prev);
    };

    const handleCancelConfirm = (): void => {
        setPendingRecord(null);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const record: PatientRecord = Object.fromEntries(
            new FormData(e.currentTarget).entries()
        );

        setPendingRecord(record);
    };

    const saveRecord = async (): Promise<void> => {
        const record = pendingRecord;
        setPendingRecord(null);
        if (!record) return;

        try {
            await savePatient(record);
            notify.success("The patient record was saved successfully.", {
                title: "Patient saved",
            });
            window.history.back();
        } catch (error) {
            console.error("Failed to create patient:", error);
            notify.error("The patient record could not be saved. Please check the highlighted fields and try again.", {
                title: "Save failed",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface p-8 shadow-lg"
        >
            <input type="hidden" name="classification" value={classification} />

            <div className="mb-8 flex items-center gap-3 border-b border-border pb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <UserPlus className="h-5 w-5 text-primary" strokeWidth={2}/>
                </div>

                <div>
                    <h1 className="font-heading text-xl font-semibold text-primaryDark">
                        New patient record
                    </h1>

                    <p className="mt-0.5 text-xs text-textMuted">
                        Enter the patient's personal and enrollment details.
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <PatientTypeToggle
                    value={classification}
                    onChange={handleClassificationChange}
                />
            </div>

            {Object.keys(saveErrorMessage).length > 0 && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <p>{getFieldErrorString(saveError)}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                    <FormInput
                        id="name"
                        name="name"
                        label="Name"
                        placeholder="Last name, First name, Middle name"
                        required
                        error={saveErrorMessage?.name}
                    />
                </div>

                <FormInput
                    id="patientId"
                    name="patient_id"
                    label={idField.label}
                    type="text"
                    placeholder={idField.placeholder}
                    pattern={idField.pattern}
                    required
                    error={idError}
                    onBlur={handleIdBlur}
                    onChange={handleIdChange}
                />

                <FormInput
                    id="birthday"
                    name="birthday"
                    label="Birthday"
                    type="date"
                    required
                    error={saveErrorMessage?.birthday}
                />

                <FormInput
                    id="mobileNumber"
                    name="mobile_number"
                    label="Mobile number"
                    type="tel"
                    placeholder="09XXXXXXXXX"
                    required
                    error={saveErrorMessage?.mobile_number}
                />

                <div>
                    <FormInput
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        required
                        minLength={8}
                    />

                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted transition-colors hover:text-textPrimary"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <PasswordIcon className="h-4 w-4"/>
                    </button>

                    <p className="mt-1 text-xs text-textMuted">
                        Must be at least 8 characters.
                    </p>
                </div>

                <FormInput
                    id="age"
                    name="age"
                    label="Age"
                    type="number"
                    placeholder="e.g. 20"
                    required
                    error={saveErrorMessage?.age}
                />

                <SelectField
                    id="sex"
                    name="sex"
                    label="Sex"
                    options={SEX_OPTIONS}
                    error={saveErrorMessage?.sex}
                />

                <SelectField
                    id="civil_status"
                    name="civil_status"
                    label="Civil status"
                    options={CIVIL_STATUS_OPTIONS}
                    error={saveErrorMessage?.civil_status}
                />
            </div>

            {isStudent && (
                <div className="mt-8 border-t border-border pt-6">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
                        Enrollment Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SelectField
                            id="course"
                            name="course"
                            label="Course"
                            options={COURSE_OPTIONS}
                            error={saveErrorMessage?.course_department}
                        />

                        <SelectField
                            id="year"
                            name="year"
                            label="Year"
                            options={YEAR_OPTIONS}
                            error={saveErrorMessage?.year}
                        />

                        <SelectField
                            id="section"
                            name="section"
                            label="Section"
                            options={SECTION_OPTIONS}
                            error={saveErrorMessage?.section}
                        />
                    </div>
                </div>
            )}

            {isFaculty && (
                <div className="mt-8 border-t border-border pt-6">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
                        Employment Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SelectField
                            id="department"
                            name="department"
                            label="Department"
                            options={DEPARTMENT_OPTIONS}
                            error={saveErrorMessage?.department}
                        />

                        <SelectField
                            id="position"
                            name="position"
                            label="Position"
                            options={POSITION_OPTIONS}
                            error={saveErrorMessage?.position}
                        />
                    </div>
                </div>
            )}

            {isUniversityStaff ? (
                <div className="mt-8 border-t border-border pt-6">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
                        Employment Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SelectField
                            id="position"
                            name="position"
                            label="Position"
                            options={STAFF_POSITION_OPTIONS}
                            error={saveErrorMessage?.position}
                        />
                    </div>
                </div>
            ) : null}

            <div className="mt-8 border-t border-border pt-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
                    RESIDENTIAL ADDRESS
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                        <FormInput
                            id="address"
                            name="address"
                            label="Address"
                            placeholder="House no., Street"
                            required
                            error={saveErrorMessage?.address}
                        />
                    </div>

                    <FormInput
                        id="barangay"
                        name="barangay"
                        label="Barangay"
                        placeholder="e.g. Brgy. 176"
                        required
                        error={saveErrorMessage?.barangay}
                    />
                </div>
            </div>

            <MedicalHistoryForm/>

            <div className="mt-6 flex items-start justify-center gap-1.5 text-center text-xs text-info">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2}/>
                <span>Please ensure all information is accurate before saving. This record will be stored in the system for future reference.</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-textPrimary disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2}/>
                    Back
                </button>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" strokeWidth={2}/>
                    {isSaving ? "Saving..." : "Save Record"}
                </button>
            </div>

            {pendingRecord !== null && (
                <ConfirmModal
                    title="Save patient record?"
                    message="Make sure all information is accurate. This record will be stored in the system for future reference."
                    confirmLabel="Save record"
                    onConfirm={saveRecord}
                    onCancel={handleCancelConfirm}
                />
            )}
        </form>
    );
}