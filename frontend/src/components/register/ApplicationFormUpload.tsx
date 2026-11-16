import { useRef, useState, type DragEvent } from "react";
import { FileText, Upload } from "lucide-react";
import { focusRing } from "/@/components/register/authShared";

export const ACCEPTED_FORM_TYPES = /^(image\/.+|application\/pdf)$/;

export type ReadStatus = "idle" | "reading" | "done" | "error";

type ApplicationFormUploadProps = {
  file: File | null;
  preview: string | null;
  status: ReadStatus;
  message: string | null;
  error: string | null;
  onSelect: (file: File) => void;
};

export function ApplicationFormUpload({
  file,
  preview,
  status,
  message,
  error,
  onSelect,
}: ApplicationFormUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isReading = status === "reading";

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onSelect(dropped);
  };

  return (
    <div className="flex flex-col gap-3 text-left">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" strokeWidth={2} />
        <p className="text-sm font-semibold uppercase tracking-wide text-textMuted">
          Application form
        </p>
      </div>

      <button
        type="button"
        disabled={isReading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex min-h-[10rem] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors duration-200 disabled:cursor-wait ${focusRing} ${
          isDragging
            ? "border-primary bg-primary/10"
            : error
              ? "border-danger/50 bg-danger/5"
              : file
                ? "border-primary/40 bg-background"
                : "border-border bg-background hover:border-primary/50"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Application form preview"
            className="h-32 w-full rounded-lg object-contain"
          />
        ) : file ? (
          <span className="max-w-full truncate text-sm font-medium text-textPrimary">
            {file.name}
          </span>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-textPrimary">
              Upload your application form
            </span>
            <span className="text-xs text-textMuted">
              Photo or PDF. Drag and drop, or click to choose.
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          e.target.value = "";
          if (selected) onSelect(selected);
        }}
      />

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      {isReading ? (
        <div className="flex items-center gap-2 text-sm text-textMuted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Reading your form... This will take a minute.</span>
        </div>
      ) : message ? (
        <p
          className={`text-sm leading-relaxed ${
            status === "error" ? "text-danger" : "text-success"
          }`}
        >
          {message}
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-textMuted">
          We use this form to fill in your details automatically.
        </p>
      )}
    </div>
  );
}