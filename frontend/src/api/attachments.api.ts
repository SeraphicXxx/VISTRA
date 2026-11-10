import {API_ENDPOINTS, getApiUrl} from "/@/config/ApiConfig";
import {apiClient} from "/@/api/axios_client";

export type AttachmentCategory = "laboratory_result" | "clinical_photo";

export interface UploadAttachmentResponse {
    success: boolean;
    data: {
        id: string;
        patient_id: string;
        appointment_id: number | null;
        uploaded_by: string;
        category: string;
        file_name: string;
        storage_path: string;
        mime_type: string;
        file_size: number;
        created_at: string;
    };
    message: string;
}

export function uploadPatientAttachment(
    file: File,
    category: AttachmentCategory = "laboratory_result",
    appointmentId?: number,
    signal?: AbortSignal
) {
    const formData = new FormData();
    formData.append("category", category);
    formData.append("file", file);
    if (appointmentId !== undefined) {
        formData.append("appointment_id", String(appointmentId));
    }

    return apiClient<UploadAttachmentResponse>(
        API_ENDPOINTS.attachment.patient_upload,
        {
            method: "POST",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            signal,
        }
    );
}

export interface AttachmentRecord {
    id: string;
    patient_id: string;
    appointment_id: number | null;
    uploaded_by: string;
    category: string;
    file_name: string;
    storage_path: string;
    mime_type: string;
    file_size: number;
    created_at: string;
}

export function getAttachmentsByAppointment(
    patientId: string,
    appointmentId: number,
    signal?: AbortSignal
) {
    return apiClient<{ success: boolean; data: AttachmentRecord[] }>(
        `${API_ENDPOINTS.attachment.get_by_patient(patientId)}?appointment_id=${appointmentId}`,
        { method: "GET", signal }
    );
}

export function getMyAttachments(
    appointmentId?: number,
    signal?: AbortSignal
) {
    const url = appointmentId !== undefined
        ? `${API_ENDPOINTS.attachment.get_my}?appointment_id=${appointmentId}`
        : API_ENDPOINTS.attachment.get_my;
    return apiClient<{ success: boolean; data: AttachmentRecord[] }>(
        url,
        { method: "GET", signal }
    );
}

export function getAttachmentDownloadUrl(attachmentId: string): string {
    return `${getApiUrl()}/api/v1/attachments/patient/download/${attachmentId}`;
}

export async function downloadAttachment(attachmentId: string): Promise<void> {
    try {
        const response = await apiClient(
            `/api/v1/attachments/patient/download/${attachmentId}`,
            { method: "GET", responseType: "blob" }
        );
        const blob = response.data as Blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        // error reported by caller
    }
}