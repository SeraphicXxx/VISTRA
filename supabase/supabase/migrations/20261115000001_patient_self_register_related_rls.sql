-- Allow self-registering patients to insert their own related records
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
