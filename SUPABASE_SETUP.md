# Asvior — Launch Checklist (Manual Dashboard Actions)

Everything in this file is a hosted-service dashboard action. The repo cannot
apply any of it automatically. Do these once, in this order, and the
launch-blocker set is closed.

Supabase project id: `rxhthyqirdafhkymztvb`
Dashboard: <https://supabase.com/dashboard/project/rxhthyqirdafhkymztvb>

---

## 1) Supabase → Authentication → URL Configuration

### Site URL

```
https://asvior.app
```

No trailing slash. No Lovable / Vercel-preview URL.

### Redirect URLs (allow-list) — must contain ALL 8 of these

The Asvior code sends the following `emailRedirectTo` / `redirectTo`
values. Every entry MUST be in the allow-list — otherwise Supabase silently
falls back to the Site URL:

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

---

## 2) Supabase → Authentication → Email Templates (CRITICAL — Lovable fix)

Open **Auth → Email Templates → Confirm signup**.

If the current template body contains **any raw URL** — especially anything
ending in `.lovable.app`, `.lovableproject.com`, `lovable-app.email`, a
Vercel preview subdomain, or an old Netlify domain — that is the cause of
the "verify email opened old Asvior / Lovable version" bug.

Click **Reset to default** so the button becomes:

```html
<a href="{{ .ConfirmationURL }}">Confirm your mail</a>
```

Repeat for **Reset password**, **Magic link**, **Change email address**, and
**Invite user**. All five templates must use their `{{ .*URL }}` placeholder
rather than a baked-in URL.

---

## 3) Supabase → Authentication → SMTP Settings (fixes `lovable-app.email` sender)

Emails currently arrive from `noreply@lovable-app.email` because the
Supabase project has a **Custom SMTP** left over from the Lovable-hosted
Asvior deployment. Supabase only offers ONE SMTP config per project, so we
have to either turn Custom SMTP OFF or replace it with our own provider.

### Option A — quickest (recommended for launch)

Auth → Settings → SMTP Settings → **turn OFF "Enable Custom SMTP"**.
Supabase falls back to its built-in sender (`noreply@mail.supabase.io`).
This is fine to launch on; you can bring your own domain later.

### Option B — sender identity `mail@asvior.app` via Resend (or SendGrid)

1. Sign in to Resend → Domains → **Add Domain** → `asvior.app`.
2. Add the DNS records Resend prints (SPF, DKIM, and the return-path MX)
   at your DNS provider (Cloudflare / Vercel DNS / Namecheap). Wait until
   Resend shows the domain "Verified" (5–20 min).
3. Resend → API Keys → **Create API Key** → name it `asvior-supabase-smtp`,
   permissions `Sending access`. Copy the value once (starts with `re_...`).
4. Back to Supabase → Auth → Settings → SMTP Settings → **Enable Custom
   SMTP** and paste:

   | Field | Value |
   | --- | --- |
   | Sender email | `noreply@asvior.app` |
   | Sender name | `Asvior` |
   | Host | `smtp.resend.com` |
   | Port | `465` |
   | Minimum interval between emails | `60` |
   | Username | `resend` |
   | Password | your Resend API key (`re_...`) |

5. Save. Send a **Test email** from the Supabase SMTP page to confirm.

---

## 4) Supabase → Authentication → Providers → Email

- **Enable Email provider** — ON
- **Confirm email** — ON
- **Secure email change** — ON

---

## 5) Vercel → Project Settings → Environment Variables

Set for **Production**, **Preview**, **Development** (unless noted):

| Key | Value | Environments |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://rxhthyqirdafhkymztvb.supabase.co` | all |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API → `anon` / `publishable` key | all |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` | all |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` | all |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key | **Production only** |
| `OPENROUTER_API_KEY` | your key from <https://openrouter.ai/keys> | all |
| `OPENROUTER_MODEL` *(optional)* | e.g. `google/gemini-2.0-flash-001` (default), or `openai/gpt-4o-mini`, `anthropic/claude-3.5-sonnet` | all |
| `OPENROUTER_SITE_URL` *(optional)* | `https://asvior.app` (used for OpenRouter attribution) | all |

**Delete** the following stale Vercel envs if they exist — the code no
longer reads them for anything auth-critical, and having them set can only
cause confusion:

- `AI_GATEWAY_API_KEY`, `AI_GATEWAY_BASE_URL`, `AI_GATEWAY_MODEL` (superseded by `OPENROUTER_*`; the code still falls back to these once but stop relying on them)
- `VITE_SITE_URL` (auth code ignores it on purpose; only set it if you knowingly want og:image to point somewhere other than `https://asvior.app`)

---

## 6) Sanity checklist before physical device test

- [ ] Supabase Site URL = `https://asvior.app`.
- [ ] Supabase Redirect URLs list contains all 8 entries in section 1.
- [ ] Supabase email templates (Confirm signup, Reset password, Magic link)
      use `{{ .ConfirmationURL }}` with **no** hard-coded domain.
- [ ] Supabase Custom SMTP is either OFF, or points at Resend/SendGrid on
      your own verified domain.
- [ ] Vercel Production has `OPENROUTER_API_KEY` set.
- [ ] Vercel Production has all four `SUPABASE_*` vars set.
- [ ] `https://asvior.app/api/health` returns `200` with
      `OPENROUTER_API_KEY: true`, `SUPABASE_URL: true`,
      `SUPABASE_PUBLISHABLE_KEY: true`.

Once every box is ticked, sign up with a **new** email address. Supabase
will not re-send a confirmation for an already-confirmed user; that is a
Supabase behaviour, not an Asvior bug.
