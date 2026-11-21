import {useRef, useState, type FormEvent, type FocusEvent} from "react";
import {ArrowLeft, ArrowRight, Save, UserPlus, Info} from "lucide-react";
import {FormInput, SelectField} from "/@/components/InputCollection.jsx";
import {
    COURSE_OPTIONS,
    YEAR_OPTIONS,
    SECTION_OPTIONS,
    SEX_OPTIONS,
    CIVIL_STATUS_OPTIONS,
    EMERGENCY_RELATIONSHIP_OPTIONS,
    OTHER_OPTION,
    POSITION_OPTIONS,
    DEPARTMENT_OPTIONS,
} from "/@/utils/NewPatientUtils.jsx";
import {calculateAge} from "/@/components/register/RegisterDetails";
import MedicalHistoryForm from "/@/components/MedicalHistoryForm";
import {useSavePatient} from "/@/hooks/SavePatient";
import {getFieldErrors, FieldErrors, getFieldErrorString} from "/@/utils/Formatters.js";
import {ConfirmModal} from "/@/components/ConfirmModal";
import {useNotify} from "/@/components/notifications/NotificationProvider";
import {
    BIRTHDAY_ERROR,
    STAFF_POSITION_OPTIONS,
    ID_FIELDS,
    type Classification,
    type FormControl,
    type PatientRecord,
} from "/@/components/patients/newRecord/newPatientConstants";
import {Stepper, StepHeading, FieldGroup, PatientTypeToggle} from "/@/components/patients/newRecord/PatientFormParts";
import {PasswordField} from "/@/components/patients/newRecord/PasswordField";
import {CourseSelect} from "/@/components/patients/newRecord/CourseSelect";

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
    const [pendingRecord, setPendingRecord] = useState<PatientRecord | null>(null);
    const [birthday, setBirthday] = useState<string>("");
    const [emergencyRelation, setEmergencyRelation] = useState<string>("");
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [stepError, setStepError] = useState<string | null>(null);

    // Every step stays mounted (hidden when not active) so typed values are kept.
    const stepEls = useRef<(HTMLDivElement | null)[]>([]);
    const setStepRef = (index: number) => (el: HTMLDivElement | null) => {
        stepEls.current[index] = el;
    };

    const isStudent = classification === "student";
    const isFaculty = classification === "faculty";
    const isUniversityStaff = classification === "university_staff";
    const idField = ID_FIELDS[classification];

    // Age is calculated from the birthday, so it is never typed by hand.
    const ageValue = (() => {
        const age = calculateAge(birthday);
        return age === null ? "" : String(age);
    })();
    const birthdayInvalid = birthday !== "" && calculateAge(birthday) === null;

    const steps = [
        {
            title: "Personal information",
            description: "Basic details and contact information for the patient.",
        },
        {
            title: isStudent ? "Enrollment" : "Employment",
            description: isStudent
                ? "Course, year level, and section."
                : "Department and position.",
        },
        {
            title: "Address",
            description: "Where the patient currently lives.",
        },
        {
            title: "Emergency contact",
            description: "Someone we can reach in case of an emergency.",
        },
        {
            title: "Medical history",
            description: "Health background and recent examination results.",
        },
    ];
    const LAST_STEP = steps.length - 1;

    const getStepControls = (index: number): FormControl[] => {
        const container = stepEls.current[index];
        if (!container) return [];
        return Array.from(container.querySelectorAll<FormControl>("input, select"));
    };

    // Returns the first step that has an invalid field, or -1 if all are valid.
    const findInvalidStep = (): number => {
        for (let i = 0; i <= LAST_STEP; i++) {
            if (getStepControls(i).some((field) => !field.checkValidity())) return i;
        }
        return -1;
    };

    const goNext = (): void => {
        if (stepIndex === 0 && birthdayInvalid) {
            setStepError(BIRTHDAY_ERROR);
            return;
        }

        const invalid = getStepControls(stepIndex).find((field) => !field.checkValidity());
        if (invalid) {
            invalid.reportValidity();
            setStepError("Complete the highlighted fields to continue.");
            return;
        }
        setStepError(null);
        setStepIndex((i) => Math.min(i + 1, LAST_STEP));
    };

    const goToStep = (index: number): void => {
        setStepError(null);
        setStepIndex(index);
    };

    const handleBack = (): void => {
        if (stepIndex === 0) {
            window.history.back();
            return;
        }
        goToStep(stepIndex - 1);
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

    const handleCancelConfirm = (): void => {
        setPendingRecord(null);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // Pressing Enter on an earlier step moves forward instead of saving.
        if (stepIndex !== LAST_STEP) {
            goNext();
            return;
        }

        const invalidStep = findInvalidStep();
        if (invalidStep >= 0) {
            goToStep(invalidStep);
            setStepError("Some details are missing. Complete the highlighted fields.");
            return;
        }

        if (birthdayInvalid) {
            goToStep(0);
            setStepError(BIRTHDAY_ERROR);
            return;
        }

        const record: PatientRecord = Object.fromEntries(
            new FormData(e.currentTarget).entries()
        );

        // "Other" relationship: send the typed text as emergency_relation instead.
        if (record.emergency_relation === OTHER_OPTION) {
            record.emergency_relation = String(record.emergency_relation_other ?? "").trim();
        }
        delete record.emergency_relation_other;

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
            noValidate
            className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-10"
        >
            <input type="hidden" name="classification" value={classification} />

            <div className="mb-10 flex items-center gap-3">
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

            <Stepper steps={steps} current={stepIndex} onStepClick={goToStep} />

            {Object.keys(saveErrorMessage).length > 0 && (
                <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <p>{getFieldErrorString(saveError)}</p>
                </div>
            )}

            {/* Step 1: Personal information */}
            <div ref={setStepRef(0)} className={stepIndex === 0 ? "space-y-10" : "hidden"}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <StepHeading title={steps[0].title} description={steps[0].description} />

                    <PatientTypeToggle
                        value={classification}
                        onChange={handleClassificationChange}
                    />
                </div>

                <FieldGroup title="Full name">
                    <FormInput
                        id="lastName"
                        name="last_name"
                        label="Last name"
                        placeholder="e.g. Dela Cruz"
                        required
                        error={saveErrorMessage?.last_name}
                    />

                    <FormInput
                        id="firstName"
                        name="first_name"
                        label="First name"
                        placeholder="e.g. Juan"
                        required
                        error={saveErrorMessage?.first_name}
                    />

                    <FormInput
                        id="middleName"
                        name="middle_name"
                        label="Middle name"
                        placeholder="Optional"
                        error={saveErrorMessage?.middle_name}
                    />
                </FieldGroup>

                <FieldGroup title="Identification & contact">
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
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        error={birthdayInvalid ? BIRTHDAY_ERROR : saveErrorMessage?.birthday}
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
                </FieldGroup>

                <FieldGroup title="Personal details">
                    <div>
                        <FormInput
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            placeholder="Calculated from birthday"
                            value={ageValue}
                            readOnly
                            error={saveErrorMessage?.age}
                        />

                        <p className="mt-2 text-xs text-textMuted">
                            Calculated automatically from the birthday.
                        </p>
                    </div>

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
                </FieldGroup>

                <FieldGroup title="Account">
                    <div className="sm:col-span-3">
                        <PasswordField
                            id="password"
                            name="password"
                            label="Password"
                            placeholder="Enter password"
                            required
                            minLength={8}
                        />

                        <p className="mt-2 text-xs text-textMuted">
                            Must be at least 8 characters.
                        </p>
                    </div>
                </FieldGroup>
            </div>

            {/* Step 2: Enrollment or employment */}
            <div ref={setStepRef(1)} className={stepIndex === 1 ? "space-y-10" : "hidden"}>
                <StepHeading title={steps[1].title} description={steps[1].description} />

                {isStudent && (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                        <CourseSelect
                            id="course"
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
                )}

                {isFaculty && (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
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
                )}

                {isUniversityStaff && (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                        <SelectField
                            id="position"
                            name="position"
                            label="Position"
                            options={STAFF_POSITION_OPTIONS}
                            error={saveErrorMessage?.position}
                        />
                    </div>
                )}
            </div>

            {/* Step 3: Address */}
            <div ref={setStepRef(2)} className={stepIndex === 2 ? "space-y-10" : "hidden"}>
                <StepHeading title={steps[2].title} description={steps[2].description} />

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
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

            {/* Step 4: Emergency contact */}
            <div ref={setStepRef(3)} className={stepIndex === 3 ? "space-y-10" : "hidden"}>
                <StepHeading title={steps[3].title} description={steps[3].description} />

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                    <FormInput
                        id="emergencyName"
                        name="emergency_name"
                        label="Contact name"
                        placeholder="Full name"
                        required
                        error={saveErrorMessage?.emergency_name}
                    />

                    <SelectField
                        id="emergencyRelation"
                        name="emergency_relation"
                        label="Relationship"
                        options={EMERGENCY_RELATIONSHIP_OPTIONS}
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        error={saveErrorMessage?.emergency_relation}
                    />

                    <FormInput
                        id="emergencyPhone"
                        name="emergency_phone"
                        label="Contact phone"
                        type="tel"
                        placeholder="09XXXXXXXXX"
                        required
                        error={saveErrorMessage?.emergency_phone}
                    />

                    {emergencyRelation === OTHER_OPTION && (
                        <div className="sm:col-span-3">
                            <FormInput
                                id="emergencyRelationOther"
                                name="emergency_relation_other"
                                label="Specify relationship"
                                placeholder="Type the relationship"
                                required
                                error={saveErrorMessage?.emergency_relation}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Step 5: Medical history */}
            <div ref={setStepRef(4)} className={stepIndex === 4 ? "space-y-10" : "hidden"}>
                <StepHeading title={steps[4].title} description={steps[4].description} />

                <MedicalHistoryForm/>

                <div className="flex items-start justify-center gap-1.5 text-center text-xs text-info">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2}/>
                    <span>Please ensure all information is accurate before saving. This record will be stored in the system for future reference.</span>
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
                    onClick={handleBack}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-textPrimary disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2}/>
                    {stepIndex === 0 ? "Cancel" : "Previous"}
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
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" strokeWidth={2}/>
                        {isSaving ? "Saving..." : "Save record"}
                    </button>
                )}
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