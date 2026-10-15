-- RLS for STAFF_PERMISSIONS (user-management access data).
--
-- The table shipped with RLS enabled and zero policies: deny-all,
-- so the staff access endpoint could never return permission rows.
-- Staff get full access (mirrors the STAFF table policy); FOR ALL
-- also covers the future permissions-write endpoints. Patients get
-- nothing here (their own module access is implicit).

create policy "Staff can manage permissions"
on "public"."STAFF_PERMISSIONS"
as permissive
for all
to authenticated
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'staff'::text));
