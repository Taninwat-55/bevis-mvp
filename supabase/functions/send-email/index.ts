// supabase/functions/send-email/index.ts
//
// SECURITY: this function was an open relay. `verify_jwt = true` is satisfied by
// the public anon key, and `to` / `subject` / `html` came straight from the
// request — so anyone could send arbitrary mail FROM hello@bevisly.com. The cost
// was the small part; the real damage would have been bevisly.com landing on
// spam blocklists, which is very hard to undo.
//
// Two callers, two very different trust levels, so two explicit modes:
//
//   authenticated  — the app's transactional mail (offers, rejections, invites).
//                    Caller-supplied recipient and HTML are allowed because a
//                    real signed-in user is accountable for them, and the
//                    per-user rate limit bounds the blast radius.
//
//   contact        — the public landing-page contact form. NOTHING about the
//                    message is trusted: the recipient is fixed here in the
//                    function, the HTML is built here from three escaped fields,
//                    and it is limited per IP. A caller cannot choose who
//                    receives the mail or what markup it contains.
//
// An unauthenticated request may ONLY use contact mode. Anything else is 401.

import {
    clientIp,
    corsHeaders,
    getCaller,
    json,
    rateLimited,
    serviceClient,
    withinRateLimit,
} from "../_shared/guard.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "Bevisly <hello@bevisly.com>";

// Where the public contact form is allowed to send. Deliberately not overridable
// by the request — this constant is the whole point of contact mode.
const CONTACT_INBOX = "bevislyapp@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Signed-in users send the app's real transactional mail; generous, but finite.
const AUTHED_LIMIT = 30;
const AUTHED_WINDOW = 60 * 60;
// Visitors get enough to report a genuine problem, not enough to be useful spam.
const CONTACT_LIMIT = 3;
const CONTACT_WINDOW = 24 * 60 * 60;

const MAX_SUBJECT = 200;
const MAX_HTML = 100_000;
const MAX_CONTACT_FIELD = 5_000;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** Built here, from escaped values, so no caller markup can ever reach Resend. */
function contactTemplate(name: string, email: string, message: string): string {
    return `
        <div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">
            <h2>New contact enquiry</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <hr />
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
    `.trim();
}

async function sendViaResend(payload: Record<string, unknown>) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) {
        const detail = data?.message ?? data?.name ?? JSON.stringify(data);
        throw new Error(`Resend ${res.status}: ${detail}`);
    }
    return data;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        if (!RESEND_API_KEY) {
            throw new Error("Missing RESEND_API_KEY");
        }

        const body = await req.json();
        const { mode, to, subject, html, text, reply_to, name, message } = body;

        const db = serviceClient();
        const caller = await getCaller(req, db);

        // ── Contact mode: untrusted, tightly constrained ──────────────────────
        if (mode === "contact" || !caller) {
            if (mode !== "contact") {
                // An unauthenticated caller asking for anything other than the
                // contact form is exactly the abuse case.
                return json(
                    { error: "You must be signed in to send this email." },
                    401,
                );
            }

            const fromEmail = typeof reply_to === "string" ? reply_to.trim() : "";
            const fromName = typeof name === "string" ? name.trim() : "";
            const bodyText = typeof message === "string" ? message.trim() : "";

            if (!EMAIL_RE.test(fromEmail)) {
                return json({ error: "A valid email address is required." }, 400);
            }
            if (!fromName || !bodyText) {
                return json({ error: "Name and message are required." }, 400);
            }
            if (
                fromName.length > MAX_CONTACT_FIELD ||
                bodyText.length > MAX_CONTACT_FIELD ||
                fromEmail.length > 320
            ) {
                return json({ error: "Your message is too long." }, 400);
            }

            const ok = await withinRateLimit(
                db,
                "send-email:contact",
                clientIp(req),
                CONTACT_LIMIT,
                CONTACT_WINDOW,
            );
            if (!ok) {
                return rateLimited(
                    "You've already sent us a few messages. Please try again tomorrow.",
                );
            }

            // Recipient, subject and markup are all decided here, not by the caller.
            const data = await sendViaResend({
                to: [CONTACT_INBOX],
                subject: `📬 New Contact Inquiry from ${fromName.slice(0, 100)}`,
                html: contactTemplate(fromName, fromEmail, bodyText),
                reply_to: fromEmail,
            });
            return json({ id: data.id });
        }

        // ── Authenticated mode: the app's transactional mail ──────────────────
        const ok = await withinRateLimit(
            db,
            "send-email:authed",
            caller.id,
            AUTHED_LIMIT,
            AUTHED_WINDOW,
        );
        if (!ok) {
            return rateLimited("You've sent a lot of email recently. Please slow down.");
        }

        const toList = Array.isArray(to) ? to : [to];
        if (toList.length === 0 || toList.length > 10) {
            return json({ error: "Between 1 and 10 recipients are required." }, 400);
        }
        for (const addr of toList) {
            if (typeof addr !== "string" || !EMAIL_RE.test(addr)) {
                return json({ error: `Invalid email address: ${addr}` }, 400);
            }
        }
        if (typeof subject !== "string" || !subject || subject.length > MAX_SUBJECT) {
            return json({ error: "A subject under 200 characters is required." }, 400);
        }
        if (html !== undefined && (typeof html !== "string" || html.length > MAX_HTML)) {
            return json({ error: "Email body is too large." }, 400);
        }
        // Empty/absent falls back to the default, matching the previous behaviour —
        // several callers pass `someEmail || fallback` and could yield "".
        if (reply_to) {
            if (typeof reply_to !== "string" || !EMAIL_RE.test(reply_to)) {
                return json({ error: "Invalid reply_to address." }, 400);
            }
        }

        const data = await sendViaResend({
            to: toList,
            subject,
            html,
            text,
            reply_to: reply_to || "hello@bevisly.com",
        });
        return json({ id: data.id });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        console.error("send-email error:", message);
        // Kept at 200 so the existing clients can read the error body.
        return json({ error: message }, 200);
    }
});
