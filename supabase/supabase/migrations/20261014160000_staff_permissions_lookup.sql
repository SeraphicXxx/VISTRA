-- Lookup index for module enforcement: require_module() reads
-- STAFF_PERMISSIONS by staff_id on every staff request through the
-- domain routers. Small table today, but the access path should
-- never depend on a sequential scan.

create index if not exists "idx_staff_permissions_staff"
    on "public"."STAFF_PERMISSIONS" using "btree" ("staff_id");
