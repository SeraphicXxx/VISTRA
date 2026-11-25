import {useState} from "react";
import {Clock, Eye, Info, UserPlus} from "lucide-react";
import {primaryButton, secondaryButton} from "/@/components/Button";
import {
    getPending,
    getSections,
    removePending,
    type PendingRecord,
} from "/@/components/register/pendingStore";

export default function AccountRequests() {
    const [requests, setRequests] = useState<PendingRecord[]>(() => getPending());
    const [selected, setSelected] = useState<PendingRecord | null>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [furthestPage, setFurthestPage] = useState(0);
    const [isDeclining, setIsDeclining] = useState(false);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const sections = selected ? getSections(selected) : [];
    const total = Math.max(sections.length, 1);
    const isLastPage = pageIndex >= total - 1;
    // Approve and decline unlock only after every page has been viewed.
    const hasViewedAll = furthestPage >= total - 1;
    const section = sections[pageIndex];

    const name = (r: PendingRecord) =>
        `${r.details.first_name ?? ""} ${r.details.last_name ?? ""}`.trim() || "Unnamed";

    const openRequest = (record: PendingRecord) => {
        setSelected(record);
        setPageIndex(0);
        setFurthestPage(0);
        setIsDeclining(false);
        setReason("");
        setError(null);
    };

    const closeRequest = () => {
        setSelected(null);
        setIsDeclining(false);
        setReason("");
        setError(null);
    };

    const goToPage = (index: number) => {
        setPageIndex(index);
        setFurthestPage((prev) => Math.max(prev, index));
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const finish = () => {
        if (!selected) return;
        removePending(selected.id);
        setRequests(getPending());
        closeRequest();
    };

    const confirmDecline = () => {
        if (!reason.trim()) {
            setError("Enter a reason before declining.");
            return;
        }
        finish();
    };

    if (selected) {
        return (
            <div className="flex flex-col gap-6">
                <button
                    type="button"
                    onClick={closeRequest}
                    className="self-start text-sm font-semibold text-primary hover:text-primaryDark"
                >
                    ← Back to requests
                </button>

                <div>
                    <h2 className="font-heading text-xl font-semibold text-textPrimary">
                        {name(selected)}
                    </h2>
                    <p className="mt-1 text-sm text-textMuted">
                        Submitted {new Date(selected.submitted_at).toLocaleString()}
                    </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-info/30 bg-info/10 px-4 py-3.5 text-sm text-info">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                    <p>
                        This is a self-registration from a patient. Read every page first. Approve
                        accepts this patient's account. Decline rejects it and requires a reason.
                        {!hasViewedAll && (
                            <span className="mt-1 block font-semibold">
                                Approve and Decline unlock after you reach the last page.
                            </span>
                        )}
                    </p>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between text-xs text-textMuted">
                        <span>
                            Page {pageIndex + 1} of {total}
                        </span>
                        <span className="font-medium text-textPrimary">
                            {section?.title ?? "Review"}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{width: `${((pageIndex + 1) / total) * 100}%`}}
                        />
                    </div>
                </div>

                {section && (
                    <section className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
                            {section.title}
                        </h3>
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl border border-border bg-white p-5 sm:grid-cols-2">
                            {section.rows.map((row, index) => (
                                <div key={`${row.label}-${index}`} className="min-w-0">
                                    <dt className="text-xs font-medium text-textMuted">{row.label}</dt>
                                    <dd className="mt-0.5 break-words text-sm text-textPrimary">
                                        {row.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}

                {isLastPage && !isDeclining && hasViewedAll && (
                    <p className="text-xs text-textMuted">
                        Approve if the information is complete and valid. Decline if something is wrong or
                        the registration cannot be accepted, and state the reason.
                    </p>
                )}

                {isDeclining && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="decline-reason" className="text-sm font-medium text-textPrimary">
                            Reason for declining <span className="text-danger">*</span>
                        </label>
                        <p className="text-xs text-textMuted">
                            Describe why this registration is rejected, for example an invalid student ID or
                            missing medical information.
                        </p>
                        <textarea
                            id="decline-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-textPrimary focus:border-primary focus:outline-none"
                        />
                    </div>
                )}

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
                    >
                        {error}
                    </p>
                )}

                <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
                    <button
                        type="button"
                        onClick={() => (pageIndex > 0 ? goToPage(pageIndex - 1) : closeRequest())}
                        className={secondaryButton}
                    >
                        {pageIndex > 0 ? "Back" : "Cancel"}
                    </button>

                    {!isLastPage ? (
                        <button type="button" onClick={() => goToPage(pageIndex + 1)} className={primaryButton}>
                            Next
                        </button>
                    ) : isDeclining ? (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsDeclining(false)}
                                className={secondaryButton}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDecline}
                                disabled={!hasViewedAll}
                                className={primaryButton}
                            >
                                Confirm decline
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsDeclining(true)}
                                disabled={!hasViewedAll}
                                className={secondaryButton}
                            >
                                Decline
                            </button>
                            <button
                                type="button"
                                onClick={finish}
                                disabled={!hasViewedAll}
                                className={primaryButton}
                            >
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-xl font-semibold text-textPrimary">
                        New requested accounts
                    </h2>
                    <p className="mt-1 text-sm text-textMuted">
                        Patients who registered themselves and are waiting for medical personnel approval.
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <UserPlus className="h-3.5 w-3.5" strokeWidth={2} />
                    {requests.length} pending
                </span>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-info/30 bg-info/10 px-4 py-3.5 text-sm text-info">
                <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                <p>
                    Select View to review an application. Check every page before you approve or decline it.
                    Patients cannot sign in until their account is approved.
                </p>
            </div>

            {requests.length === 0 ? (
                <p className="rounded-xl border border-border bg-white p-5 text-sm text-textMuted">
                    No new requested accounts right now.
                </p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {requests.map((r) => (
                        <li
                            key={r.id}
                            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-textPrimary">{name(r)}</p>
                                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-textMuted">
                                    <Clock className="h-3 w-3" strokeWidth={2} />
                                    ID {String(r.details.patient_id ?? "-")} ·{" "}
                                    {new Date(r.submitted_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button type="button" onClick={() => openRequest(r)} className={primaryButton}>
                                <Eye className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2} />
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}