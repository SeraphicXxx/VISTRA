import {useRef, useState, type FormEvent, type ChangeEvent, type ReactNode} from "react";
import {Save, ArrowLeft, ArrowRight, Check, ClipboardList, Info, FlaskConical, ImagePlus, X} from "lucide-react";
import {type as visitTypeOptions} from "./medicalData";
import {NOTIFY_PROFESSIONALS, type Professional} from "./notifyProfessor";
import {useForm} from "/@/hooks/Form";
import {statusEditFields} from "/@/components/editModal.jsx";
import {ReadOnlyField} from "/@/utils/ReadOnlyField";
import {StudentCombobox} from "/@/utils/StudentComboBox";
import {FieldLabel} from "/@/utils/FieldLabel";
import type {PatientProfile} from "/@/api/schema/PatientSchema";
import type {CreateMedicalVisit} from "/@/api/schema/MedicalSchema";
import {useCreateMedicalVisit} from "/@/hooks/query/MedicalQuery";
import {sessionManager} from "/@/utils/SessionManager";
import {getFieldErrors} from "/@/utils/Formatters";
import {treatmentTypeOptions} from "/@/types/types";
import {medicalStatuses, medicalTypes} from "/@/types/Medical";
import {ConfirmModal} from "/@/components/ConfirmModal";
import {NotifyProfessionalModal} from "/@/components/NotifyProfessorModal";
import {useNotify} from "/@/components/notifications/NotificationProvider";

const statusToEnum = Object.fromEntries(
    Object.entries(medicalStatuses).map(([key, label]) => [label, key])
);
const typeToEnum = Object.fromEntries(
    Object.entries(medicalTypes).map(([key, label]) => [label, key])
);

const statusField = statusEditFields.find(
    (field: { key: string }) => field.key === "status"
);
const statusOptions: string[] = statusField?.options ?? [];

interface PatientRecordFormProps {
    onSave?: (record: CreateMedicalVisit, notify: Professional | null) => void;
}

interface MedicalRecFormValues {
    selectedStudent: PatientProfile | null;
    visitType: string;
    treatmentType: string;
    status: string;
    visitDate: string;
    complaint: string;
    treatment: string;
}

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const initialFormValues: MedicalRecFormValues = {
    selectedStudent: null,
    visitType: "",
    treatmentType: "",
    status: "",
    visitDate: todayInputValue(),
    complaint: "",
    treatment: "",
};

const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-textPrimary transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const STEPS = [
    {
        title: "Patient",
        description: "Search for an existing student to load their information.",
    },
    {
        title: "Visit details",
        description: "Visit type, treatment type, status, and date.",
    },
    {
        title: "Clinical notes",
        description: "Complaint, findings, and the treatment given.",
    },
    {
        title: "Attachments",
        description: "Laboratory results and clinical photos, if any.",
    },
];

const LAST_STEP = STEPS.length - 1;

type StepperProps = {
    steps: {title: string; description: string}[];
    current: number;
    onStepClick: (index: number) => void;
};

function Stepper({steps, current, onStepClick}: StepperProps) {
    return (
        <nav aria-label="Form progress" className="mb-12">
            <ol className="flex items-start">
                {steps.map((step, index) => {
                    const done = index < current;
                    const active = index === current;
                    const isLast = index === steps.length - 1;

                    return (
                        <li key={step.title} className={`flex items-start ${isLast ? "" : "flex-1"}`}>
                            <button
                                type="button"
                                onClick={() => onStepClick(index)}
                                disabled={!done}
                                aria-current={active ? "step" : undefined}
                                className="group flex flex-col items-center gap-2 text-center disabled:cursor-default"
                            >
                                <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                                        done
                                            ? "border-primary bg-primary text-white group-hover:bg-primaryDark"
                                            : active
                                                ? "border-primary bg-white text-primary ring-4 ring-primary/15"
                                                : "border-border bg-white text-textMuted"
                                    }`}
                                >
                                    {done ? <Check className="h-4 w-4" strokeWidth={2.5}/> : index + 1}
                                </span>
                                <span
                                    className={`hidden whitespace-nowrap text-xs font-medium transition-colors duration-200 md:block ${
                                        active
                                            ? "text-textPrimary"
                                            : done
                                                ? "text-textSecondary"
                                                : "text-textMuted"
                                    }`}
                                >
                                    {step.title}
                                </span>
                            </button>

                            {!isLast && (
                                <span
                                    className={`mx-3 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                                        done ? "bg-primary" : "bg-border"
                                    }`}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            <p className="mt-5 text-center text-xs font-medium text-textMuted md:hidden">
                Step {current + 1} of {steps.length}: {steps[current].title}
            </p>
        </nav>
    );
}

function StepHeading({title, description}: {title: string; description: string}) {
    return (
        <div>
            <h3 className="font-heading text-lg font-semibold text-textPrimary">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-textMuted">{description}</p>
        </div>
    );
}

function FieldGroup({title, children}: {title: string; children: ReactNode}) {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <h4 className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary">
                    {title}
                </h4>
                <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                {children}
            </div>
        </section>
    );
}

interface AttachmentFieldProps {
    id: string;
    label: string;
    hint: string;
    accept: string;
    files: File[];
    onAdd: (files: File[]) => void;
    onRemove: (index: number) => void;
    icon: typeof FlaskConical;
}

function AttachmentField({id, label, hint, accept, files, onAdd, onRemove, icon: Icon}: AttachmentFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const selected = Array.from(e.target.files ?? []);
        if (selected.length) onAdd(selected);
        e.target.value = "";
    };

    return (
        <div>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center transition-colors duration-200 hover:border-primary/50 hover:bg-primary/5"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" strokeWidth={2}/>
                </span>
                <span className="text-sm font-medium text-textPrimary">Click to add files</span>
                <span className="text-xs text-textMuted">{hint}</span>
            </button>

            <input
                ref={inputRef}
                id={id}
                name={id}
                type="file"
                multiple
                accept={accept}
                onChange={handleChange}
                hidden
            />

            {files.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                    {files.map((file, index) => (
                        <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2"
                        >
                            <span className="truncate text-xs text-textPrimary">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                aria-label={`Remove ${file.name}`}
                                className="shrink-0 rounded-md p-1 text-textMuted transition-colors duration-200 hover:bg-background hover:text-textPrimary"
                            >
                                <X className="h-3.5 w-3.5" strokeWidth={2}/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function PatientRecordForm({onSave}: PatientRecordFormProps) {
    const {form, setField, reset} = useForm<MedicalRecFormValues>(initialFormValues);
    const {selectedStudent, visitType, treatmentType, status, visitDate, complaint, treatment} = form;
    const createMedicalVisitMutation = useCreateMedicalVisit();
    const notify = useNotify();
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepError, setStepError] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [labFiles, setLabFiles] = useState<File[]>([]);
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const details = selectedStudent
        ? {
            course: selectedStudent.course ?? selectedStudent.department ?? "N/A",
            address: selectedStudent.complete_address ?? "N/A",
            barangay: selectedStudent.barangay ?? "N/A",
            age: selectedStudent.age != null ? String(selectedStudent.age) : "N/A",
            mobile_number: selectedStudent.contact_no ?? "N/A",
            sex: selectedStudent.sex ?? "N/A",
            birthday: selectedStudent.birthday ?? "N/A",
            civil_status: selectedStudent.civil_status ?? "N/A",
            year_section:
                [selectedStudent.school_year, selectedStudent.section]
                    .filter(Boolean)
                    .join(" - ") || "N/A",
        }
        : null;

    // Returns a message if this step is incomplete, otherwise null.
    const getStepError = (index: number): string | null => {
        if (index === 0 && !selectedStudent) return "Select a student to continue.";
        if (index === 1) {
            if (!visitType) return "Select a visit type to continue.";
            if (!treatmentType) return "Select a treatment type to continue.";
            if (!status) return "Select a status to continue.";
            if (!visitDate) return "Choose a visit date to continue.";
        }
        return null;
    };

    const goToStep = (index: number): void => {
        setStepError(null);
        setStepIndex(index);
    };

    const goNext = (): void => {
        const error = getStepError(stepIndex);
        if (error) {
            setStepError(error);
            return;
        }
        goToStep(Math.min(stepIndex + 1, LAST_STEP));
    };

    const handleBack = (): void => {
        if (stepIndex === 0) {
            if (typeof window !== "undefined") window.history.back();
            return;
        }
        goToStep(stepIndex - 1);
    };

    const handleClear = (): void => {
        reset();
        setLabFiles([]);
        setPhotoFiles([]);
        goToStep(0);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setFieldErrors({});

        // Pressing Enter on an earlier step moves forward instead of saving.
        if (stepIndex !== LAST_STEP) {
            goNext();
            return;
        }

        for (let i = 0; i < LAST_STEP; i++) {
            if (getStepError(i)) {
                goToStep(i);
                setStepError(getStepError(i));
                return;
            }
        }

        if (!selectedStudent) {
            notify.warning("Please select a student before saving the record.", {
                title: "No student selected",
            });
            return;
        }

        setIsConfirmOpen(true);
    };

    const handleConfirmSave = (): void => {
        setIsConfirmOpen(false);
        setIsNotifyOpen(true);
    };

    const buildRecord = (): CreateMedicalVisit | null => {
        if (!selectedStudent) return null;
        setFieldErrors({});
        if (!selectedStudent) return null;

        const staffId = sessionManager.getUser()?.user_id ?? "";
        if (!staffId) {
            console.error("Failed to create medical visit: no staff session found.");
            notify.error("Your staff session was not found. Please log in again.", {
                title: "Session not found",
            });
            return null;
        }

        return {
            patient_id: selectedStudent.patient_id,
            staff_id: staffId,
            status: statusToEnum[status] ?? status,
            type: typeToEnum[visitType] ?? visitType,
            treatment_type: treatmentType,
            visit_date: visitDate ? new Date(visitDate).toISOString() : new Date().toISOString(),
            complaint,
            treatment,
        };
    };

    const persistRecord = (notifyProfessor: Professional | null): void => {
        const record = buildRecord();
        if (!record) return;

        if (onSave) onSave(record, notifyProfessor);

        createMedicalVisitMutation.mutate(record, {
            onSuccess: () => {
                notify.success("The medical record was saved successfully.", {
                    title: "Record saved",
                });
                handleClear();
                handleBack();
            },
            onError: (error) => {
                console.error("Failed to create medical visit:", getFieldErrors(error));
                notify.error("The medical record could not be saved. Please try again.", {
                    title: "Save failed",
                });
                const nextErrors: Record<string, string> = {};
                const detail = (error as any)?.detail;
                if (Array.isArray(detail)) {
                    detail.forEach((item: any) => {
                        const field = item?.loc?.[item.loc.length - 1];
                        if (field) nextErrors[field] = "Missing field";
                    });
                } else if (typeof detail === "string") {
                    nextErrors.form = "Missing field";
                } else {
                    nextErrors.form = "Missing field";
                }
                setFieldErrors(nextErrors);
            },
        });
    };

    const handleNotify = async (professional: Professional, message: string): Promise<void> => {
        setIsNotifyOpen(false);
        const record = buildRecord();
        if (!record) return;

        try {
            await createMedicalVisitMutation.mutateAsync(record);
            notify.success("The medical record was saved successfully.", {
                title: "Record saved",
            });
            handleClear();
            handleBack();
        } catch (error) {
            console.error("Failed to create medical visit:", getFieldErrors(error));
            notify.error("The medical record could not be saved. Please try again.", {
                title: "Save failed",
            });
        }
    };

    const handleSkipNotify = (): void => {
        setIsNotifyOpen(false);
        persistRecord(null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-10"
        >
            <div className="mb-10 flex items-center gap-3">
                <div>
                    <h1 className="font-heading text-xl font-semibold text-primaryDark">Patient Medical Record</h1>
                    <p className="mt-0.5 text-xs text-textMuted">To be completed by the attending doctor or nurse.</p>
                </div>
            </div>

            <Stepper steps={STEPS} current={stepIndex} onStepClick={goToStep} />

            {/* Step 1: Patient */}
            {stepIndex === 0 && (
                <div className="space-y-10">
                    <StepHeading title={STEPS[0].title} description={STEPS[0].description} />

                    {!selectedStudent && (
                        <div className="flex items-start gap-1.5 rounded-xl border border-info/30 bg-info/5 px-3.5 py-2.5 text-xs text-info">
                            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2}/>
                            <span>Search and select an existing student to auto-fill their personal information. If the student is not found, please add them first.</span>
                        </div>
                    )}

                    <FieldGroup title="Student">
                        <StudentCombobox selectedStudent={selectedStudent} onSelect={(student) => setField("selectedStudent", student)}/>
                    </FieldGroup>

                    <FieldGroup title="Personal information">
                        <ReadOnlyField id="course" label="Course" value={details?.course} placeholder="Select a student first"/>
                        <ReadOnlyField id="address" label="Address" value={details?.address} placeholder="Select a student first"/>
                        <ReadOnlyField id="barangay" label="Barangay" value={details?.barangay} placeholder="Select a student first"/>
                        <ReadOnlyField id="age" label="Age" value={details?.age} placeholder="Select a student first"/>
                        <ReadOnlyField id="mobile_number" label="Mobile Number" value={details?.mobile_number} placeholder="Select a student first"/>
                        <ReadOnlyField id="sex" label="Sex" value={details?.sex} placeholder="Select a student first"/>
                        <ReadOnlyField id="birthday" label="Birthday" value={details?.birthday} placeholder="Select a student first"/>
                        <ReadOnlyField id="civil_status" label="Civil Status" value={details?.civil_status} placeholder="Select a student first"/>
                        <ReadOnlyField id="year_section" label="Year and Section" value={details?.year_section} placeholder="Select a student first"/>
                    </FieldGroup>
                </div>
            )}

            {/* Step 2: Visit details */}
            {stepIndex === 1 && (
                <div className="space-y-10">
                    <StepHeading title={STEPS[1].title} description={STEPS[1].description} />

                    <FieldGroup title="Visit">
                        <div>
                            <FieldLabel htmlFor="type">Type</FieldLabel>
                            <select
                                id="type"
                                name="type"
                                value={visitType}
                                onChange={(e) => setField("visitType", e.target.value)}
                                className={inputClass}
                            >
                                <option value="" disabled>Select Type</option>
                                {visitTypeOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel htmlFor="treatmentType">Treatment Type</FieldLabel>
                            <select
                                id="treatmentType"
                                name="treatmentType"
                                value={treatmentType}
                                onChange={(e) => setField("treatmentType", e.target.value)}
                                className={inputClass}
                            >
                                <option value="" disabled>Select Treatment Type</option>
                                {treatmentTypeOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <select
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => setField("status", e.target.value)}
                                className={inputClass}
                            >
                                <option value="" disabled>Select Status</option>
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel htmlFor="visitDate">Visit Date</FieldLabel>
                            <input
                                id="visitDate"
                                name="visitDate"
                                type="date"
                                value={visitDate}
                                onChange={(e) => setField("visitDate", e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </FieldGroup>
                </div>
            )}

            {/* Step 3: Clinical notes */}
            {stepIndex === 2 && (
                <div className="space-y-10">
                    <StepHeading title={STEPS[2].title} description={STEPS[2].description} />

                    <FieldGroup title="Notes">
                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="complaint">Complaint / Findings</FieldLabel>
                            <textarea
                                id="complaint"
                                name="complaint"
                                value={complaint}
                                onChange={(e) => setField("complaint", e.target.value)}
                                placeholder="e.g. Fever, headache since morning"
                                rows={4}
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <FieldLabel htmlFor="treatment">Treatment</FieldLabel>
                            <textarea
                                id="treatment"
                                name="treatment"
                                value={treatment}
                                onChange={(e) => setField("treatment", e.target.value)}
                                placeholder="e.g. Paracetamol 500mg, rest advised"
                                rows={4}
                                className={inputClass}
                            />
                        </div>
                    </FieldGroup>
                </div>
            )}

            {/* Step 4: Attachments */}
            {stepIndex === 3 && (
                <div className="space-y-10">
                    <StepHeading title={STEPS[3].title} description={STEPS[3].description} />

                    <FieldGroup title="Files">
                        <AttachmentField
                            id="laboratoryResults"
                            label="Laboratory Results"
                            hint="Images or PDF, up to 10 MB each"
                            accept="image/*,application/pdf"
                            files={labFiles}
                            onAdd={(files) => setLabFiles((prev) => [...prev, ...files])}
                            onRemove={(index) => setLabFiles((prev) => prev.filter((_, i) => i !== index))}
                            icon={FlaskConical}
                        />

                        <AttachmentField
                            id="clinicalPhotos"
                            label="Clinical Photos"
                            hint="Images only, up to 10 MB each"
                            accept="image/*"
                            files={photoFiles}
                            onAdd={(files) => setPhotoFiles((prev) => [...prev, ...files])}
                            onRemove={(index) => setPhotoFiles((prev) => prev.filter((_, i) => i !== index))}
                            icon={ImagePlus}
                        />
                    </FieldGroup>

                    <div className="flex items-start justify-center gap-1.5 text-center text-xs text-info">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2}/>
                        <span>Please ensure all information is accurate before saving. This record will be stored in the system for future reference.</span>
                    </div>
                </div>
            )}

            {stepError && (
                <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {stepError}
                </p>
            )}

            {Object.keys(fieldErrors).length > 0 && (
                <p className="mt-4 text-xs text-red-600">Some details could not be saved. Please review and try again.</p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-textPrimary"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2}/>
                    {stepIndex === 0 ? "Back" : "Previous"}
                </button>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-textPrimary"
                    >
                        Clear
                    </button>

                    {stepIndex < LAST_STEP ? (
                        <button
                            type="button"
                            onClick={goNext}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark"
                        >
                            Continue
                            <ArrowRight className="h-4 w-4" strokeWidth={2}/>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!selectedStudent || createMedicalVisitMutation.isPending}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
                        >
                            <Save className="h-4 w-4" strokeWidth={2}/>
                            {createMedicalVisitMutation.isPending ? "Saving..." : "Save record"}
                        </button>
                    )}
                </div>
            </div>

            {isConfirmOpen && (
                <ConfirmModal
                    title="Save medical record?"
                    message="Make sure all information is accurate. This record will be stored in the system for future reference."
                    confirmLabel="Save record"
                    onConfirm={handleConfirmSave}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}

            {isNotifyOpen && (
                <NotifyProfessionalModal
                    professionals={NOTIFY_PROFESSIONALS}
                    defaultMessage="A medical record was saved. Please review it at your earliest convenience."
                    onSend={handleNotify}
                    onSkip={handleSkipNotify}
                    onCancel={() => setIsNotifyOpen(false)}
                />
            )}
        </form>
    );
}