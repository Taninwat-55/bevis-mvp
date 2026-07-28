-- Revoke EXECUTE on privileged RPCs from anonymous callers.
--
-- Supersedes 20260516161000_revoke_anon_dangerous_rpcs.sql, which was never
-- applied AND would not have worked if it had been. Postgres grants EXECUTE to
-- PUBLIC by default, and `anon` inherits that grant — so
-- `REVOKE ... FROM anon` leaves the PUBLIC grant untouched and
-- has_function_privilege('anon', ...) stays true. Verified against the live
-- database before writing this: after running the old file's statements inside a
-- transaction, anon could still execute every one of them. The revoke has to
-- target PUBLIC.
--
-- Before this migration, any visitor holding the (public) anon key could call
-- distribute_credits / spend_credits / deduct_credits to manipulate the credit
-- ledger, or delete_user_account to destroy accounts, straight over /rest/v1/rpc.
--
-- Scope is deliberate, and each group was checked against real usage:
--
--   trigger functions        revoked from everyone. Triggers execute as the table
--                            owner, so no caller needs EXECUTE.
--
--   credit/account mutators  revoked from PUBLIC + anon, granted back to
--                            `authenticated` — the frontend calls all six of these
--                            directly as a signed-in user.
--
--   is_admin, is_company_member, is_company_admin_or_owner, is_demo_admin
--                            DELIBERATELY UNTOUCHED. They are evaluated inside RLS
--                            policies that apply to the `public` role, including
--                            "Public profiles are viewable by everyone" — revoking
--                            would break anonymous browsing of proof cards. They
--                            only report on the caller (returning false for anon),
--                            so leaving them is not a risk.

-- ── Trigger functions: nothing should ever call these directly ────────────────
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                 FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_job()                  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_role_change()             FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lock_rubric_on_first_submission() FROM PUBLIC, anon, authenticated;

-- ── Credit / account mutators: signed-in users only ───────────────────────────
REVOKE EXECUTE ON FUNCTION public.deduct_credits(uuid, integer)                 FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.distribute_credits(uuid, integer, text, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.spend_credits(uuid, integer, text, uuid)      FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_credit_balance(uuid)                      FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_recent_activity(uuid)                     FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.delete_user_account()                         FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.deduct_credits(uuid, integer)                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.distribute_credits(uuid, integer, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, integer, text, uuid)      TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_credit_balance(uuid)                      TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_activity(uuid)                     TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_account()                         TO authenticated;

-- NOTE: this closes the ANONYMOUS hole only. Any *authenticated* user can still
-- call distribute_credits(<any user id>, <any amount>) and mint credits — these
-- functions do not check auth.uid() against their arguments. Fixing that properly
-- means either enforcing the caller's identity inside each function or moving them
-- behind an edge function on the service role. Tracked separately; it is a
-- behaviour change, not a grant change.
