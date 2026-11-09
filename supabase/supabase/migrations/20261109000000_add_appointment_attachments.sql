-- Add appointment_id column to PATIENT_ATTACHMENTS for patient-uploaded
-- appointment attachments (e.g. Fit to Work Certificate documents).
ALTER TABLE "public"."PATIENT_ATTACHMENTS"
    ADD COLUMN IF NOT EXISTS "appointment_id" bigint;

ALTER TABLE "public"."PATIENT_ATTACHMENTS"
    ADD CONSTRAINT "PATIENT_ATTACHMENTS_appointment_id_fkey"
    FOREIGN KEY (appointment_id) REFERENCES public."APPOINTMENT"(id)
    ON UPDATE CASCADE ON DELETE CASCADE not valid;

ALTER TABLE "public"."PATIENT_ATTACHMENTS" validate constraint "PATIENT_ATTACHMENTS_appointment_id_fkey";

-- RLS: patients can insert attachments under their own patient_id.
CREATE POLICY "Patients can upload their own attachments"
    ON "public"."PATIENT_ATTACHMENTS"
    AS permissive
    FOR insert
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public."PATIENT" p
            WHERE p.patient_id = "PATIENT_ATTACHMENTS".patient_id
            AND p.id = auth.uid()
        )
    );

-- RLS: patients can view their own attachments.
CREATE POLICY "Patients can view their own attachments"
    ON "public"."PATIENT_ATTACHMENTS"
    AS permissive
    FOR select
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public."PATIENT" p
            WHERE p.patient_id = "PATIENT_ATTACHMENTS".patient_id
            AND p.id = auth.uid()
        )
    );