drop policy "Patients can view their own profile" on "public"."PATIENT";

drop view if exists "public"."medical_tab";

drop view if exists "public"."patient_summary";

alter table "public"."APPOINTMENT" add column "scheduled_to" jsonb default '{"date": "", "time": ""}'::jsonb;

alter table "public"."MEDICAL_VISIT" add column "treatment_type" text;

alter table "public"."MEDICAL_VISIT" alter column "visit_date" set default now();

create or replace view "public"."medical_record_view" as  SELECT (mv.id)::text AS medical_visit_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.patient_id,
    mv.type,
    mv.status,
    pp.course,
    concat_ws(' '::text, s.first_name, s.middle_name, s.last_name) AS staff_name
   FROM ((public."MEDICAL_VISIT" mv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)))
     JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)));


create or replace view "public"."medical_tab" as  SELECT mv.id,
    mv.patient_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.course,
    mv.visit_date,
    mv.type,
    mv.staff_id,
    mv.status
   FROM (public."MEDICAL_VISIT" mv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)));


create or replace view "public"."patient_summary" as  SELECT patient_id,
    TRIM(BOTH FROM concat_ws(' '::text, first_name, middle_name, last_name)) AS patient_name,
    course,
    department,
    school_year,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', a.id, 'date', a.scheduled_start, 'title', a.reason, 'notes', a.notes, 'staff_id', a.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY a.scheduled_start DESC) AS jsonb_agg
           FROM (public."APPOINTMENT" a
             LEFT JOIN public."STAFF" s ON ((s.staff_id = a.staff_id)))
          WHERE (a.patient_id = p.patient_id)), '[]'::jsonb) AS appointment,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', mv.id, 'date', COALESCE(NULLIF((mv.visit_log ->> 'date'::text), ''::text), (mv.visit_date)::text), 'title', (mv.visit_log ->> 'complaint'::text), 'notes', (mv.visit_log ->> 'treatment'::text), 'staff_id', mv.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY mv.visit_date DESC) AS jsonb_agg
           FROM (public."MEDICAL_VISIT" mv
             LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)))
          WHERE (mv.patient_id = p.patient_id)), '[]'::jsonb) AS medical,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', dv.id, 'date', dv.visit_date, 'title', dv.status, 'notes', dv.notes, 'staff_id', dv.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY dv.visit_date DESC) AS jsonb_agg
           FROM (public."DENTAL_VISIT" dv
             LEFT JOIN public."STAFF" s ON ((s.staff_id = dv.staff_id)))
          WHERE (dv.patient_id = p.patient_id)), '[]'::jsonb) AS dental
   FROM public."PATIENT_PROFILE" p;



  create policy "Patients can make their own appointments"
  on "public"."APPOINTMENT"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "APPOINTMENT".patient_id) AND (p.id = auth.uid())))));



  create policy "Patients can view their own appointments"
  on "public"."APPOINTMENT"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "APPOINTMENT".patient_id) AND (p.id = auth.uid())))));



  create policy "Staff can interact with this table"
  on "public"."MEDICAL_VISIT"
  as permissive
  for all
  to authenticated
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'staff'::text) AND (EXISTS ( SELECT 1
   FROM public."STAFF" s
  WHERE (s.id = auth.uid())))));



  create policy "Patient can view their own record"
  on "public"."ODONTOGRAM"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "ODONTOGRAM".patient_id) AND (p.id = auth.uid())))));



  create policy "Enable users to view their own data only"
  on "public"."PATIENT"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Patient can view their own records"
  on "public"."PATIENT_PROFILE"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "PATIENT_PROFILE".patient_id) AND (p.id = auth.uid())))));



