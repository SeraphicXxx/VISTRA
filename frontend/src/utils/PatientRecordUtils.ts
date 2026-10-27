import type { PatientRecordTab } from "/@/types/types";
import type { PatientInfo, UpdatePatientProfile } from "/@/api/schema/PatientSchema";

export const RECORD_TABS: { key: PatientRecordTab; label: string }[] = [
  { key: "medical", label: "Medical" },
  { key: "dental", label: "Dental" },
  { key: "appointment", label: "Appointments" },
];

/* ---------- Debugging ---------- */

/** Prints only in development. Usage: debugLog("payload", payload) */
export function debugLog(label: string, data: unknown): void {
  if (import.meta.env.DEV) {
    console.log(`[PatientRecord] ${label}`, data);
  }
}

/* ---------- Patient helpers ---------- */

export function isStudentPatient(patient?: PatientInfo): boolean {
  return Boolean(patient?.course || patient?.school_year);
}

export function getAffiliation(patient?: PatientInfo): string | null | undefined {
  if (!patient) return undefined;

  return isStudentPatient(patient)
    ? [patient.course, patient.school_year].filter(Boolean).join(" • ")
    : patient.department;
}

export function sortRecordsByDate<T extends { date: string }>(
  records: readonly T[] | undefined
): T[] {
  return [...(records ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/* ---------- Edit form ---------- */

export function buildEditForm(patient?: PatientInfo): Record<string, any> {
  return {
    name: patient?.patient_name ?? "",
    studentId: patient?.patient_id ?? "",
    yearSection: patient?.school_year ?? "",
    age: patient?.age ?? "",
    sex: patient?.sex ?? "",
    civilStatus: patient?.civil_status ?? "",
    birthday: patient?.birthday ?? "",
    mobileNumber: patient?.mobile_number ?? "",
    barangay: patient?.barangay ?? "",
    address: patient?.address ?? "",
  };
}

/*
 * Map the edit-modal form (UI field names) to the PATCH
 * /patients/{id}/ payload (API field names), including only
 * changed, non-blank values. name/studentId/yearSection are
 * display-only: the endpoint does not accept them.
 */
export function buildProfilePayload(
  form: Record<string, any>,
  patient: PatientInfo | undefined
): UpdatePatientProfile {
  const text = (value: unknown): string | undefined => {
    const trimmed = String(value ?? "").trim();
    return trimmed || undefined;
  };

  const changed = (next: string | undefined, current: unknown): boolean =>
    next !== undefined && next !== String(current ?? "");

  const payload: UpdatePatientProfile = {};
  const birthday = text(form.birthday);
  const mobileNumber = text(form.mobileNumber);
  const barangay = text(form.barangay);
  const address = text(form.address);

  if (birthday && changed(birthday, patient?.birthday)) {
    payload.birthday = birthday;
  }

  const age = Number(form.age);
  if (
    form.age !== "" &&
    form.age !== undefined &&
    Number.isFinite(age) &&
    age !== patient?.age
  ) {
    payload.age = age;
  }

  const sex = text(form.sex);
  if (sex && changed(sex, patient?.sex)) {
    payload.sex = sex;
  }

  const civilStatus = text(form.civilStatus);
  if (civilStatus && changed(civilStatus, patient?.civil_status)) {
    payload.civil_status = civilStatus;
  }

  if (mobileNumber && changed(mobileNumber, patient?.mobile_number)) {
    payload.mobile_number = mobileNumber;
  }

  if (barangay && changed(barangay, patient?.barangay)) {
    payload.barangay = barangay;
  }

  if (address && changed(address, patient?.address)) {
    payload.complete_address = address;
  }

  return payload;
}