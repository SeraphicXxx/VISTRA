export const PATIENT_ID_PATTERN = /^[0-9]{8}-S$/;

export function validatePatientId(value: string): string | undefined {
  if (!value.trim()) return "Patient ID is required";
  if (!PATIENT_ID_PATTERN.test(value.trim())) {
    return "Use the format 202XXXXX-S";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return undefined;
}
