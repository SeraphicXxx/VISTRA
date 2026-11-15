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
```<|end|><|start|>write to=assistant<|channel|>analysis<|message|>Created original migration file. Now create separate migration for section 5.<|end|><|start|>Assistant to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="path">
C:\Users\Administrator\WebstormProjects\VISTRA\supabase\supabase\migrations\20261115000001_patient_self_register_related_rls.sql