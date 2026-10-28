import { VitalSigns } from "@/mock/vitals";
import type { BackendVitalSigns } from "@/api/services/patient.service";

export interface VistraVitalsQR {
    type: "VISTRA_VITALS";
    version: string;
    generatedAt: string;
    measurements: {
        height?: { value: number; unit: string };
        weight?: { value: number; unit: string };
        temperature?: { value: number; unit: string };
        heartRate?: { value: number; unit: string };
        spo2?: { value: number; unit: string };
    };
}

export function mapVistraVitalsToVitalSigns(
    payload: VistraVitalsQR,
): VitalSigns {
    if (payload.type !== "VISTRA_VITALS") {
        throw new Error("Invalid VISTRA vitals payload type");
    }

    return {
        recordedAt: payload.generatedAt,
        heartRate: payload.measurements.heartRate?.value,
        temperature: payload.measurements.temperature?.value,
        spo2: payload.measurements.spo2?.value,
        weight: payload.measurements.weight?.value,
        height: payload.measurements.height?.value,
    };
}

export function mapBackendVitalSignsToVitalSigns(
    record: BackendVitalSigns,
): VitalSigns {
    return {
        recordedAt: record.recorded_at,
        heartRate: record.heart_rate ?? undefined,
        temperature: record.temperature ?? undefined,
        spo2: record.spo2 ?? undefined,
        weight: record.weight ?? undefined,
        height: record.height ?? undefined,
    };
}