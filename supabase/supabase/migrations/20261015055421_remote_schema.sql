create extension if not exists "pg_cron" with schema "pg_catalog";

drop policy "Enable read access for all users" on "public"."STAFF";

drop policy "Patient can view their own record" on "public"."ODONTOGRAM";

alter table "public"."DENTAL_VISIT" drop constraint "DENTAL_RECORD_staff_id_fkey";

alter table "public"."APPOINTMENT" drop constraint "APPOINTMENT_staff_id_fkey";

alter table "public"."MEDICAL_VISIT" drop constraint "MEDICAL_VISIT_staff_id_fkey";

drop view if exists "public"."medical_record_view";

drop view if exists "public"."medical_tab";

drop view if exists "public"."patient_summary";

alter table "public"."MEDICAL_VISIT" drop column "visit_log";

alter table "public"."MEDICAL_VISIT" add column "complaint" text not null default ''::text;

alter table "public"."MEDICAL_VISIT" add column "treatment" text not null default ''::text;

alter table "public"."STAFF" add column "is_active" boolean not null default false;

alter table "public"."STAFF" add column "role" text;

CREATE UNIQUE INDEX "STAFF_PERMISSIONS_staff_id_key" ON public."STAFF_PERMISSIONS" USING btree (staff_id);

CREATE INDEX idx_appointment_patient_start ON public."APPOINTMENT" USING btree (patient_id, scheduled_start);

CREATE INDEX idx_appointment_status ON public."APPOINTMENT" USING btree (status);

CREATE INDEX idx_dental_visit_patient_date ON public."DENTAL_VISIT" USING btree (patient_id, visit_date);

CREATE INDEX idx_dental_visit_status ON public."DENTAL_VISIT" USING btree (status);

CREATE INDEX idx_medical_visit_patient_date ON public."MEDICAL_VISIT" USING btree (patient_id, visit_date);

CREATE INDEX idx_medical_visit_status ON public."MEDICAL_VISIT" USING btree (status);

CREATE INDEX idx_odontogram_visit_tooth ON public."ODONTOGRAM" USING btree (dental_record_id, tooth_number);

CREATE INDEX idx_patient_profile_patient ON public."PATIENT_PROFILE" USING btree (patient_id);

CREATE INDEX idx_staff_staff_id ON public."STAFF" USING btree (staff_id);

alter table "public"."DENTAL_VISIT" add constraint "DENTAL_VISIT_staff_id_fkey" FOREIGN KEY (staff_id) REFERENCES public."STAFF"(staff_id) ON UPDATE CASCADE not valid;

alter table "public"."DENTAL_VISIT" validate constraint "DENTAL_VISIT_staff_id_fkey";

alter table "public"."STAFF_PERMISSIONS" add constraint "STAFF_PERMISSIONS_staff_id_key" UNIQUE using index "STAFF_PERMISSIONS_staff_id_key";

alter table "public"."APPOINTMENT" add constraint "APPOINTMENT_staff_id_fkey" FOREIGN KEY (staff_id) REFERENCES public."STAFF"(staff_id) ON UPDATE CASCADE not valid;

alter table "public"."APPOINTMENT" validate constraint "APPOINTMENT_staff_id_fkey";

alter table "public"."MEDICAL_VISIT" add constraint "MEDICAL_VISIT_staff_id_fkey" FOREIGN KEY (staff_id) REFERENCES public."STAFF"(staff_id) ON UPDATE CASCADE not valid;

alter table "public"."MEDICAL_VISIT" validate constraint "MEDICAL_VISIT_staff_id_fkey";

set check_function_bodies = off;

create or replace view "public"."clinic_overview_stats" as  SELECT ( SELECT count(*) AS count
           FROM public."APPOINTMENT" a
          WHERE ((a.scheduled_start)::date = CURRENT_DATE)) AS appointments_today,
    ( SELECT count(*) AS count
           FROM public."APPOINTMENT" a
          WHERE ((a.scheduled_start)::date = (CURRENT_DATE - 1))) AS appointments_yesterday,
    ( SELECT count(*) AS count
           FROM public."MEDICAL_VISIT" mv
          WHERE ((mv.visit_date)::date = CURRENT_DATE)) AS medical_today,
    ( SELECT count(*) AS count
           FROM public."MEDICAL_VISIT" mv
          WHERE ((mv.visit_date)::date = (CURRENT_DATE - 1))) AS medical_yesterday,
    ( SELECT count(*) AS count
           FROM public."DENTAL_VISIT" dv
          WHERE ((dv.visit_date)::date = CURRENT_DATE)) AS dental_today,
    ( SELECT count(*) AS count
           FROM public."DENTAL_VISIT" dv
          WHERE ((dv.visit_date)::date = (CURRENT_DATE - 1))) AS dental_yesterday,
    ( SELECT count(*) AS count
           FROM public."STAFF" s
          WHERE (s.is_active = true)) AS active_staff,
    ((( SELECT count(*) AS count
           FROM public."APPOINTMENT" a
          WHERE ((a.created_at)::date = CURRENT_DATE)) + ( SELECT count(*) AS count
           FROM public."MEDICAL_VISIT" mv
          WHERE ((mv.visit_date)::date = CURRENT_DATE))) + ( SELECT count(*) AS count
           FROM public."DENTAL_VISIT" dv
          WHERE ((dv.visit_date)::date = CURRENT_DATE))) AS records_today,
    ((( SELECT count(*) AS count
           FROM public."APPOINTMENT" a
          WHERE (((a.scheduled_start)::date = CURRENT_DATE) AND (lower(a.status) = ANY (ARRAY['pending'::text, 'confirmed'::text])))) + ( SELECT count(*) AS count
           FROM public."MEDICAL_VISIT" mv
          WHERE (((mv.visit_date)::date = CURRENT_DATE) AND (lower(mv.status) <> ALL (ARRAY['cleared'::text, 'completed'::text, 'declined'::text, 'recovered'::text]))))) + ( SELECT count(*) AS count
           FROM public."DENTAL_VISIT" dv
          WHERE (((dv.visit_date)::date = CURRENT_DATE) AND (lower(dv.status) <> ALL (ARRAY['cleared'::text, 'completed'::text, 'declined'::text, 'recovered'::text]))))) AS in_consultation,
    ( SELECT jsonb_agg(row_to_json(daily.*) ORDER BY daily.day) AS jsonb_agg
           FROM ( SELECT to_char(d.d, 'Dy'::text) AS day,
                    count(a.id) AS value
                   FROM (generate_series(((date_trunc('week'::text, (CURRENT_DATE)::timestamp with time zone))::date)::timestamp with time zone, (((date_trunc('week'::text, (CURRENT_DATE)::timestamp with time zone))::date + 6))::timestamp with time zone, '1 day'::interval) d(d)
                     LEFT JOIN public."APPOINTMENT" a ON (((a.scheduled_start)::date = d.d)))
                  GROUP BY d.d) daily) AS weekly_appointments,
    ( SELECT jsonb_build_object('medical', ( SELECT count(*) AS count
                   FROM public."MEDICAL_VISIT" mv
                  WHERE ((mv.visit_date)::date = CURRENT_DATE)), 'dental', ( SELECT count(*) AS count
                   FROM public."DENTAL_VISIT" dv
                  WHERE ((dv.visit_date)::date = CURRENT_DATE)), 'ojt', ( SELECT count(*) AS count
                   FROM public."APPOINTMENT" a
                  WHERE (((a.scheduled_start)::date = CURRENT_DATE) AND (a.reason ~~* '%fit to work%'::text))), 'other', ( SELECT count(*) AS count
                   FROM public."APPOINTMENT" a
                  WHERE (((a.scheduled_start)::date = CURRENT_DATE) AND ((a.reason IS NULL) OR (a.reason !~~* '%fit to work%'::text))))) AS jsonb_build_object) AS visit_mix;


CREATE OR REPLACE FUNCTION public.delete_dental_visit(p_visit_id bigint)
 RETURNS void
 LANGUAGE sql
AS $function$
  delete from public."ODONTOGRAM" where dental_record_id = p_visit_id;
  delete from public."DENTAL_VISIT" where id = p_visit_id;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_patient_records(p_patient_id text)
 RETURNS void
 LANGUAGE sql
AS $function$
  delete from public."APPOINTMENT" where patient_id = p_patient_id;
  delete from public."FAMILY_MEDICAL_HISTORY" where patient_id = p_patient_id;
  delete from public."PATIENT_PROFILE" where patient_id = p_patient_id;
  delete from public."PATIENT" where patient_id = p_patient_id;
$function$
;

create or replace view "public"."medical_record_view" as  SELECT (mv.id)::text AS medical_visit_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.patient_id,
    mv.type,
    mv.status,
    pp.course,
    mv.visit_date,
    mv.complaint,
    mv.treatment,
    mv.treatment_type,
    concat_ws(' '::text, s.first_name, s.middle_name, s.last_name) AS staff_name
   FROM ((public."MEDICAL_VISIT" mv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)))
     LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)));


create or replace view "public"."medical_tab" as  SELECT mv.id,
    mv.patient_id,
    mv.type,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.course,
    mv.visit_date,
    mv.staff_id,
    mv.status
   FROM (public."MEDICAL_VISIT" mv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)));


create or replace view "public"."patient_summary" as  SELECT patient_id,
    TRIM(BOTH FROM concat_ws(' '::text, first_name, middle_name, last_name)) AS patient_name,
    course,
    department,
    school_year,
    birthday,
    age,
    sex,
    civil_status,
    contact_no AS mobile_number,
    barangay,
    complete_address AS address,
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



  create policy "Patients can view their own dental visits"
  on "public"."DENTAL_VISIT"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "DENTAL_VISIT".patient_id) AND (p.id = auth.uid())))));



  create policy "Patients can view their own medical visits"
  on "public"."MEDICAL_VISIT"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "MEDICAL_VISIT".patient_id) AND (p.id = auth.uid())))));



  create policy "Staff can manage permissions"
  on "public"."STAFF_PERMISSIONS"
  as permissive
  for all
  to authenticated
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'staff'::text));



  create policy "Patient can view their own record"
  on "public"."ODONTOGRAM"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "ODONTOGRAM".patient_id) AND (p.id = auth.uid())))));



