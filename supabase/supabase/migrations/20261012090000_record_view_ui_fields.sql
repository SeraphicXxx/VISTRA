-- Expose UI-needed fields on the record views.
--
-- patient_summary: add personal-info columns consumed by
--   ViewStudentRecord.tsx (birthday, age, sex, civil_status,
--   mobile_number, barangay, address). Source columns live on
--   PATIENT_PROFILE; contact_no / complete_address are aliased to the
--   names the UI reads. The appointment/medical/dental jsonb blocks are
--   unchanged from 20261011090000_medical_visit_flat_log.sql.
--
-- medical_record_view: add visit_date, complaint, treatment,
--   treatment_type consumed by admin medicalViewRec.tsx. Base definition
--   unchanged from 20261009040723_remote_schema.sql except the STAFF join
--   is now LEFT (an orphaned staff_id previously hid the whole record).
--
-- CREATE OR REPLACE preserves existing grants/RLS on both views.

create or replace view "public"."patient_summary" as SELECT patient_id,
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


create or replace view "public"."medical_record_view" as SELECT (mv.id)::text AS medical_visit_id,
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
