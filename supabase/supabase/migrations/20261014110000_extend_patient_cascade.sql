-- Extend the patient cascade: APPOINTMENT and FAMILY_MEDICAL_HISTORY
-- reference PATIENT(patient_id) ON DELETE RESTRICT, so deleting a
-- patient with visits/history aborted with 23503. Every other child
-- (MEDICAL_VISIT, MEDICAL_HISTORY, DENTAL_VISIT, ODONTOGRAM via its
-- visit, VITAL_SIGNS, PATIENT_PROFILE) already cascades.
--
-- The function signature is unchanged: no backend code change needed.
-- Children are deleted explicitly (audit-friendly) before profile +
-- patient, all in the single implicit transaction.

create or replace function public.delete_patient_records(p_patient_id text)
returns void
language sql
as $$
  delete from public."APPOINTMENT" where patient_id = p_patient_id;
  delete from public."FAMILY_MEDICAL_HISTORY" where patient_id = p_patient_id;
  delete from public."PATIENT_PROFILE" where patient_id = p_patient_id;
  delete from public."PATIENT" where patient_id = p_patient_id;
$$;
