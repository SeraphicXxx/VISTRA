-- Staff job role (Super Administrator / Doctor / Nurse / ...) for
-- the user-management page. Nullable: existing STAFF rows predate
-- the field and stay NULL until updated. Plain text (not an enum):
-- job titles evolve in product, not in migrations.

alter table "public"."STAFF" add column if not exists "role" text;
