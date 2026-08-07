/**
 * Push Asvior auth config + email templates to the hosted Supabase project.
 * Requires SUPABASE_ACCESS_TOKEN (Personal Access Token from supabase.com/dashboard/account/tokens).
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/update-supabase-auth-templates.mjs
 */

const PROJECT_REF = "ehfziddmhssffdvcxgzi";
const SITE_URL = "https://asvior.app";
const CALLBACK = `${SITE_URL}/auth/callback`;

const authPatch = {
  site_url: SITE_URL,
  uri_allow_list: [
    SITE_URL,
    `${CALLBACK}`,
    `${CALLBACK}?type=recovery`,
    `${CALLBACK}?type=email`,
    `${SITE_URL}/reset-password`,
    "asvior://asvior.app",
    "asvior://asvior.app/auth/callback",
    "asvior://asvior.app/auth/callback?type=recovery",
    "asvior://asvior.app/reset-password",
  ].join("\n"),
  mailer_subjects_confirmation: "Confirm your email — Asvior",
  mailer_templates_confirmation_content: `<h2>Confirm your email</h2>
<p>Tap the button below to verify your Asvior account.</p>
<p><a href="${CALLBACK}?token_hash={{ .TokenHash }}&type=email">Confirm email</a></p>`,

  mailer_subjects_recovery: "Reset your Asvior password",
  mailer_templates_recovery_content: `<h2>Reset your password</h2>
<p>We received a request to reset your password. Tap the button below to choose a new one.</p>
<p><a href="${CALLBACK}?token_hash={{ .TokenHash }}&type=recovery">Reset password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>`,

  mailer_subjects_magic_link: "Your Asvior sign-in link",
  mailer_templates_magic_link_content: `<h2>Sign in to Asvior</h2>
<p><a href="${CALLBACK}?token_hash={{ .TokenHash }}&type=magiclink">Sign in</a></p>`,
};

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens",
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const getRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  headers,
});
if (getRes.ok) {
  const current = await getRes.json();
  console.log("Current site_url:", current.site_url);
  console.log("Current confirmation template preview:", String(current.mailer_templates_confirmation_content ?? "").slice(0, 120));
}

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: "PATCH",
  headers,
  body: JSON.stringify(authPatch),
});

const body = await res.text();
if (!res.ok) {
  console.error("Failed to update auth config:", res.status, body);
  process.exit(1);
}

console.log("Supabase auth config updated successfully.");
console.log("site_url:", SITE_URL);
console.log("confirmation href:", `${CALLBACK}?token_hash={{ .TokenHash }}&type=email`);
console.log(body.slice(0, 500));
