-- Atomic multi-table deletes: each function runs its statements in a
-- single implicit transaction, so a mid-sequence failure rolls back
-- instead of orphaning child rows.
-- Apply with: supabase db push (or your normal migration flow) BEFORE
-- deploying the backend code that calls these RPCs.

create or replace function public.delete_dental_visit(p_visit_id bigint)
returns void
language sql
as $$
  delete from public."ODONTOGRAM" where dental_record_id = p_visit_id;
  delete from public."DENTAL_VISIT" where id = p_visit_id;
$$;


create or replace function public.delete_patient_records(p_patient_id text)
returns void
language sql
as $$
  delete from public."PATIENT_PROFILE" where patient_id = p_patient_id;
  delete from public."PATIENT" where patient_id = p_patient_id;
$$;
