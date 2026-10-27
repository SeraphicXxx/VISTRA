import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {Bell, Check, Mail, Plus, X} from "lucide-react";
import {getInitials} from "/@/utils/RecordInfo";
import type {Professional} from "/@/pages/admin/medical/notifyProfessor";

interface NotifyProfessionalModalProps {
    professionals: Professional[];
    defaultMessage: string;
    onSend: (professional: Professional, message: string) => void;
    onSkip: () => void;
    onCancel: () => void;
}

interface NewProfessorForm {
    name: string;
    email: string;
    role: string;
    course: string;
}

const EMPTY_NEW_PROFESSOR: NewProfessorForm = {
    name: "",
    email: "",
    role: "",
    course: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-textPrimary transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1.5 block text-xs font-medium text-textMuted";

export function NotifyProfessionalModal({
                                            professionals,
                                            defaultMessage,
                                            onNotify,
                                            onSend,
                                            onSkip,
                                            onCancel,
                                        }: NotifyProfessionalModalProps) {
    const [extraProfessors, setExtraProfessors] = useState<Professional[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [message, setMessage] = useState(defaultMessage);
    const [isAdding, setIsAdding] = useState(false);
    const [newProfessor, setNewProfessor] = useState<NewProfessorForm>(EMPTY_NEW_PROFESSOR);
    const [addError, setAddError] = useState<string | null>(null);

    const allProfessors = [...professionals, ...extraProfessors];
    const selected = allProfessors.find((professor) => professor.id === selectedId) ?? null;
    const canSend = selected !== null && message.trim().length > 0;

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onCancel();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onCancel]);

    const updateNewProfessor = (key: keyof NewProfessorForm, value: string) => {
        setNewProfessor((prev) => ({...prev, [key]: value}));
    };

    const cancelAdd = () => {
        setIsAdding(false);
        setAddError(null);
        setNewProfessor(EMPTY_NEW_PROFESSOR);
    };

    const handleAddProfessor = () => {
        const name = newProfessor.name.trim();
        const email = newProfessor.email.trim();

        if (!name) {
            setAddError("Enter the professor's name.");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            setAddError("Enter a valid email address.");
            return;
        }

        if (allProfessors.some((professor) => professor.email.toLowerCase() === email.toLowerCase())) {
            setAddError("This email is already on the list.");
            return;
        }

        const created: Professional = {
            id: `NEW-${Date.now()}`,
            name,
            role: newProfessor.role.trim() || "Professor",
            course: newProfessor.course.trim() || "Not specified",
            email,
        };

        setExtraProfessors((prev) => [...prev, created]);
        setSelectedId(created.id);
        setIsAdding(false);
        setAddError(null);
        setNewProfessor(EMPTY_NEW_PROFESSOR);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40" onClick={onCancel} aria-hidden="true"/>

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="notify-professor-title"
                className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-lg"
            >
                <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Bell className="h-4 w-4" strokeWidth={2}/>
                        </span>
                        <div>
                            <h2 id="notify-professor-title"
                                className="font-heading text-sm font-semibold text-primaryDark">
                                Notify a professor by email
                            </h2>
                            <p className="text-xs text-textMuted">
                                The selected professor receives an email about this saved record.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-textSecondary hover:bg-surfaceMuted"
                    >
                        <X className="h-3.5 w-3.5"/>
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-5">
                    {allProfessors.length > 0 ? (
                        <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto">
                            {allProfessors.map((professor) => {
                                const isSelected = professor.id === selectedId;

                                return (
                                    <li key={professor.id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(professor.id)}
                                            aria-pressed={isSelected}
                                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                                                isSelected ? "bg-primary/10" : "hover:bg-background"
                                            }`}
                                        >
                                            <span
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                                                {getInitials(professor.name)}
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium text-textPrimary">
                                                    {professor.name}
                                                </span>
                                                <span className="block truncate text-xs text-textMuted">
                                                    {professor.role} · {professor.course}
                                                </span>
                                                <span className="block truncate text-xs text-textSecondary">
                                                    {professor.email}
                                                </span>
                                            </span>

                                            <span
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                                    isSelected
                                                        ? "border-primary bg-primary text-white"
                                                        : "border-border text-transparent"
                                                }`}
                                            >
                                                <Check className="h-3.5 w-3.5" strokeWidth={2.5}/>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="py-6 text-center text-sm text-textMuted">
                            No professors on the list yet.
                        </p>
                    )}

                    {isAdding ? (
                        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">
                                New professor
                            </p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="new-professor-name" className={labelClass}>
                                        Full name
                                    </label>
                                    <input
                                        id="new-professor-name"
                                        type="text"
                                        value={newProfessor.name}
                                        onChange={(event) => updateNewProfessor("name", event.target.value)}
                                        placeholder="e.g. Dr. Juan Dela Cruz"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="new-professor-email" className={labelClass}>
                                        Email
                                    </label>
                                    <input
                                        id="new-professor-email"
                                        type="email"
                                        value={newProfessor.email}
                                        onChange={(event) => updateNewProfessor("email", event.target.value)}
                                        placeholder="name@school.edu"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="new-professor-role" className={labelClass}>
                                        Role
                                    </label>
                                    <input
                                        id="new-professor-role"
                                        type="text"
                                        value={newProfessor.role}
                                        onChange={(event) => updateNewProfessor("role", event.target.value)}
                                        placeholder="e.g. Professor"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="new-professor-course" className={labelClass}>
                                        Course
                                    </label>
                                    <input
                                        id="new-professor-course"
                                        type="text"
                                        value={newProfessor.course}
                                        onChange={(event) => updateNewProfessor("course", event.target.value)}
                                        placeholder="e.g. BS Computer Science"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {addError && <p className="text-xs text-red-600">{addError}</p>}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={cancelAdd}
                                    className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddProfessor}
                                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primaryDark"
                                >
                                    Add professor
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsAdding(true)}
                            className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-primary hover:text-primaryDark"
                        >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2}/>
                            Add a professor not on the list
                        </button>
                    )}

                    {selected && (
                        <div className="flex flex-col gap-4 border-t border-border pt-5">
                            <div>
                                <p className="text-xs font-medium text-textMuted">To</p>
                                <div
                                    className="mt-1.5 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-textPrimary">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2}/>
                                    <span className="truncate">{selected.email}</span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="notify-message" className="text-xs font-medium text-textMuted">
                                    Message
                                </label>
                                <textarea
                                    id="notify-message"
                                    rows={5}
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    className={`${inputClass} mt-1.5 resize-none`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onSkip}
                        className="rounded-lg px-3 py-2 text-left text-xs font-medium text-textSecondary hover:text-textPrimary"
                    >
                        No one to notify
                    </button>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={!canSend}
                            onClick={() => selected && onSend(selected, message.trim())}
                            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
                        >
                            Send email and save
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}