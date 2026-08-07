# Asvior — Supabase Dashboard Configuration (REQUIRED for auth to work)

Supabase's hosted project settings live only in the **Supabase Dashboard** —
this repo's `supabase/config.toml` is used by the local `supabase` CLI and is
NOT applied to the hosted project automatically. Every value below must be
set in the dashboard **exactly as shown**, otherwise sign-up / password-reset
emails will either 404 or fall back to the wrong site.

Project: `ehfziddmhssffdvcxgzi`
Dashboard: <https://supabase.com/dashboard/project/ehfziddmhssffdvcxgzi>

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

**Critical:** Email links must use `token_hash` so confirmation and password reset work when the mail app opens a different browser. The old `{{ .ConfirmationURL }}` PKCE redirect causes **"PKCE code verifier not found in storage"** because the code verifier lives only in the browser where sign-up started.

Open **Auth → Email Templates** and set each template body as follows.

### Confirm signup

Subject (keep default or use): `Confirm your email — Asvior`

Body — **use the hard-coded domain. Do NOT use `{{ .SiteURL }}`** (an empty Site URL produces broken links like `http:///auth/callback`):

```html
<h2>Confirm your email</h2>
<p>Tap the button below to verify your Asvior account.</p>
<p>
  <a href="https://asvior.app/auth/callback?token_hash={{ .TokenHash }}&type=email">
    Confirm email
  </a>
</p>
```

### Reset password

Subject: `Reset your Asvior password`

Body:

```html
<h2>Reset your password</h2>
<p>We received a request to reset your password. Tap the button below to choose a new one.</p>
<p>
  <a href="https://asvior.app/auth/callback?token_hash={{ .TokenHash }}&type=recovery">
    Reset password
  </a>
</p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

### Magic link (if enabled later)

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Sign in</a>
```

Repeat the same pattern for **Change email address** and **Invite user** — always use `{{ .TokenHash }}`, never a hard-coded domain or `{{ .ConfirmationURL }}` alone.

You can apply these via the Supabase Dashboard or run:

```bash
SUPABASE_ACCESS_TOKEN=... node scripts/update-supabase-auth-templates.mjs
```

## 3) Authentication → Providers → Email

- **Enable Email provider** — ON
- **Confirm email** — ON
- **Secure email change** — ON

## 4) Environment variables (Vercel + local dev)

Set these in Vercel Project Settings → Environment Variables (Production,
Preview, Development):

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://ehfziddmhssffdvcxgzi.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → API → `publishable / anon` key |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` (server-side reads use this name) |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vercel only, never committed.** Supabase Dashboard → API → `service_role` key |
| `OPENROUTER_API_KEY` | **Vercel only, never committed.** Your OpenRouter API key for Asvior AI. |
| `OPENROUTER_MODEL` | Optional; defaults to `openrouter/free`. |

`VITE_SITE_URL` is **intentionally NOT required** — the auth redirect
helpers hard-code `https://asvior.app` regardless of any env override, so
that no future stale env can point auth flows at the wrong domain.

## 5) Sanity checklist

- [ ] Site URL is `https://asvior.app` (no trailing slash).
- [ ] Redirect URLs include all 8 entries in section 1.
- [ ] `Confirm signup` email body uses hard-coded `https://asvior.app/auth/callback?token_hash={{ .TokenHash }}&type=email` — **not** `{{ .SiteURL }}`.
- [ ] `Reset password` email body uses hard-coded `https://asvior.app/auth/callback?token_hash={{ .TokenHash }}&type=recovery`.
- [ ] `Enable email provider` and `Confirm email` are both ON.
- [ ] Vercel production `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`
      match the values in the Supabase dashboard (Settings → API).

Once every box is ticked, sign up with a **new** email address (do not
retry an existing user; Supabase will not re-send a link for a confirmed
account). The confirmation email should link to
`https://asvior.app/auth/callback?token_hash=…&type=email`.
Password reset emails should link to
`https://asvior.app/auth/callback?token_hash=…&type=recovery`.
