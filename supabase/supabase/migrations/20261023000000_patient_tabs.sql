-- Views supporting the patient portal medical/dental tabs.

create or replace view "public"."patient_medical_tab" as
SELECT mv.id,
    mv.patient_id,
    concat_ws(' '::text, pp.first_name, pp.middle_name, pp.last_name) AS patient_name,
    pp.course,
    mv.visit_date,
    mv.staff_id,
    concat_ws(' '::text, s.first_name, s.middle_name, s.last_name) AS doctor,
    mv.status,
    mv.type,
    mv.treatment_type,
    mv.complaint,
    mv.treatmentFROM ((public."MEDICAL_VISIT" mv
  JOIN public."PATIENT_PROFILE" pp ON ((pp.patient_id = mv.patient_id)))
  LEFT JOIN public."STAFF" s ON ((s.staff_id = mv.staff_id)));


create or replace view "public"."patient_dental_tab" as
SELECT dv.id,
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