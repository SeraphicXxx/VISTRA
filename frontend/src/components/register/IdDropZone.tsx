import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, Upload } from "lucide-react";
import { focusRing } from "/@/components/register/authShared";

type IdDropZoneProps = {
  label: string;
  hint: string;
  file: File | null;
  preview: string | null;
  disabled: boolean;
  invalid: boolean;
  onSelect: (file: File) => void;
};

export function IdDropZone({
  label,
  hint,
  file,
  preview,
  disabled,
  invalid,
  onSelect,
}: IdDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onSelect(dropped);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (selected) onSelect(selected);
  };

  return (
    <div className="flex flex-col gap-2 text-left">
      <p className="text-sm font-semibold uppercase tracking-wide text-textMuted">{label}</p>

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex min-h-[9.5rem] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-3 text-center transition-colors duration-200 disabled:cursor-wait ${focusRing} ${
          isDragging
            ? "border-primary bg-primary/10"
            : invalid
              ? "border-danger/50 bg-danger/5"
              : file
                ? "border-primary/40 bg-background"
                : "border-border bg-background hover:border-primary/50"
        }`}
      >
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="h-24 w-full rounded-lg object-contain" />
        ) : file ? (
          <>
            <FileText className="h-8 w-8 text-primary" strokeWidth={2} />
            <span className="max-w-full truncate text-xs font-medium text-textPrimary">{file.name}</span>
          </>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-5 w-5 text-primary" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-textPrimary">Upload</span>
            <span className="text-xs text-textMuted">{hint}</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onInput}
      />
    </div>
  );
}