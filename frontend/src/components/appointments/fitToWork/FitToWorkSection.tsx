import {useState} from "react";
import {Download, FileCheck, Paperclip} from "lucide-react";
import {downloadAttachment, type AttachmentRecord} from "/@/api/attachments.api";
import {FitToWorkCertificateForm} from "./FitToWorkCertificateForm";
import {
    buildCertificateDefaults,
    isFitToWorkType,
    type FitToWorkCertificate,
    type PatientSummary,
} from "./fitToWorkUtils";

interface FitToWorkSectionProps {
    appointmentType: string;
    examinationDate: string;
    patient: PatientSummary;
    physician: string;
    attachments: AttachmentRecord[];
    isIssued: boolean;
    onIssue: (certificate: FitToWorkCertificate) => Promise<void>;
}

export function FitToWorkSection({
                                     appointmentType,
                                     examinationDate,
                                     patient,
                                     physician,
                                     attachments,
                                     isIssued,
                                     onIssue,
                                 }: FitToWorkSectionProps) {
    const [verified, setVerified] = useState(false);
    const [draft, setDraft] = useState<FitToWorkCertificate | null>(null);
    const [isIssuing, setIsIssuing] = useState(false);

    if (!isFitToWorkType(appointmentType)) return null;

    const canIssue = verified && attachments.length > 0 && !isIssued;

    const openCertificate = () => {
        setDraft(buildCertificateDefaults({patient, examinationDate, physician}));
    };

    const handleIssue = async (certificate: FitToWorkCertificate) => {
        setIsIssuing(true);
        try {
            await onIssue(certificate);
            setDraft(null);
        } finally {
            setIsIssuing(false);
        }
    };

    return (
        <>
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <FileCheck className="h-4.5 w-4.5 text-primary" strokeWidth={2}/>
                    </div>
                    <div>
                        <h2 className="font-heading text-sm font-semibold text-textPrimary">Fit to Work</h2>
                        <p className="text-xs text-textMuted">
                            Check the patient's attachment, then issue the certificate.
                        </p>
                    </div>
                </div>

                {attachments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-textMuted">
                        No attachment has been sent yet.
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {attachments.map((att) => (
                            <li
                                key={att.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => void downloadAttachment(att.id)}
                                    className="flex min-w-0 items-center gap-2 text-xs text-primary hover:underline"
                                >
                                    <Paperclip className="h-3.5 w-3.5 shrink-0" strokeWidth={2}/>
                                    <span className="truncate">{att.file_name}</span>
                                    <Download className="h-3.5 w-3.5 shrink-0" strokeWidth={2}/>
                                </button>
                                <span className="shrink-0 text-[10px] text-textMuted">
                                    {(att.file_size / 1024).toFixed(1)} KB
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs text-textSecondary">
                    <input
                        type="checkbox"
                        checked={verified}
                        onChange={(e) => setVerified(e.target.checked)}
                        disabled={isIssued}
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span>I checked the attached document and it shows the fit-to-work mark.</span>
                </label>

                <div className="mt-5 flex items-center justify-between gap-3">
                    {isIssued ? (
                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                            Certificate issued
                        </span>
                    ) : (
                        <span className="text-xs text-textMuted">
                            {canIssue ? "Ready to issue." : "Verify the attachment to continue."}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={openCertificate}
                        disabled={!canIssue}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Issue fit to work
                    </button>
                </div>
            </section>

            {draft && (
                <FitToWorkCertificateForm
                    initial={draft}
                    isIssuing={isIssuing}
                    onIssue={handleIssue}
                    onClose={() => setDraft(null)}
                />
            )}
        </>
    );
}