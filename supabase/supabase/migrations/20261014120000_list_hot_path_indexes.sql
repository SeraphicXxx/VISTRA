-- Hot-path read indexes (perf step 1). The schema shipped with a
-- single custom index (PATIENT.patient_id); every list orders,
-- filters, or joins on unindexed columns, and all paginated lists
-- run count="exact". These cover the filter/order/join keys of the
-- appointment, visit-tab, summary, and odontogram queries. Additive
-- only; IF NOT EXISTS throughout for safe re-runs.

create index if not exists "idx_appointment_patient_start"
    on "public"."APPOINTMENT" using "btree" ("patient_id", "scheduled_start");

create index if not exists "idx_appointment_status"
    on "public"."APPOINTMENT" using "btree" ("status");

create index if not exists "idx_medical_visit_patient_date"
    on "public"."MEDICAL_VISIT" using "btree" ("patient_id", "visit_date");

create index if not exists "idx_medical_visit_status"
    on "public"."MEDICAL_VISIT" using "btree" ("status");

create index if not exists "idx_dental_visit_patient_date"
    on "public"."DENTAL_VISIT" using "btree" ("patient_id", "visit_date");

create index if not exists "idx_dental_visit_status"
    on "public"."DENTAL_VISIT" using "btree" ("status");

create index if not exists "idx_patient_profile_patient"
    on "public"."PATIENT_PROFILE" using "btree" ("patient_id");

create index if not exists "idx_staff_staff_id"
    on "public"."STAFF" using "btree" ("staff_id");

create index if not exists "idx_odontogram_visit_tooth"
    on "public"."ODONTOGRAM" using "btree" ("dental_record_id", "tooth_number");
