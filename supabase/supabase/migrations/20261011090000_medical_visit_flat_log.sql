-- Flatten MEDICAL_VISIT.visit_log (jsonb) into real columns.
--
-- The API now submits a single complaint/treatment pair per visit, so the
-- jsonb wrapper only adds parsing overhead. patient_summary is the last
-- view reading visit_log; it is repointed at the new columns below.
--
-- DEPLOY ORDER: deploy the backend change that stops writing visit_log
-- (schemas/medical.py no longer includes the key) BEFORE applying this
-- migration. Old backend + new schema = insert failure on unknown column.

alter table "public"."MEDICAL_VISIT" add column "complaint" text not null default '';

alter table "public"."MEDICAL_VISIT" add column "treatment" text not null default '';

-- Backfill from the jsonb this replaces. Older rows predate the column
-- entirely (visit_log IS NULL); COALESCE covers both cases.
update "public"."MEDICAL_VISIT"
set complaint = coalesce(visit_log ->> 'complaint', ''),
    treatment = coalesce(visit_log ->> 'treatment', '');


create or replace view "public"."patient_summary" as  SELECT patient_id,
    TRIM(BOTH FROM concat_ws(' '::text, first_name, middle_name, last_name)) AS patient_name,
    course,
    department,
    school_year,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', a.id, 'date', a.scheduled_start, 'title', a.reason, 'notes', a.notes, 'staff_id', a.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY a.scheduled_start DESC) AS jsonb_agg
           FROM (public."APPOINTMENT" a
             LEFT JOIN public."STAFF" s ON ((s.staff_id = a.staff_id)))
          WHERE (a.patient_id = p.patient_id)), '[]'::jsonb) AS appointment,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', mv.id, 'date', mv.visit_date, 'title', mv.complaint, 'notes', mv.treatment, 'staff_id', mv.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY mv.visit_date DESC) AS jsonb_agg
           FROM (public."MEDICAL_VISIT" mv
             LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)))
          WHERE (mv.patient_id = p.patient_id)), '[]'::jsonb) AS medical,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', dv.id, 'date', dv.visit_date, 'title', dv.status, 'notes', dv.notes, 'staff_id', dv.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY dv.visit_date DESC) AS jsonb_agg
           FROM (public."DENTAL_VISIT" dv
             LEFT JOIN public."STAFF" s ON ((s.staff_id = dv.staff_id)))
          WHERE (dv.patient_id = p.patient_id)), '[]'::jsonb) AS dental
   FROM public."PATIENT_PROFILE" p;


alter table "public"."MEDICAL_VISIT" drop column "visit_log";
