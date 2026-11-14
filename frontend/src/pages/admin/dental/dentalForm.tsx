import {useState, type FormEvent} from "react";
import {ArrowLeft, ArrowRight, Check, Plus, Save, Stethoscope, Info, X} from "lucide-react";
import {FieldLabel} from "/@/utils/FieldLabel.jsx";
import {ToothArch, upperTeeth, lowerTeeth} from "/@/components/teethDesign.jsx";
import {FormInput} from "/@/components/InputCollection.jsx";
import {CheckboxRow} from "/@/utils/CheckboxRow.jsx";
import {StudentInfoSection} from "/@/components/StudentInfoSection.jsx";
import {ToothNoteModal} from "/@/components/dental/ToothForm";
import {useDentalRecordForm} from "/@/hooks/DentalForms";
import {getFieldErrors} from "/@/utils/Formatters";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "/@/config/RoutePaths";
import {useCreateDentalVisit} from "/@/hooks/query/DentalQuery";
import {CreateDentalVisit} from "/@/api/schema/DentalSchema";
import {statusEditFields} from "/@/components/editModal.jsx";
import {useNotify} from "/@/components/notifications/NotificationProvider";
import {NotifyProfessionalModal} from "/@/components/NotifyProfessorModal";
import {NOTIFY_PROFESSIONALS, type MedicalNotification} from "/@/pages/admin/medical/notifyProfessor";

const statusOptions = statusEditFields.find((f) => f.key === "status")?.options ?? [];

const medicalHistoryItems = ["Allergy", "Asthma", "Bleeder", "Diabetes", "Epilepsy", "Heart Disease", "Hypertension", "Others"];

const oralStatusRows = ["Date of Oral Examination", "Dental Caries", "Gingivitis / Periodontal Disease", "Debris", "Calculus", "Cleft Lip / Palate", "Others (Supernumerary/Mesiodens)", "No. of Permanent Teeth Present", "No. of Permanent Sound Present", "No. of Decayed Teeth (D)", "No. of Missing Teeth (M)", "No. of Filled Teeth (F)", "No. of Teeth for Extraction (X)", "No. of DMFX Teeth", "No. of Temporary Teeth Present"];

// Rename these to match the column headings on the paper form.
const oralStatusColumns = ["Age", "Age", "Age", "Age"];

const dentalStudentFields = [
    {id: "age", label: "Age"},
    {id: "sex", label: "Gender"},
    {id: "year_section", label: "Year and section / course / department", span: "sm:col-span-3"},
];

const STEPS = [
    {
        title: "Student",
        description: "Select the student and enter the visit date.",
    },
    {
        title: "Dental habits",
        description: "Dentist visits, brushing, and flossing.",
    },
    {
        title: "Odontogram",
        description: "Click a tooth to record its condition and notes.",
    },
    {
        title: "Condition & history",
        description: "Calculus, medication, notes, and medical history.",
    },
    {
        title: "Oral health status",
        description: "Examination results for each item you add.",
    },
];

const LAST_STEP = STEPS.length - 1;

interface DentalRecordFormProps {
    onSave?: (record: CreateDentalVisit, notification: MedicalNotification | null) => void;
}

const inputClass =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

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
                                    className={`hidden whitespace-nowrap text-xs font-medium transition-colors duration-200 lg:block ${
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

            <p className="mt-5 text-center text-xs font-medium text-textMuted lg:hidden">
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

function SectionLabel({title}: {title: string}) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <h4 className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary">
                {title}
            </h4>
            <span className="h-px flex-1 bg-border" />
        </div>
    );
}

function DentalConditionSection() {
    return (
        <section className="space-y-6">
            <SectionLabel title="Condition" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div>
                    <FieldLabel htmlFor="calculus_severity">Calculus</FieldLabel>
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        {["Light", "Moderate", "Heavy"].map((option) => (
                            <label key={option} className="flex items-center gap-1.5 text-sm text-textPrimary">
                                <input type="radio" name="calculus_severity" value={option}
                                       className="h-4 w-4 border-border text-primary focus:ring-primary/30"/>
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <FormInput
                    id="current_medications"
                    name="current_medications"
                    label="Medication"
                    placeholder="List current medications"
                />
            </div>

            <div>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>

                <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Additional observations"
                    className={inputClass}
                />
            </div>
        </section>
    );
}

function MedicalHistorySection() {
    return (
        <section>
            <SectionLabel title="Medical history" />

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {medicalHistoryItems.map((item) => (
                    <CheckboxRow
                        key={item}
                        label={item}
                    />
                ))}
            </div>
        </section>
    );
}

function TemporaryLegend() {
    return (
        <div>
            <p className="mb-4 font-semibold uppercase tracking-wide text-primary">
                Temporary
            </p>

            <ul className="space-y-1 text-textPrimary">
                <li>/</li>
                <li>d</li>
                <li>f</li>
                <li>m</li>
                <li>x</li>
                <li>un</li>
                <li>s</li>
                <li>jc</li>
                <li>p</li>
            </ul>

            <div className="mt-4 space-y-0.5 text-textSecondary">
                <p>S — Sealant</p>
                <p>PF — Permanent fill</p>
                <p>TF — Temporary fill</p>
                <p>X — Extracted</p>
            </div>
        </div>
    );
}

function PermanentLegend() {
    return (
        <div>
            <p className="mb-4 font-semibold uppercase tracking-wide text-primary">
                Permanent
            </p>

            <ul className="space-y-1 text-textPrimary">
                <li>/ — Sound</li>
                <li>D — Decayed</li>
                <li>F — Filled</li>
                <li>M — Missing</li>
                <li>X — Indicated for extraction</li>
                <li>Un — Unerupted</li>
                <li>Sn — Supernumerary tooth</li>
                <li>JC — Jacket crown</li>
                <li>P — Pontic</li>
            </ul>

            <div className="mt-4 space-y-0.5 text-textSecondary">
                <p>Decayed — red</p>
                <p>Perm. filling — blue</p>
            </div>
        </div>
    );
}

function OdontogramLegend() {
    return (
        <div className="mt-6 grid grid-cols-1 gap-6 rounded-xl border border-border p-5 text-xs sm:grid-cols-2">
            <PermanentLegend/>
            <TemporaryLegend/>
        </div>
    );
}

interface OdontogramSectionProps {
    records: Record<string, unknown>;
    onToothClick: (toothNumber: number) => void;
}

function OdontogramSection({
                               records,
                               onToothClick,
                           }: OdontogramSectionProps) {
    return (
        <section>
            <SectionLabel title="Odontogram" />

            <p className="mb-5 text-xs text-textMuted">
                Click a tooth to record its dentition, condition, and notes.
            </p>

            <div className="overflow-x-auto rounded-xl border border-border bg-background/40 p-6">
                <div className="mb-2 flex justify-center">
                    <ToothArch
                        teeth={upperTeeth}
                        flip={false}
                        records={records}
                        onToothClick={onToothClick}
                    />
                </div>

                <div className="mx-auto my-3 h-px w-full max-w-2xl bg-border"/>

                <div className="mt-2 flex justify-center">
                    <ToothArch
                        teeth={lowerTeeth}
                        flip={true}
                        records={records}
                        onToothClick={onToothClick}
                    />
                </div>
            </div>

            <OdontogramLegend/>
        </section>
    );
}

function DentalRecordHeader() {
    return (
        <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Stethoscope
                    className="h-5 w-5 text-primary"
                    strokeWidth={2}
                />
            </div>

            <div>
                <h1 className="font-heading text-xl font-semibold text-primaryDark">
                    Dental record chart
                </h1>

                <p className="mt-0.5 text-xs text-textMuted">
                    University of Caloocan City — Biglang Awa St., 12th Avenue,
                    Caloocan City
                </p>
            </div>
        </div>
    );
}

function DentalHabitsSection() {
    return (
        <section className="space-y-6">
            <SectionLabel title="Dental habits" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div>
                    <FieldLabel htmlFor="last_dental_visit">
                        When was the last time you visited a dentist?
                    </FieldLabel>

                    <input
                        id="last_dental_visit"
                        name="last_dental_visit"
                        type="text"
                        placeholder="e.g. 6 months ago"
                        className={inputClass}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <select
                        id="status"
                        name="status"
                        defaultValue=""
                        className={inputClass}
                    >
                        <option value="" disabled>Select Status</option>
                        {statusOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <FieldLabel htmlFor="floss">
                        Do you floss?
                    </FieldLabel>

                    <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-1.5 text-sm text-textPrimary">
                            <input
                                type="radio"
                                name="floss"
                                value="true"
                                className="h-4 w-4 border-border text-primary focus:ring-primary/30"
                            />
                            Yes
                        </label>

                        <label className="flex items-center gap-1.5 text-sm text-textPrimary">
                            <input
                                type="radio"
                                name="floss"
                                value="false"
                                className="h-4 w-4 border-border text-primary focus:ring-primary/30"
                            />
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <FieldLabel htmlFor="brushing_frequency">
                        How often do you brush your teeth?
                    </FieldLabel>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        {["1x", "2x", "3-4x/day"].map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-1.5 text-sm text-textPrimary"
                            >
                                <input
                                    type="radio"
                                    name="brushing_frequency"
                                    value={option}
                                    className="h-4 w-4 border-border text-primary focus:ring-primary/30"
                                />

                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function OralHealthStatusSection() {
    const [addedRows, setAddedRows] = useState<string[]>([]);
    const [pickedRow, setPickedRow] = useState<string>("");

    // Items already added are removed from the dropdown.
    const availableRows = oralStatusRows.filter((row) => !addedRows.includes(row));

    const handleAdd = (): void => {
        if (!pickedRow) return;
        setAddedRows((prev) => [...prev, pickedRow]);
        setPickedRow("");
    };

    const handleRemove = (row: string): void => {
        setAddedRows((prev) => prev.filter((item) => item !== row));
    };

    return (
        <section>
            <SectionLabel title="Oral health status" />

            <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                    <FieldLabel htmlFor="oralItem">Add an item</FieldLabel>
                    <select
                        id="oralItem"
                        value={pickedRow}
                        onChange={(e) => setPickedRow(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Select an item</option>
                        {availableRows.map((row) => (
                            <option key={row} value={row}>{row}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!pickedRow}
                    className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Plus className="h-4 w-4" strokeWidth={2}/>
                    Add
                </button>
            </div>

            {addedRows.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-textMuted">
                    No items added yet. Choose an item above to record it.
                </p>
            ) : (
                <div className="mt-4 space-y-2">
                    {addedRows.map((row) => {
                        const fieldName = row
                            .toLowerCase()
                            .replace(/[()./]/g, "")
                            .replace(/[^a-z0-9]+/g, "_")
                            .replace(/^_|_$/g, "");
                        const isDateRow = row.startsWith("Date");

                        return (
                            <div key={row} className="rounded-lg border border-border bg-surface px-3 py-2.5">
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-textPrimary">{row}</p>

                                    <button
                                        type="button"
                                        onClick={() => handleRemove(row)}
                                        aria-label={`Remove ${row}`}
                                        className="rounded-md p-1 text-textMuted transition-colors duration-200 hover:bg-background hover:text-textPrimary"
                                    >
                                        <X className="h-3.5 w-3.5" strokeWidth={2}/>
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 gap-1.5">
                                    {oralStatusColumns.map((label, index) => {
                                        const column = index + 1;
                                        const inputId = `${fieldName}_${column}`;

                                        return (
                                            <div key={column} className="min-w-0">
                                                <label
                                                    htmlFor={inputId}
                                                    className="mb-1 block truncate text-center text-[10px] font-semibold uppercase tracking-wide text-textMuted"
                                                >
                                                    {label}
                                                </label>
                                                <input
                                                    id={inputId}
                                                    name={inputId}
                                                    type={isDateRow ? "date" : "text"}
                                                    className="h-8 w-full rounded-md border border-border bg-background px-1.5 text-center text-xs text-textPrimary transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default function DentalRecordForm({onSave}: DentalRecordFormProps) {
    const navigate = useNavigate();
    const {
        selectedStudent,
        setSelectedStudent,

        selectedTooth,
        toothRecords,

        openTooth,
        closeTooth,
        saveTooth,
        clearTooth,
    } = useDentalRecordForm();

    const [pendingRecord, setPendingRecord] = useState<CreateDentalVisit | null>(null);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepError, setStepError] = useState<string | null>(null);
    const notify = useNotify();

    const handleBack = () => {
        window.history.back();
    };

    const createDentalVisitMutation = useCreateDentalVisit();

    const goToStep = (index: number): void => {
        setStepError(null);
        setStepIndex(index);
    };

    const goNext = (): void => {
        if (stepIndex === 0 && selectedStudent === null) {
            setStepError("Select a student to continue.");
            return;
        }
        goToStep(Math.min(stepIndex + 1, LAST_STEP));
    };

    const handlePrevious = (): void => {
        if (stepIndex === 0) {
            handleBack();
            return;
        }
        goToStep(stepIndex - 1);
    };

    const persistRecord = (
        record: CreateDentalVisit,
        notification: MedicalNotification | null
    ) => {
        onSave?.(record, notification);

        createDentalVisitMutation.mutate(record, {
            onSuccess: () => {
                notify.success("The dental record was saved successfully.", {
                    title: "Record saved",
                });
            },
            onError: (error) => {
                console.error("Failed to create dental visit:", getFieldErrors(error));
                notify.error("The dental record could not be saved. Please try again.", {
                    title: "Save failed",
                });
            },
        });

        setPendingRecord(null);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Pressing Enter on an earlier step moves forward instead of saving.
        if (stepIndex !== LAST_STEP) {
            goNext();
            return;
        }

        if (selectedStudent === null) {
            goToStep(0);
            setStepError("Select a student before saving the record.");
            return;
        }

        const formData = Object.fromEntries(
            new FormData(e.currentTarget).entries()
        );

        const record: CreateDentalVisit = {
            last_dental_visit: String(formData.last_dental_visit ?? ""),
            brushing_frequency: String(formData.brushing_frequency ?? ""),
            floss: formData.floss === "true",
            calculus_severity: String(formData.calculus_severity ?? ""),
            current_medications: String(formData.current_medications ?? ""),
            status: String(formData.status ?? ""),
            notes: String(formData.notes ?? ""),
            patient_id: selectedStudent.patient_id,
            tooth_records: Object.values(toothRecords),
        };

        const visitDate = String(formData.date ?? "") || new Date().toISOString().slice(0, 10);

        setNotifyMessage(
            `A dental record was saved for ${selectedStudent.patient_id} on ${visitDate}. Please review it at your earliest convenience.`
        );
        setPendingRecord(record);
    };

    const handleSendNotification = async (
        professional: MedicalNotification["professional"],
        message: string
    ): Promise<void> => {
        if (!pendingRecord) return;

        const record = pendingRecord;
        setPendingRecord(null);

        try {
            await createDentalVisitMutation.mutateAsync(record);
            notify.success("The dental record was saved successfully.", {
                title: "Record saved",
            });
            handleBack();
        } catch (error) {
            console.error("Failed to create dental visit:", getFieldErrors(error));
            notify.error("The dental record could not be saved. Please try again.", {
                title: "Save failed",
            });
        }
    };

    const handleSkipNotify = () => {
        if (!pendingRecord) return;

        persistRecord(pendingRecord, null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-10"
        >
            <DentalRecordHeader />

            <Stepper steps={STEPS} current={stepIndex} onStepClick={goToStep} />

            {/* All steps stay mounted (hidden when inactive) so the form values are kept. */}

            {/* Step 1: Student */}
            <div className={stepIndex === 0 ? "space-y-10" : "hidden"}>
                <StepHeading title={STEPS[0].title} description={STEPS[0].description} />

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-4">
                    <StudentInfoSection
                        selectedStudent={selectedStudent}
                        onSelect={setSelectedStudent}
                        fields={dentalStudentFields}
                    />

                    <FormInput
                        id="date"
                        name="date"
                        label="Date"
                        type="date"
                    />
                </div>
            </div>

            {/* Step 2: Dental habits */}
            <div className={stepIndex === 1 ? "space-y-10" : "hidden"}>
                <StepHeading title={STEPS[1].title} description={STEPS[1].description} />
                <DentalHabitsSection />
            </div>

            {/* Step 3: Odontogram */}
            <div className={stepIndex === 2 ? "space-y-10" : "hidden"}>
                <StepHeading title={STEPS[2].title} description={STEPS[2].description} />
                <OdontogramSection
                    records={toothRecords}
                    onToothClick={openTooth}
                />
            </div>

            {/* Step 4: Condition and medical history */}
            <div className={stepIndex === 3 ? "space-y-10" : "hidden"}>
                <StepHeading title={STEPS[3].title} description={STEPS[3].description} />
                <DentalConditionSection />
                <MedicalHistorySection />
            </div>

            {/* Step 5: Oral health status */}
            <div className={stepIndex === 4 ? "space-y-10" : "hidden"}>
                <StepHeading title={STEPS[4].title} description={STEPS[4].description} />
                <OralHealthStatusSection />

                <div className="flex items-start justify-center gap-1.5 text-center text-xs text-info">
                    <Info
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        strokeWidth={2}
                    />

                    <span>
                        Please ensure all information is accurate before saving.
                        This record will be stored in the system for future
                        reference.
                    </span>
                </div>
            </div>

            {stepError && (
                <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {stepError}
                </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
                <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-textPrimary"
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        strokeWidth={2}
                    />

                    {stepIndex === 0 ? "Back" : "Previous"}
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
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark"
                    >
                        <Save
                            className="h-4 w-4"
                            strokeWidth={2}
                        />

                        Save record
                    </button>
                )}
            </div>

            {selectedTooth !== null && (
                <ToothNoteModal
                    toothNumber={selectedTooth}
                    initialRecord={toothRecords[selectedTooth]}
                    onSubmit={saveTooth}
                    onClear={clearTooth}
                    onClose={closeTooth}
                />
            )}

            {pendingRecord && (
                <NotifyProfessionalModal
                    professionals={NOTIFY_PROFESSIONALS}
                    defaultMessage={notifyMessage}
                    onSend={handleSendNotification}
                    onSkip={handleSkipNotify}
                    onCancel={() => setPendingRecord(null)}
                />
            )}
        </form>
    );
}