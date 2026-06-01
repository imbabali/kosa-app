-- ============================================================================
-- 20260601000000_add_data_api_grants.sql  — KOSA App
-- ============================================================================
-- PURPOSE
--   Encode explicit Data API (PostgREST) table grants for the roles that reach
--   the public-schema tables, so the schema replays cleanly onto a fresh
--   Supabase project/environment created under the new default.
--
-- BACKGROUND (Supabase discussion #45329 / changelog 2026-04-28)
--   Supabase is removing the automatic exposure of public-schema tables to the
--   Data API. Two effects:
--     (a) Tables created after the Oct 30 2026 cutover come up with NO Data API
--         grants -> "permission denied for table ...".
--     (b) Replaying this migration set onto a fresh project/environment created
--         under the new default reproduces (a) for every table here.
--   Existing tables on the live project KEEP their current grants, so this file
--   is a SAFE NO-OP there. GRANT is idempotent. The value is future-proofing.
--
-- GRANT STRATEGY (RLS-matching, faithful to 20260506164733_initial_schema.sql)
--   * anon          : NOT granted on any table. Every policy is `TO authenticated`
--                     and the whole portal (/portal/*) is gated at the proxy/
--                     middleware layer. The app never reaches these tables as anon.
--   * authenticated : granted ONLY the commands an RLS policy actually permits
--                     this role (cited per table below). Privileges remain gated
--                     by RLS at query time; the GRANT is the table-level
--                     prerequisite PostgREST checks first.
--   * service_role  : full SELECT/INSERT/UPDATE/DELETE on every table. It bypasses
--                     RLS, is server-only (createServiceRoleClient), never shipped
--                     to the browser, and matches Supabase's recommended template.
--
-- SEQUENCES: none. Primary keys are gen_random_uuid(), references to
--   auth.users(id)/profiles(id), or composite keys (event_rsvps, notice_reads).
--   No serial/bigserial columns exist, so no sequence grants are required.
--
-- STORAGE: the avatars bucket lives in the storage schema (storage.objects) and
--   is governed by Storage policies + the Storage API, not the public Data API.
--   It is unaffected by this change and is intentionally not touched here.
--
-- This migration grants on base tables only. It does NOT alter any table
-- definition, RLS policy, function, or the `private` schema.
-- Date: 2026-06-01
-- ============================================================================


-- ----------------------------------------------------------------------------
-- profiles
--   SELECT: "Authenticated users can read all profiles" TO authenticated USING (true)
--   UPDATE: "Users can update own profile" / "Admins can update any profile"
--   DELETE: "Admins can delete any profile"
--   INSERT: none — rows are created by the SECURITY DEFINER trigger
--           private.handle_new_user(), not via the Data API.
--   => authenticated: SELECT, UPDATE, DELETE  (no INSERT)
-- ----------------------------------------------------------------------------
grant select, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;

-- ----------------------------------------------------------------------------
-- events
--   SELECT: "Authenticated users read published events" / "Admins read all events"
--   ALL   : "Admins manage events"  => INSERT, UPDATE, DELETE (admin-gated by RLS)
--   => authenticated: SELECT, INSERT, UPDATE, DELETE
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on table public.events to authenticated;
grant select, insert, update, delete on table public.events to service_role;

-- ----------------------------------------------------------------------------
-- event_rsvps
--   SELECT: "Authenticated users read all RSVPs" USING (true)
--   INSERT: "Users insert own RSVPs"
--   UPDATE: "Users update own RSVPs"
--   DELETE: "Users delete own RSVPs"
--   => authenticated: SELECT, INSERT, UPDATE, DELETE
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on table public.event_rsvps to authenticated;
grant select, insert, update, delete on table public.event_rsvps to service_role;

-- ----------------------------------------------------------------------------
-- notices
--   SELECT: "Authenticated users read published notices"
--   ALL   : "Admins manage notices"  => INSERT, UPDATE, DELETE (admin-gated by RLS)
--   => authenticated: SELECT, INSERT, UPDATE, DELETE
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on table public.notices to authenticated;
grant select, insert, update, delete on table public.notices to service_role;

-- ----------------------------------------------------------------------------
-- notice_reads
--   ALL: "Users manage own notice reads"  => SELECT, INSERT, UPDATE, DELETE
--   => authenticated: SELECT, INSERT, UPDATE, DELETE
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on table public.notice_reads to authenticated;
grant select, insert, update, delete on table public.notice_reads to service_role;

-- ----------------------------------------------------------------------------
-- feedback
--   INSERT: "Users insert own feedback"
--   SELECT: "Users read own feedback" / "Admins read all feedback"
--   UPDATE: "Admins update feedback"
--   DELETE: none -> no DELETE grant for authenticated.
--   => authenticated: SELECT, INSERT, UPDATE  (no DELETE)
-- ----------------------------------------------------------------------------
grant select, insert, update on table public.feedback to authenticated;
grant select, insert, update, delete on table public.feedback to service_role;
