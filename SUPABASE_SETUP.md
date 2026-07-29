# Asvior — Supabase Dashboard Configuration (REQUIRED for auth to work)

Supabase's hosted project settings live only in the **Supabase Dashboard** —
this repo's `supabase/config.toml` is used by the local `supabase` CLI and is
NOT applied to the hosted project automatically. Every value below must be
set in the dashboard **exactly as shown**, otherwise sign-up / password-reset
emails will either 404 or fall back to the wrong site.

Project: `rxhthyqirdafhkymztvb`
Dashboard: <https://supabase.com/dashboard/project/rxhthyqirdafhkymztvb>

## 1) Authentication → URL Configuration

### Site URL

```
https://asvior.app
```

Nothing else. No trailing slash. No Lovable / Vercel-preview URL.

### Redirect URLs (allow-list)

The Asvior code sends the following `emailRedirectTo` / `redirectTo` values
to Supabase. Every one of them MUST be present in the allow-list — otherwise
Supabase silently falls back to the Site URL and the callback route never
runs (so the session is never created client-side):

```
https://asvior.app
https://asvior.app/auth/callback
https://asvior.app/auth/callback?type=recovery
https://asvior.app/reset-password
asvior://asvior.app
asvior://asvior.app/auth/callback
asvior://asvior.app/auth/callback?type=recovery
asvior://asvior.app/reset-password
```

Paste them one per line. Supabase treats the query-string variants as
distinct entries (that is why `?type=recovery` is listed twice) — do not
skip them.

## 2) Authentication → Email Templates

Open **Auth → Email Templates → Confirm signup**.

Supabase's default body uses the placeholder `{{ .ConfirmationURL }}`, which
resolves to a URL that already carries our `redirect_to`. If the current
template contains **any raw URL** — especially anything ending in
`.lovable.app`, `.lovableproject.com`, a Vercel preview subdomain, or an old
Netlify domain — that is the cause of the "verify email opened old Asvior /
Lovable version" bug.

Fix by clicking **Reset to default** on that template so the button becomes:

```html
<a href="{{ .ConfirmationURL }}">Confirm your mail</a>
```

Repeat for **Reset password**, **Magic link**, **Change email address**, and
**Invite user** — they must all use their `{{ .*URL }}` placeholder rather
than a baked-in URL.

## 3) Authentication → Providers → Email

- **Enable Email provider** — ON
- **Confirm email** — ON
- **Secure email change** — ON

## 4) Environment variables (Vercel + local dev)

Set these in Vercel Project Settings → Environment Variables (Production,
Preview, Development):

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://rxhthyqirdafhkymztvb.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → API → `publishable / anon` key |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` (server-side reads use this name) |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vercel only, never committed.** Supabase Dashboard → API → `service_role` key |
| `AI_GATEWAY_BASE_URL` | e.g. `https://gateway.ai.cloudflare.com/v1/<account>/asvior/openai` |
| `AI_GATEWAY_API_KEY` | your gateway key |

`VITE_SITE_URL` is **intentionally NOT required** — the auth redirect
helpers hard-code `https://asvior.app` regardless of any env override, so
that no future stale env can point auth flows at the wrong domain.

## 5) Sanity checklist

- [ ] Site URL is `https://asvior.app` (no trailing slash).
- [ ] Redirect URLs include all 8 entries in section 1.
- [ ] `Confirm signup` email body uses `{{ .ConfirmationURL }}` with **no**
      hard-coded domain in the anchor `href`.
- [ ] `Reset password` email body uses `{{ .ConfirmationURL }}`.
- [ ] `Enable email provider` and `Confirm email` are both ON.
- [ ] Vercel production `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`
      match the values in the Supabase dashboard (Settings → API).

Once every box is ticked, sign up with a **new** email address (do not
retry an existing user; Supabase will not re-send a link for a confirmed
account). The confirmation email should land in `https://asvior.app/auth/callback?code=…`.
