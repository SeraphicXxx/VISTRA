import {useState, type FormEvent} from "react";
import {Modal} from "/@/components/editModal";
import {FITNESS_OPTIONS, type FitToWorkCertificate} from "./fitToWorkUtils";

const FORM_ID = "fit-to-work-form";

const inlineInput =
    "mx-1 inline-block border-b border-textMuted/50 bg-transparent px-1 py-0.5 font-semibold text-textPrimary transition-colors focus:border-primary focus:outline-none";

const blockInput =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-textMuted";

interface FitToWorkCertificateFormProps {
    initial: FitToWorkCertificate;
    isIssuing: boolean;
    onIssue: (certificate: FitToWorkCertificate) => void;
    onClose: () => void;
}

export function FitToWorkCertificateForm({
                                             initial,
                                             isIssuing,
                                             onIssue,
                                             onClose,
                                         }: FitToWorkCertificateFormProps) {
    const [form, setForm] = useState<FitToWorkCertificate>(initial);
    const [error, setError] = useState<string | null>(null);

    const update = (patch: Partial<FitToWorkCertificate>) =>
        setForm((prev) => ({...prev, ...patch}));

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.full_name.trim() || !form.examining_physician.trim() || !form.valid_until) {
            setError("Full name, valid-until date, and examining physician are required.");
            return;
        }
        if (form.fitness_status === "fit_with_restrictions" && !form.restrictions.trim()) {
            setError("List the restrictions for a fit-with-restrictions certificate.");
            return;
        }

        setError(null);
        onIssue(form);
    };

    return (
        <Modal
            title="Fit to Work Certificate"
            onClose={onClose}
            maxWidth="max-w-2xl"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isIssuing}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form={FORM_ID}
                        disabled={isIssuing}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isIssuing ? "Issuing..." : "Issue certificate"}
                    </button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
                    <div className="text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                            University of Caloocan City
                        </p>
                        <p className="mt-0.5 text-[11px] text-textMuted">
                            Clinic · Biglang Awa St., 12th Avenue, Caloocan City
                        </p>
                        <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-textPrimary">
                            CERTIFICATE OF FITNESS TO WORK
                        </h3>
                    </div>

                    <p className="mt-6 text-sm leading-loose text-textSecondary">
                        This is to certify that
                        <input
                            aria-label="Full name"
                            value={form.full_name}
                            onChange={(e) => update({full_name: e.target.value})}
                            className={`${inlineInput} min-w-[12rem]`}
                        />
                        , student number
                        <input
                            aria-label="Student number"
                            value={form.student_id}
                            onChange={(e) => update({student_id: e.target.value})}
                            className={`${inlineInput} min-w-[8rem]`}
                        />
                        , aged
                        <input
                            aria-label="Age"
                            value={form.age}
                            onChange={(e) => update({age: e.target.value})}
                            className={`${inlineInput} w-14 text-center`}
                        />
                        years, sex
                        <input
                            aria-label="Sex"
                            value={form.sex}
                            onChange={(e) => update({sex: e.target.value})}
                            className={`${inlineInput} w-24`}
                        />
                        , enrolled in
                        <input
                            aria-label="Course and section"
                            value={form.course_section}
                            onChange={(e) => update({course_section: e.target.value})}
                            className={`${inlineInput} min-w-[10rem]`}
                        />
                        , was examined on
                        <input
                            type="date"
                            aria-label="Examination date"
                            value={form.examination_date}
                            onChange={(e) => update({examination_date: e.target.value})}
                            className={inlineInput}
                        />
                        , and is found to be:
                    </p>

                    <fieldset className="mt-5 grid gap-2 sm:grid-cols-3">
                        <legend className="sr-only">Fitness status</legend>
                        {FITNESS_OPTIONS.map((option) => {
                            const selected = form.fitness_status === option.value;

                            return (
                                <label
                                    key={option.value}
                                    className={`cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
                                        selected
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/40"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="fitness_status"
                                        value={option.value}
                                        checked={selected}
                                        onChange={() => update({fitness_status: option.value})}
                                        className="sr-only"
                                    />
                                    <span className="block text-sm font-semibold text-textPrimary">
                                        {option.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-textMuted">{option.hint}</span>
                                </label>
                            );
                        })}
                    </fieldset>

                    {form.fitness_status === "fit_with_restrictions" && (
                        <div className="mt-5">
                            <label htmlFor="restrictions" className={labelClass}>Restrictions</label>
                            <textarea
                                id="restrictions"
                                rows={2}
                                value={form.restrictions}
                                onChange={(e) => update({restrictions: e.target.value})}
                                placeholder="e.g. No heavy lifting for 2 weeks"
                                className={blockInput}
                            />
                        </div>
                    )}

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div>
                            <label htmlFor="purpose" className={labelClass}>Purpose</label>
                            <input
                                id="purpose"
                                value={form.purpose}
                                onChange={(e) => update({purpose: e.target.value})}
                                className={blockInput}
                            />
                        </div>
                        <div>
                            <label htmlFor="issue_date" className={labelClass}>Issued on</label>
                            <input
                                id="issue_date"
                                type="date"
                                value={form.issue_date}
                                onChange={(e) => update({issue_date: e.target.value})}
                                className={blockInput}
                            />
                        </div>
                        <div>
                            <label htmlFor="valid_until" className={labelClass}>Valid until</label>
                            <input
                                id="valid_until"
                                type="date"
                                value={form.valid_until}
                                onChange={(e) => update({valid_until: e.target.value})}
                                className={blockInput}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="remarks" className={labelClass}>Remarks</label>
                        <textarea
                            id="remarks"
                            rows={2}
                            value={form.remarks}
                            onChange={(e) => update({remarks: e.target.value})}
                            placeholder="Additional notes for the certificate"
                            className={blockInput}
                        />
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        <div>
                            <input
                                aria-label="Examining physician"
                                value={form.examining_physician}
                                onChange={(e) => update({examining_physician: e.target.value})}
                                placeholder="Name of examining physician"
                                className="w-full border-b border-textMuted/50 bg-transparent px-1 py-1 text-center text-sm font-semibold text-textPrimary focus:border-primary focus:outline-none"
                            />
                            <p className="mt-1 text-center text-xs text-textMuted">Examining physician</p>
                        </div>
                        <div>
                            <input
                                aria-label="License number"
                                value={form.license_no}
                                onChange={(e) => update({license_no: e.target.value})}
                                placeholder="License no."
                                className="w-full border-b border-textMuted/50 bg-transparent px-1 py-1 text-center text-sm font-semibold text-textPrimary focus:border-primary focus:outline-none"
                            />
                            <p className="mt-1 text-center text-xs text-textMuted">License no.</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                        {error}
                    </p>
                )}
            </form>
        </Modal>
    );
}