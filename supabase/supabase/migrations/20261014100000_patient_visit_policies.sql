-- Phase 3 RLS alignment: mirror the API authorization matrix.
--
-- The API layer (Phase 2) lets patient-type roles read their own
-- summary, which aggregates APPOINTMENT (already covered),
-- MEDICAL_VISIT and DENTAL_VISIT rows. Those two tables had staff
-- policies only, so patient summaries degraded to empty visit
-- arrays. The two SELECT policies below close that gap. Staff
-- coverage is untouched (existing FOR ALL staff policies OR with
-- these permissive additions).
--
-- Also hardens two pre-existing over-broad policies. See notes.

create policy "Patients can view their own medical visits"
on "public"."MEDICAL_VISIT"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "MEDICAL_VISIT".patient_id) AND (p.id = auth.uid())))));


create policy "Patients can view their own dental visits"
on "public"."DENTAL_VISIT"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "DENTAL_VISIT".patient_id) AND (p.id = auth.uid())))));


-- HARDENING 1: the patient odontogram policy was granted
-- TO public. auth.uid() is NULL for anon so it leaked no rows in
-- practice, but unauthenticated access must not be in the policy
-- set at all. Same predicate, correct audience.
drop policy if exists "Patient can view their own record" on "public"."ODONTOGRAM";

create policy "Patient can view their own record"
on "public"."ODONTOGRAM"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM public."PATIENT" p
  WHERE ((p.patient_id = "ODONTOGRAM".patient_id) AND (p.id = auth.uid())))));


-- HARDENING 2: STAFF was world-readable. "Enable read access for all
-- users" (USING (true), no TO clause) applied to anon as well as
-- authenticated. Staff rows are staff-visible only from here on,
-- via the existing "Staff can Interact with this table" policy
-- (role = 'staff'). Verified readers: the sidebar staff fetch uses
-- a staff JWT; login presence uses the service-role client (bypasses
-- RLS); record views LEFT JOIN staff names (patients see NULL
-- provider names, not errors). No anon reader exists.
drop policy if exists "Enable read access for all users" on "public"."STAFF";
