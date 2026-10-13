-- Overview stats backend: staff presence flag + daily reset + stats view.
--
-- APPLY ORDER on the dev DB:
--   1. Enable the pg_cron extension first (Supabase Dashboard >
--      Database > Extensions). The CREATE EXTENSION below requires
--      a privileged role; skip it if already enabled via dashboard.
--   2. Run this whole file in the SQL editor.
--
-- TIMEZONE: pg_cron runs in UTC. 09:00 UTC == 17:00 PHT (UTC+8),
-- so the reset below fires at 5pm Manila time. Adjust if the
-- clinic observes a different close hour.


-- 1. Staff presence flag. Flipped by the backend on staff login;
-- read by the overview "Active Staff" card. Defaults false so
-- existing rows start the day signed out.
alter table "public"."STAFF"
    add column if not exists "is_active" boolean not null default false;


-- 2. Daily 5pm PHT sign-out. Idempotent: unschedule first so
-- re-running this file does not stack duplicate jobs.
create extension if not exists "pg_cron";

select "cron"."unschedule"('reset-staff-active')
where exists (
    select 1 from "cron"."job" where jobname = 'reset-staff-active'
);

select "cron"."schedule"(
    'reset-staff-active',
    '0 9 * * *',
    $$update "public"."STAFF" set "is_active" = false where "is_active" = true$$
);


-- 3. Single-row overview stats consumed by GET /overview/stats/.
-- Counts use CURRENT_DATE (server date). RLS flows through the
-- base tables via security_invoker, same convention as the
-- *_tab views.
create or replace view "public"."clinic_overview_stats"
with (security_invoker = true) as
select
    -- appointments booked for today / yesterday (card + delta)
    (select count(*)
        from "public"."APPOINTMENT" a
        where a.scheduled_start::date = current_date)              as appointments_today,
    (select count(*)
        from "public"."APPOINTMENT" a
        where a.scheduled_start::date = current_date - 1)          as appointments_yesterday,

    -- visits dated today / yesterday
    (select count(*)
        from "public"."MEDICAL_VISIT" mv
        where mv.visit_date::date = current_date)                  as medical_today,
    (select count(*)
        from "public"."MEDICAL_VISIT" mv
        where mv.visit_date::date = current_date - 1)             as medical_yesterday,
    (select count(*)
        from "public"."DENTAL_VISIT" dv
        where dv.visit_date::date = current_date)                  as dental_today,
    (select count(*)
        from "public"."DENTAL_VISIT" dv
        where dv.visit_date::date = current_date - 1)             as dental_yesterday,

    -- staff currently signed in (backend flips is_active on login)
    (select count(*)
        from "public"."STAFF" s
        where s.is_active = true)                                 as active_staff,

    -- records created today: appointments inserted today plus
    -- visits dated today (visits carry no created_at; visit_date
    -- is the closest proxy)
    ((select count(*)
        from "public"."APPOINTMENT" a
        where a.created_at::date = current_date)
     + (select count(*)
        from "public"."MEDICAL_VISIT" mv
        where mv.visit_date::date = current_date)
     + (select count(*)
        from "public"."DENTAL_VISIT" dv
        where dv.visit_date::date = current_date))                as records_today,

    -- in consultation: today's pending/confirmed appointments plus
    -- today's visits not in a terminal state. lower() absorbs the
    -- mixed label/key casing already stored in status columns.
    ((select count(*)
        from "public"."APPOINTMENT" a
        where a.scheduled_start::date = current_date
          and lower(a.status) in ('pending', 'confirmed'))
     + (select count(*)
        from "public"."MEDICAL_VISIT" mv
        where mv.visit_date::date = current_date
          and lower(mv.status) not in ('cleared', 'completed', 'declined', 'recovered'))
     + (select count(*)
        from "public"."DENTAL_VISIT" dv
        where dv.visit_date::date = current_date
          and lower(dv.status) not in ('cleared', 'completed', 'declined', 'recovered'))
    )                                                             as in_consultation,

    -- weekly appointment buckets, Mon-Sun of the current week,
    -- zero-filled so the chart always has 7 bars
    (select jsonb_agg(row_to_json(daily) order by daily.day)
        from (select to_char(d, 'Dy') as day, count(a.id) as value
              from generate_series(
                       date_trunc('week', current_date)::date,
                       date_trunc('week', current_date)::date + 6,
                       '1 day') d
              left join "public"."APPOINTMENT" a
                on a.scheduled_start::date = d
              group by d) daily)                                  as weekly_appointments,

    -- today's visit mix: medical / dental visits plus
    -- fit-to-work ("OJT") vs other appointments. Appointment type
    -- is stored in the reason column, hence the ILIKE match.
    (select jsonb_build_object(
        'medical', (select count(*)
            from "public"."MEDICAL_VISIT" mv
            where mv.visit_date::date = current_date),
        'dental', (select count(*)
            from "public"."DENTAL_VISIT" dv
            where dv.visit_date::date = current_date),
        'ojt', (select count(*)
            from "public"."APPOINTMENT" a
            where a.scheduled_start::date = current_date
              and a.reason ilike '%fit to work%'),
        'other', (select count(*)
            from "public"."APPOINTMENT" a
            where a.scheduled_start::date = current_date
              and (a.reason is null or a.reason not ilike '%fit to work%'))
    ))                                                            as visit_mix;


grant select on "public"."clinic_overview_stats" to authenticated;
grant select on "public"."clinic_overview_stats" to service_role;
