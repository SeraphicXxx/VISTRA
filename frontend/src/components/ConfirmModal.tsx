import React from "react";
import {Modal} from "/@/components/editModal";

type ConfirmTone = "default" | "danger";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmTone;
    isConfirming?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const CONFIRM_TONE_CLASSES: Record<ConfirmTone, string> = {
    default: "bg-primary hover:bg-primaryDark",
    danger: "bg-danger hover:opacity-90",
};

export function ConfirmModal({
                                 title,
                                 message,
                                 confirmLabel = "Confirm",
                                 cancelLabel = "Cancel",
                                 tone = "default",
                                 isConfirming = false,
                                 onConfirm,
                                 onCancel,
                             }: ConfirmModalProps) {
    return (
        <Modal
            title={title}
            onClose={onCancel}
            maxWidth="max-w-sm"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isConfirming}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${CONFIRM_TONE_CLASSES[tone]}`}
                    >
                        {isConfirming && (
                            <span
                                aria-hidden="true"
                                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                            />
                        )}
                        {isConfirming ? "Saving…" : confirmLabel}
                    </button>
                </>
            }
        >
            <p className="text-sm text-textSecondary">{message}</p>
        </Modal>
    );
}
