import {useEffect, useState} from "react";
import {getInitials} from "/@/utils/RecordInfo";
import {avatarColor} from "/@/components/avatar";
import {fetchPatientProfilePictureBlob} from "/@/api/patient.api";

interface PatientAvatarProps {
    patientId?: string | null;
    name?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const SIZE_CLASSES: Record<string, string> = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-28 w-28 text-2xl",
};

export function PatientAvatar({ patientId, name = "", size = "md", className = "" }: PatientAvatarProps) {
    const [pictureUrl, setPictureUrl] = useState<string | null>(null);
    const [hasPicture, setHasPicture] = useState(false);

    useEffect(() => {
        if (!patientId) return;
        let objectUrl: string | null = null;
        fetchPatientProfilePictureBlob(patientId).then((url) => {
            if (url) {
                objectUrl = url;
                setPictureUrl(url);
                setHasPicture(true);
            }
        });
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [patientId]);

    const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

    if (hasPicture && pictureUrl) {
        return (
            <img
                src={pictureUrl}
                alt={name ?? "Patient"}
                className={`shrink-0 rounded-2xl object-cover ${sizeClass} ${className}`}
            />
        );
    }

    return (
        <span
            className={`flex shrink-0 items-center justify-center rounded-2xl font-semibold ${avatarColor(name ?? "")} ${sizeClass} ${className}`}
        >
            {getInitials(name ?? "")}
        </span>
    );
}