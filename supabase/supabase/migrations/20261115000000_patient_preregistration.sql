-- Patient pre-registration support
-- 1. Emergency contact columns on PATIENT_PROFILE
ALTER TABLE public."PATIENT_PROFILE"
    ADD COLUMN IF NOT EXISTS emergency_name text,
    ADD COLUMN IF NOT EXISTS emergency_relation text,
    ADD COLUMN IF NOT EXISTS emergency_phone text;

-- 2. Registration status + approval audit columns on PATIENT
ALTER TABLE public."PATIENT"
    ADD COLUMN IF NOT EXISTS registration_status text NOT NULL DEFAULT 'approved',
    ADD COLUMN IF NOT EXISTS approved_by text,
    ADD COLUMN IF NOT EXISTS approved_at timestamptz,
    ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Constrain allowed statuses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'patient_registration_status_check'
    ) THEN
        ALTER TABLE public."PATIENT"
            ADD CONSTRAINT patient_registration_status_check
            CHECK (registration_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_patient_registration_status
    ON public."PATIENT" (registration_status);

-- 3. RLS: allow a patient to self-register (insert own row as pending)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'PATIENT'
          AND policyname = 'Patients can self-register'
    ) THEN
        CREATE POLICY "Patients can self-register"
            ON public."PATIENT"
            FOR INSERT
            TO authenticated
            WITH CHECK (
                id = auth.uid()
                AND registration_status = 'pending'
            );
    END IF;
END $$;

-- 4. RLS: staff can update registration status (approve/reject)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'PATIENT'
          AND policyname = 'Staff can update registration status'
    ) THEN
        CREATE POLICY "Staff can update registration status"
            ON public."PATIENT"
            FOR UPDATE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public."STAFF" s
                    WHERE s.id = auth.uid()
                )
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public."STAFF" s
                    WHERE s.id = auth.uid()
                )
            );
    END IF;
END $$;
-- 5. Allow self-registering patients to insert their own related records
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='PATIENT_PROFILE' AND policyname='Patients can insert own profile') THEN
        CREATE POLICY "Patients can insert own profile"
            ON public."PATIENT_PROFILE"
            FOR INSERT
            TO authenticated
            WITH CHECK (EXISTS (
                SELECT 1 FROM public."PATIENT" p
                WHERE p.patient_id = "PATIENT_PROFILE".patient_id AND p.id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='MEDICAL_HISTORY' AND policyname='Patients can insert own medical history') THEN
        CREATE POLICY "Patients can insert own medical history"
            ON public."MEDICAL_HISTORY"
            FOR INSERT
            TO authenticated
            WITH CHECK (EXISTS (
                SELECT 1 FROM public."PATIENT" p
                WHERE p.patient_id = "MEDICAL_HISTORY".patient_id AND p.id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='FAMILY_MEDICAL_HISTORY' AND policyname='Patients can insert own family history') THEN
        CREATE POLICY "Patients can insert own family history"
            ON public."FAMILY_MEDICAL_HISTORY"
            FOR INSERT
            TO authenticated
            WITH CHECK (EXISTS (
                SELECT 1 FROM public."PATIENT" p
                WHERE p.patient_id = "FAMILY_MEDICAL_HISTORY".patient_id AND p.id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='VITAL_SIGNS' AND policyname='Patients can insert own vital signs') THEN
        CREATE POLICY "Patients can insert own vital signs"
            ON public."VITAL_SIGNS"
            FOR INSERT
            TO authenticated
            WITH CHECK (EXISTS (
                SELECT 1 FROM public."PATIENT" p
                WHERE p.patient_id = "VITAL_SIGNS".patient_id AND p.id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='RESULTS' AND policyname='Patients can insert own results') THEN
        CREATE POLICY "Patients can insert own results"
            ON public."RESULTS"
            FOR INSERT
            TO authenticated
            WITH CHECK (EXISTS (
                SELECT 1 FROM public."PATIENT" p
                WHERE p.patient_id = "RESULTS".patient_id AND p.id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='PATIENT_ATTACHMENTS' AND policyname='Patients can insert own attachments') THEN
        CREATE POLICY "Patients can insert own attachments"
            ON public."PATIENT_ATTACHMENTS"
            FOR INSERT
            TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public."PATIENT" p
                    WHERE p.patient_id = "PATIENT_ATTACHMENTS".patient_id AND p.id = auth.uid()
                )
                AND "PATIENT_ATTACHMENTS".uploaded_by = "PATIENT_ATTACHMENTS".patient_id
            );
    END IF;
END $$;
-- 6. OCR extracted content on PATIENT_ATTACHMENTS (nullable JSONB)
ALTER TABLE public."PATIENT_ATTACHMENTS"
    ADD COLUMN IF NOT EXISTS ocr_extracted_content jsonb;
