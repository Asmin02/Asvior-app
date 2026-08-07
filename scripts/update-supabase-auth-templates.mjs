/**
 * Push Asvior auth email templates to the hosted Supabase project.
 * Requires SUPABASE_ACCESS_TOKEN (Personal Access Token from supabase.com/dashboard/account/tokens).
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/update-supabase-auth-templates.mjs
 */

const PROJECT_REF = "ehfziddmhssffdvcxgzi";
const SITE_URL = "https://asvior.app";

const templates = {
  mailer_subjects_confirmation: "Confirm your email — Asvior",
  mailer_templates_confirmation_content: `<h2>Confirm your email</h2>
<p>Tap the button below to verify your Asvior account.</p>
<p><a href="${SITE_URL}/auth/callback?token_hash={{ .TokenHash }}&type=email">Confirm email</a></p>`,

  mailer_subjects_recovery: "Reset your Asvior password",
  mailer_templates_recovery_content: `<h2>Reset your password</h2>
<p>We received a request to reset your password. Tap the button below to choose a new one.</p>
<p><a href="${SITE_URL}/auth/callback?token_hash={{ .TokenHash }}&type=recovery">Reset password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>`,

  mailer_subjects_magic_link: "Your Asvior sign-in link",
  mailer_templates_magic_link_content: `<h2>Sign in to Asvior</h2>
<p><a href="${SITE_URL}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Sign in</a></p>`,
};

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(templates),
});

const body = await res.text();
if (!res.ok) {
  console.error("Failed to update auth templates:", res.status, body);
  process.exit(1);
}

console.log("Supabase auth email templates updated successfully.");
console.log(body.slice(0, 500));
