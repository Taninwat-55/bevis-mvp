-- Rate limiting for edge functions (AI spend + email abuse control).
--
-- Context: the AI and email functions were reachable by anyone holding the public
-- anon key, with no per-caller ceiling. This adds the counter storage and the
-- atomic check the functions now call before doing any paid work.
--
-- Why a new table rather than reusing ai_usage_logs: ai_usage_logs and
-- check_ai_rate_limit were created outside the migration history (schema drift —
-- they exist in the live database but not in this repo), and check_ai_rate_limit
-- is IP-only with a fixed window. This generalises to per-user or per-IP buckets
-- with a caller-supplied window, and is version-controlled from the start.
-- check_ai_rate_limit is intentionally left in place so nothing breaks mid-deploy.

CREATE TABLE IF NOT EXISTS public.rate_limit_counters (
    bucket       text        NOT NULL,
    identifier   text        NOT NULL,
    window_start timestamptz NOT NULL DEFAULT now(),
    count        integer     NOT NULL DEFAULT 0,
    updated_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (bucket, identifier)
);

-- Only ever touched by SECURITY DEFINER functions and the service role. RLS on
-- with no policies = no direct client access at all, which is what we want.
ALTER TABLE public.rate_limit_counters ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS rate_limit_counters_window_start_idx
    ON public.rate_limit_counters (window_start);

-- Drop old rows whose window closed long ago. Nothing reads an expired window,
-- so these are pure dead weight; the widest window in use is 24h.
CREATE OR REPLACE FUNCTION public.prune_rate_limit_counters()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    DELETE FROM public.rate_limit_counters
    WHERE window_start < now() - interval '48 hours';
$$;

-- Count one hit against (bucket, identifier); return true when still within
-- p_limit for the trailing p_window_seconds.
--
-- The counter is bumped in ONE statement. A read-then-write version would let N
-- concurrent requests all read the same count and all pass — which is precisely
-- the hole this was written to close, so keep it a single INSERT ... ON CONFLICT.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_bucket         text,
    p_identifier     text,
    p_limit          integer,
    p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_count  integer;
    v_cutoff timestamptz := now() - make_interval(secs => p_window_seconds);
BEGIN
    -- No identifier means we cannot attribute the call, so we cannot allow it.
    IF p_identifier IS NULL OR length(trim(p_identifier)) = 0 THEN
        RETURN false;
    END IF;

    INSERT INTO public.rate_limit_counters AS rlc
        (bucket, identifier, window_start, count, updated_at)
    VALUES
        (p_bucket, p_identifier, now(), 1, now())
    ON CONFLICT (bucket, identifier) DO UPDATE SET
        count = CASE
            WHEN rlc.window_start < v_cutoff THEN 1
            ELSE rlc.count + 1
        END,
        window_start = CASE
            WHEN rlc.window_start < v_cutoff THEN now()
            ELSE rlc.window_start
        END,
        updated_at = now()
    RETURNING rlc.count INTO v_count;

    -- Opportunistic housekeeping so the table cannot grow without bound (IP
    -- buckets in particular). ~1 in 1000 calls pays for the sweep.
    IF random() < 0.001 THEN
        PERFORM public.prune_rate_limit_counters();
    END IF;

    RETURN v_count <= p_limit;
END;
$$;

-- Callable only by the service role (i.e. edge functions). Never by a browser:
-- a client that can call this can also exhaust its own budget, or worse, someone
-- else's, by passing an arbitrary identifier.
REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer)
    FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prune_rate_limit_counters()
    FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer)
    TO service_role;
GRANT EXECUTE ON FUNCTION public.prune_rate_limit_counters()
    TO service_role;
