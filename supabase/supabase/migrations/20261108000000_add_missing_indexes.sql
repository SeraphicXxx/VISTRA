-- Phase 5.1: Audit/add missing indexes on foreign keys and filter columns.
-- Existing indexes (from migration 20261015055421):
--   idx_appointment_patient_start ON APPOINTMENT(patient_id, scheduled_start)
--   idx_appointment_status ON APPOINTMENT(status)
--   idx_dental_visit_patient_date ON DENTAL_VISIT(patient_id, visit_date)
--   idx_dental_visit_status ON DENTAL_VISIT(status)
--   idx_medical_visit_patient_date ON MEDICAL_VISIT(patient_id, visit_date)
--   idx_medical_visit_status ON MEDICAL_VISIT(status)
--   idx_odontogram_visit_tooth ON ODONTOGRAM(dental_record_id, tooth_number)
--   idx_patient_profile_patient ON PATIENT_PROFILE(patient_id)
--   idx_staff_staff_id ON STAFF(staff_id)
--   STAFF_PERMISSIONS_staff_id_key (unique) ON STAFF_PERMISSIONS(staff_id)

-- VITAL_SIGNS: no indexes existed (table created after the above migration).
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_recorded
    ON public."VITAL_SIGNS" USING btree (patient_id, recorded_at DESC);

-- APPOINTMENT: staff_id foreign key lookups (used by get_appointment_by_id, updates).
CREATE INDEX IF NOT EXISTS idx_appointment_staff_id
    ON public."APPOINTMENT" USING btree (staff_id);

-- MEDICAL_VISIT: staff_id foreign key lookups.
CREATE INDEX IF NOT EXISTS idx_medical_visit_staff_id
    ON public."MEDICAL_VISIT" USING btree (staff_id);

-- DENTAL_VISIT: staff_id foreign key lookups.
CREATE INDEX IF NOT EXISTS idx_dental_visit_staff_id
    ON public."DENTAL_VISIT" USING btree (staff_id);

-- PATIENT: patient_id lookups (used by get_by_id, enforce_patient_scope).
CREATE INDEX IF NOT EXISTS idx_patient_patient_id
    ON public."PATIENT" USING btree (patient_id);

-- STAFF_PERMISSIONS: permission column lookups (used by require_module checks).
CREATE INDEX IF NOT EXISTS idx_staff_permissions_staff_id
    ON public."STAFF_PERMISSIONS" USING btree (staff_id);