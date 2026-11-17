CREATE OR REPLACE VIEW patient_profiles_view AS
SELECT
    p.patient_id,
    p.registration_status,
    pp.id,
    pp.first_name,
    pp.middle_name,
    pp.last_name,
    pp.birthday,
    pp.age,
    pp.sex,
    pp.complete_address,
    pp.barangay,
    pp.civil_status,
    pp.course,
    pp.contact_no,
    pp.school_year,
    pp.department,
    pp.section,
    pp.person_type,
    pp.position,
    pp.emergency_name,
    pp.emergency_relation,
    pp.emergency_phone
FROM PATIENT p
INNER JOIN PATIENT_PROFILE pp ON p.patient_id = pp.patient_id;
