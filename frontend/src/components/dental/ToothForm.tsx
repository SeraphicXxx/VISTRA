import {CreateToothRequest, ToothSchema} from "/@/api/schema/DentalSchema";
import {ToothModal} from "/@/components/dental/ToothModal";
import {FormInput} from "/@/components/InputCollection";
import {Dentition, ToothCondition, toothConditionOptions} from "/@/types/Dental";

interface ToothNoteModalProps {
    toothNumber: number;
    initialRecord?: ToothSchema;
    onSubmit: (record: CreateToothRequest) => void;
    onClear: () => void;
    onClose: () => void;
}

export function ToothNoteModal({
    toothNumber,
    initialRecord,
    onSubmit,
    onClear,
    onClose,
}: ToothNoteModalProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const record: CreateToothRequest = {
            tooth_number: toothNumber,
            dentition: formData.get("dentition") as Dentition,
            condition: formData.get("condition") as ToothCondition,
            notes: formData.get("notes")?.toString() ?? "",
        };

        onSubmit(record);
    };

    return (
        <ToothModal
            title={`Tooth ${toothNumber}`}
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-sm font-medium text-textSecondary hover:text-red-500"
                    >
                        Clear note
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-textSecondary hover:bg-background"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="tooth-note-form"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primaryDark"
                    >
                        Save
                    </button>
                </>
            }
        >
            <form
                id="tooth-note-form"
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {/* Dentition */}
                <fieldset>
                    <legend className="mb-2 text-xs font-medium text-textMuted">
                        Dentition
                    </legend>

                    <div className="flex gap-5">
                        <label className="flex items-center gap-2 text-sm text-textPrimary">
                            <input
                                type="radio"
                                name="dentition"
                                value="permanent"
                                defaultChecked={
                                    initialRecord?.dentition === "permanent" ||
                                    !initialRecord?.dentition
                                }
                            />
                            Permanent
                        </label>

                        <label className="flex items-center gap-2 text-sm text-textPrimary">
                            <input
                                type="radio"
                                name="dentition"
                                value="temporary"
                                defaultChecked={
                                    initialRecord?.dentition === "temporary"
                                }
                            />
                            Temporary
                        </label>
                    </div>
                </fieldset>

                {/* Condition */}
                <div>
                    <label
                        htmlFor="tooth-condition"
                        className="mb-2 block text-xs font-medium text-textMuted"
                    >
                        Condition
                    </label>

                    <select
                        id="tooth-condition"
                        name="condition"
                        defaultValue={
                            initialRecord?.condition ?? "sound"
                        }
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-textPrimary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {toothConditionOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <FormInput
                    id="tooth-notes"
                    name="notes"
                    label="Notes"
                    defaultValue={initialRecord?.notes ?? ""}
                    placeholder="Add notes for this tooth..."
                />
            </form>
        </ToothModal>
    );
}
