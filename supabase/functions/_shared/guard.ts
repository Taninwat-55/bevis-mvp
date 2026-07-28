// supabase/functions/_shared/guard.ts
//
// Shared auth + abuse controls for every edge function.
//
// WHY THIS EXISTS — read before changing any of it:
//
// `verify_jwt = true` in config.toml does NOT mean "a logged-in user called this".
// It means "the request carried a JWT signed by this project". The anon key is
// exactly such a JWT, and it is published in the frontend bundle — so every
// visitor to bevisly.com can read it and call any function with curl. Functions
// that relied on `verify_jwt` alone were effectively public.
//
// The only real check is exchanging the caller's bearer token for a user via
// `auth.getUser()`. Passing the anon key there returns no user, which is the
// distinction `verify_jwt` cannot make.
//
// CORS is likewise not a control here. `ALLOWED_ORIGIN` is enforced by browsers
// and ignored by scripts; it protects users, never the backend.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://bevisly.com";

export const corsHeaders = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-client-timeout",
};

/** JSON response with CORS headers attached. */
export function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

/**
 * Service-role client. Bypasses RLS entirely, so any query made with it must
 * carry its own explicit ownership check — RLS will not save you here.
 */
export function serviceClient(): SupabaseClient {
    return createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
}

export type Caller = { id: string; email: string | null };

/**
 * Resolve the real user behind the request's bearer token.
 * Returns null for a missing token, the anon key, or an expired/invalid token.
 */
export async function getCaller(
    req: Request,
    db: SupabaseClient = serviceClient(),
): Promise<Caller | null> {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return null;

    try {
        const { data, error } = await db.auth.getUser(token);
        if (error || !data?.user) return null;
        return { id: data.user.id, email: data.user.email ?? null };
    } catch {
        return null;
    }
}

/** Best-effort client IP, used to bucket unauthenticated callers. */
export function clientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    return (
        req.headers.get("x-real-ip") ??
        (forwarded ? forwarded.split(",")[0].trim() : "") ??
        "unknown"
    ) || "unknown";
}

/**
 * Count one hit against a bucket and report whether it is within the limit.
 *
 * Backed by `check_rate_limit`, a SECURITY DEFINER function that bumps the
 * counter in a single atomic statement. Fails CLOSED — if the counter cannot be
 * written we deny, because a spend guard that silently switches off under load
 * is worse than an outage.
 */
export async function withinRateLimit(
    db: SupabaseClient,
    bucket: string,
    identifier: string,
    limit: number,
    windowSeconds: number,
): Promise<boolean> {
    try {
        const { data, error } = await db.rpc("check_rate_limit", {
            p_bucket: bucket,
            p_identifier: identifier,
            p_limit: limit,
            p_window_seconds: windowSeconds,
        });
        if (error) {
            console.error(`check_rate_limit failed for ${bucket}:`, error.message);
            return false;
        }
        return data === true;
    } catch (e) {
        console.error(`check_rate_limit threw for ${bucket}:`, e);
        return false;
    }
}

export const unauthorized = () =>
    json({ error: "You must be signed in to do this." }, 401);

export const forbidden = () =>
    json({ error: "You don't have access to this resource." }, 403);

export const rateLimited = (message = "Too many requests. Please try again later.") =>
    json({ error: message, isLimit: true }, 429);

/**
 * The standard opening for an authenticated function: resolve the caller, then
 * charge them one unit of their per-user budget.
 *
 * Returns either the caller or a Response the handler should return as-is.
 */
export async function requireUserWithinLimit(
    req: Request,
    db: SupabaseClient,
    bucket: string,
    limit: number,
    windowSeconds: number,
): Promise<{ caller: Caller } | { response: Response }> {
    const caller = await getCaller(req, db);
    if (!caller) return { response: unauthorized() };

    const ok = await withinRateLimit(db, bucket, caller.id, limit, windowSeconds);
    if (!ok) return { response: rateLimited() };

    return { caller };
}

/** Reject oversized free-text before it is ever pasted into a prompt. */
export function cappedText(
    value: unknown,
    maxChars: number,
    field: string,
): string | null {
    if (value === undefined || value === null) return null;
    if (typeof value !== "string") {
        throw new Error(`${field} must be a string`);
    }
    if (value.length > maxChars) {
        throw new Error(`${field} exceeds the maximum length of ${maxChars} characters`);
    }
    return value;
}
