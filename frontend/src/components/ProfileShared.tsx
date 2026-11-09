import {useEffect, useRef, useState} from "react";
import type { ReactNode } from "react";
import type {
  PatientClassification,
  PersonalInfo,
} from "./patient.sample";
import {uploadProfilePicture, fetchProfilePictureBlob} from "/@/api/patient.api";
import {useNotify} from "/@/components/notifications/NotificationProvider";

export const ID_LABELS: Record<PatientClassification, string> = {
  student: "Student ID",
  faculty: "Faculty ID",
  staff: "Admin ID",
  university_staff: "Staff ID",
};

export function display(value?: string | number | null): string {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "—";
  }
  return String(value);
}

export function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function ProfileHeader({
  name,
  classification,
  patient_id,
  course,
}: PersonalInfo) {
  const notify = useNotify();
  const [isUploading, setIsUploading] = useState(false);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [hasPicture, setHasPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const classificationLabel =
    classification.charAt(0).toUpperCase() + classification.slice(1);

  useEffect(() => {
    let objectUrl: string | null = null;
    fetchProfilePictureBlob().then((url) => {
      if (url) {
        objectUrl = url;
        setPictureUrl(url);
        setHasPicture(true);
      }
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadProfilePicture(file);
      const url = await fetchProfilePictureBlob();
      if (url) {
        setPictureUrl(url);
        setHasPicture(true);
      }
      notify.success("Profile picture updated.", { title: "Upload successful" });
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      notify.error("Could not upload profile picture. Please try again.", {
        title: "Upload failed",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary overflow-hidden">
        {hasPicture && pictureUrl ? (
          <img
            src={pictureUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="Upload profile picture"
          className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primaryDark disabled:opacity-50"
        >
          {isUploading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-textPrimary">{name}</h2>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {classificationLabel}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-textMuted">
          <span>
            <span className="font-semibold text-primary/70">ID:</span>{" "}
            {patient_id}
          </span>

          {classification === "student" && (
            <span>
              <span className="font-semibold text-primary/70">Course:</span>{" "}
              {display(course)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 px-4 py-3">
      <p className="mb-1 text-xs font-medium text-textMuted">{label}</p>
      <p className="break-words text-sm font-semibold text-textPrimary">
        {display(value)}
      </p>
    </div>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

export function InfoCard({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-textPrimary sm:text-base">
          {title}
        </h3>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-textMuted transition hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            Edit
          </button>
        )}
      </div>

      {children}
    </section>
  );
}