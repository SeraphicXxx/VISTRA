-- Conserve history on staff delete: every FK pointing at
-- STAFF(staff_id) is NO ACTION, so deleting staff with linked
-- appointments, visits, created patients, or permissions is refused
-- with 23503 (surfaced as 409) instead of cascading or nulling.
-- Mirrors changes already applied on dev; keeps fresh environments
-- (staging/prod) identical. PATIENT.created_by already defaulted to
-- NO ACTION and is left untouched, as is STAFF.id (code-managed).

alter table "public"."APPOINTMENT"
    drop constraint "APPOINTMENT_staff_id_fkey",
    add constraint "APPOINTMENT_staff_id_fkey"
    foreign key ("staff_id") references "public"."STAFF"("staff_id")
    on update cascade on delete no action;

alter table "public"."DENTAL_VISIT"
    drop constraint "DENTAL_RECORD_staff_id_fkey",
    add constraint "DENTAL_RECORD_staff_id_fkey"
    foreign key ("staff_id") references "public"."STAFF"("staff_id")
    on update cascade on delete no action;

alter table "public"."MEDICAL_VISIT"
    drop constraint "MEDICAL_VISIT_staff_id_fkey",
    add constraint "MEDICAL_VISIT_staff_id_fkey"
    foreign key ("staff_id") references "public"."STAFF"("staff_id")
    on update cascade on delete no action;

alter table "public"."STAFF_PERMISSIONS"
    drop constraint "STAFF_PERMISSIONS_staff_id_fkey",
    add constraint "STAFF_PERMISSIONS_staff_id_fkey"
    foreign key ("staff_id") references "public"."STAFF"("staff_id")
    on update cascade on delete no action;
