drop view if exists "public"."appointment_summary";

drop view if exists "public"."clinic_overview_stats";

drop view if exists "public"."medical_record_view";

drop view if exists "public"."patient_dental_tab";

drop view if exists "public"."patient_medical_tab";

drop view if exists "public"."patient_summary";


  create table "public"."PATIENT_ATTACHMENTS" (
    "id" uuid not null default gen_random_uuid(),
    "patient_id" text not null,
    "uploaded_by" text not null,
    "category" text not null,
    "file_name" text not null,
    "storage_path" text not null,
    "mime_type" text not null,
    "file_size" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "medical_visit_id" bigint
      );


alter table "public"."PATIENT_ATTACHMENTS" enable row level security;


  create table "public"."RESULTS" (
    "id" uuid not null default gen_random_uuid(),
    "patient_id" character varying(50),
    "chest_xray" text not null,
    "cbc" text not null,
    "urinalysis" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "recommendation" text
      );


alter table "public"."RESULTS" enable row level security;

alter table "public"."STAFF" alter column "position" set data type text using "position"::text;

alter table "public"."VITAL_SIGNS" drop column "blood_pressure";

alter table "public"."VITAL_SIGNS" drop column "eyes";

alter table "public"."VITAL_SIGNS" drop column "hearth_rate";

alter table "public"."VITAL_SIGNS" drop column "respiratory_rate";

alter table "public"."VITAL_SIGNS" add column "heart_rate" integer;

alter table "public"."VITAL_SIGNS" add column "height" real;

alter table "public"."VITAL_SIGNS" add column "spo2" real;

alter table "public"."VITAL_SIGNS" add column "weight" real;

alter table "public"."VITAL_SIGNS" alter column "patient_id" drop default;

alter table "public"."VITAL_SIGNS" alter column "recorded_at" set default now();

alter table "public"."VITAL_SIGNS" alter column "recorded_at" set not null;

alter table "public"."VITAL_SIGNS" alter column "recorded_at" set data type timestamp with time zone using "recorded_at"::timestamp with time zone;

CREATE UNIQUE INDEX "RESULTS_pkey" ON public."RESULTS" USING btree (id);

CREATE INDEX idx_patient_attachments_patient ON public."PATIENT_ATTACHMENTS" USING btree (patient_id);

CREATE INDEX idx_patient_attachments_patient_category ON public."PATIENT_ATTACHMENTS" USING btree (patient_id, category);

CREATE UNIQUE INDEX patient_attachments_pkey ON public."PATIENT_ATTACHMENTS" USING btree (id);

CREATE UNIQUE INDEX patient_attachments_storage_path_key ON public."PATIENT_ATTACHMENTS" USING btree (storage_path);

alter table "public"."PATIENT_ATTACHMENTS" add constraint "patient_attachments_pkey" PRIMARY KEY using index "patient_attachments_pkey";

alter table "public"."RESULTS" add constraint "RESULTS_pkey" PRIMARY KEY using index "RESULTS_pkey";

alter table "public"."PATIENT_ATTACHMENTS" add constraint "PATIENT_ATTACHMENTS_medical_visit_id_fkey" FOREIGN KEY (medical_visit_id) REFERENCES public."MEDICAL_VISIT"(id) ON UPDATE CASCADE not valid;

alter table "public"."PATIENT_ATTACHMENTS" validate constraint "PATIENT_ATTACHMENTS_medical_visit_id_fkey";

alter table "public"."PATIENT_ATTACHMENTS" add constraint "PATIENT_ATTACHMENTS_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES public."STAFF"(staff_id) ON UPDATE CASCADE not valid;

alter table "public"."PATIENT_ATTACHMENTS" validate constraint "PATIENT_ATTACHMENTS_uploaded_by_fkey";

alter table "public"."PATIENT_ATTACHMENTS" add constraint "patient_attachments_category_check" CHECK ((category = ANY (ARRAY['laboratory_result'::text, 'clinical_photo'::text]))) not valid;

alter table "public"."PATIENT_ATTACHMENTS" validate constraint "patient_attachments_category_check";

alter table "public"."PATIENT_ATTACHMENTS" add constraint "patient_attachments_file_size_check" CHECK (((file_size > 0) AND (file_size <= 10485760))) not valid;

alter table "public"."PATIENT_ATTACHMENTS" validate constraint "patient_attachments_file_size_check";

alter table "public"."PATIENT_ATTACHMENTS" add constraint "patient_attachments_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public."PATIENT"(patient_id) ON UPDATE CASCADE not valid;

alter table "public"."PATIENT_ATTACHMENTS" validate constraint "patient_attachments_patient_id_fkey";

alter table "public"."PATIENT_ATTACHMENTS" add constraint "patient_attachments_storage_path_key" UNIQUE using index "patient_attachments_storage_path_key";

alter table "public"."RESULTS" add constraint "RESULTS_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public."PATIENT"(patient_id) ON DELETE CASCADE not valid;

alter table "public"."RESULTS" validate constraint "RESULTS_patient_id_fkey";

alter table "public"."VITAL_SIGNS" add constraint "vital_signs_heart_rate_valid" CHECK (((heart_rate IS NULL) OR ((heart_rate >= 0) AND (heart_rate <= 300)))) not valid;

alter table "public"."VITAL_SIGNS" validate constraint "vital_signs_heart_rate_valid";

alter table "public"."VITAL_SIGNS" add constraint "vital_signs_height_positive" CHECK (((height IS NULL) OR (height > (0)::double precision))) not valid;

alter table "public"."VITAL_SIGNS" validate constraint "vital_signs_height_positive";

alter table "public"."VITAL_SIGNS" add constraint "vital_signs_spo2_valid" CHECK (((spo2 IS NULL) OR ((spo2 >= (0)::double precision) AND (spo2 <= (100)::double precision)))) not valid;

alter table "public"."VITAL_SIGNS" validate constraint "vital_signs_spo2_valid";

alter table "public"."VITAL_SIGNS" add constraint "vital_signs_temperature_valid" CHECK (((temperature IS NULL) OR ((temperature >= (25)::double precision) AND (temperature <= (45)::double precision)))) not valid;

alter table "public"."VITAL_SIGNS" validate constraint "vital_signs_temperature_valid";

alter table "public"."VITAL_SIGNS" add constraint "vital_signs_weight_positive" CHECK (((weight IS NULL) OR (weight > (0)::double precision))) not valid;

alter table "public"."VITAL_SIGNS" validate constraint "vital_signs_weight_positive";

create or replace view "public"."patient_medical_dental_summary" as  SELECT patient_id,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', mv.id, 'date', mv.visit_date, 'title', mv.complaint, 'notes', mv.treatment, 'staff_id', mv.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY mv.visit_date DESC) AS jsonb_agg
           FROM (public."MEDICAL_VISIT" mv
             LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)))
          WHERE (mv.patient_id = p.patient_id)), '[]'::jsonb) AS medical,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', dv.id, 'date', dv.visit_date, 'title', dv.status, 'notes', dv.notes, 'staff_id', dv.staff_id, 'provider', TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name))) ORDER BY dv.visit_date DESC) AS jsonb_agg
           FROM (public."DENTAL_VISIT" dv
             LEFT JOIN public."STAFF" s ON ((s.staff_id = dv.staff_id)))
          WHERE (dv.patient_id = p.patient_id)), '[]'::jsonb) AS dental
   FROM public."PATIENT_PROFILE" p;


create or replace view "public"."appointment_summary" as  SELECT a.id,
    a.patient_id,
    a.scheduled_start,
    a.scheduled_end,
    a.status,
    a.reason,
    a.notes,
    a.staff_id,
    TRIM(BOTH FROM concat_ws(' '::text, s.first_name, s.middle_name, s.last_name)) AS provider
   FROM (public."APPOINTMENT" a
     LEFT JOIN public."STAFF" s ON ((s.staff_id = a.staff_id)));


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


create or replace view "public"."medical_record_view" as  SELECT (mv.id)::text AS medical_visit_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.patient_id,
    pp.complete_address AS address,
    pp.barangay,
    (pp.age)::text AS age,
    pp.contact_no AS "mobileNumber",
    (pp.sex)::text AS sex,
    (pp.birthday)::text AS birthday,
    pp.civil_status,
    concat_ws(' - '::text, (pp.school_year)::text, pp.section) AS year_section,
    pp.course,
    mv.type,
    mv.status,
    mv.visit_date,
    mv.complaint,
    mv.treatment,
    mv.treatment_type,
    concat_ws(' '::text, s.first_name, s.middle_name, s.last_name) AS staff_name
   FROM ((public."MEDICAL_VISIT" mv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)))
     LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)));


create or replace view "public"."patient_dental_tab" as  SELECT dv.id,
    dv.patient_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.course,
    dv.visit_date,
    dv.staff_id,
    concat_ws(' '::text, s.first_name, s.middle_name, s.last_name) AS dentist,
    dv.status,
    dv.calculus_severity AS calculus,
    dv.current_medications AS medication,
    dv.notes
   FROM ((public."DENTAL_VISIT" dv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = dv.patient_id)))
     LEFT JOIN public."STAFF" s ON ((s.staff_id = dv.staff_id)));


create or replace view "public"."patient_medical_tab" as  SELECT mv.id,
    mv.patient_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.course,
    mv.visit_date,
    mv.staff_id,
    concat_ws(' '::text, s.first_name, s.middle_name, s.last_name) AS doctor,
    mv.status,
    mv.type AS treatment_type,
    mv.complaint,
    mv.treatment
   FROM ((public."MEDICAL_VISIT" mv
     JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)))
     LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)));


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


grant delete on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant insert on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant references on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant select on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant trigger on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant truncate on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant update on table "public"."PATIENT_ATTACHMENTS" to "anon";

grant delete on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant insert on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant references on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant select on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant trigger on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant truncate on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant update on table "public"."PATIENT_ATTACHMENTS" to "authenticated";

grant delete on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant insert on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant references on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant select on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant trigger on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant truncate on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant update on table "public"."PATIENT_ATTACHMENTS" to "service_role";

grant delete on table "public"."RESULTS" to "anon";

grant insert on table "public"."RESULTS" to "anon";

grant references on table "public"."RESULTS" to "anon";

grant select on table "public"."RESULTS" to "anon";

grant trigger on table "public"."RESULTS" to "anon";

grant truncate on table "public"."RESULTS" to "anon";

grant update on table "public"."RESULTS" to "anon";

grant delete on table "public"."RESULTS" to "authenticated";

grant insert on table "public"."RESULTS" to "authenticated";

grant references on table "public"."RESULTS" to "authenticated";

grant select on table "public"."RESULTS" to "authenticated";

grant trigger on table "public"."RESULTS" to "authenticated";

grant truncate on table "public"."RESULTS" to "authenticated";

grant update on table "public"."RESULTS" to "authenticated";

grant delete on table "public"."RESULTS" to "service_role";

grant insert on table "public"."RESULTS" to "service_role";

grant references on table "public"."RESULTS" to "service_role";

grant select on table "public"."RESULTS" to "service_role";

grant trigger on table "public"."RESULTS" to "service_role";

grant truncate on table "public"."RESULTS" to "service_role";

grant update on table "public"."RESULTS" to "service_role";


  create policy "patients_read_own_attachments"
  on "public"."PATIENT_ATTACHMENTS"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "PATIENT_ATTACHMENTS".patient_id) AND (p.id = ( SELECT auth.uid() AS uid))))));



  create policy "staff_manage_patient_attachments"
  on "public"."PATIENT_ATTACHMENTS"
  as permissive
  for all
  to authenticated
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'staff'::text))
with check ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'staff'::text));



  create policy "Staff can create results"
  on "public"."RESULTS"
  as permissive
  for insert
  to authenticated
with check ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'staff'::text));



  create policy "Patients can read staff"
  on "public"."STAFF"
  as permissive
  for select
  to authenticated
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = ANY (ARRAY['student'::text, 'professor'::text, 'faculty'::text])));



  create policy "Patients can manage their own vital signs"
  on "public"."VITAL_SIGNS"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "VITAL_SIGNS".patient_id) AND (p.id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "VITAL_SIGNS".patient_id) AND (p.id = auth.uid())))));


CREATE TRIGGER enforce_versioning_status_transition BEFORE UPDATE OF versioning_status ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_versioning_status_transition();

CREATE TRIGGER protect_active_lifecycle_states BEFORE DELETE ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.protect_active_lifecycle_states();

CREATE TRIGGER wake_lifecycle_on_policy_write AFTER INSERT OR UPDATE OF lifecycle_configuration_generation ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.wake_lifecycle_state();

CREATE TRIGGER wake_lifecycle_on_versioning_enable AFTER UPDATE OF versioning_status ON storage.buckets FOR EACH ROW WHEN ((new.lifecycle_configuration IS NOT NULL)) EXECUTE FUNCTION storage.wake_lifecycle_state();


