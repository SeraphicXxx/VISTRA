import React from "react";
import {Modal} from "/@/components/editModal";

type ConfirmTone = "default" | "danger";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmTone;
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
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold text-white ${CONFIRM_TONE_CLASSES[tone]}`}
                    >
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <p className="text-sm text-textSecondary">{message}</p>
        </Modal>
    );
}
