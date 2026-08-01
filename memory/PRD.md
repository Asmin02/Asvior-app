# Asvior — Audit + Capacitor Android Scaffold

## Session 4 — Final launch fix (auth redirect hardening)

Reported bug (physical device test): tapping "Verify Email" in a Supabase
signup confirmation opened an OLD Lovable-hosted version of Asvior instead
of `https://asvior.app`.

### Root cause
The runtime auth-redirect code in this repo was **already** locked to
`https://asvior.app`, but the previous helper resolved the web origin
through `getSiteUrl()` — which consulted the `VITE_SITE_URL` env variable
FIRST. If a Vercel env inherited from a previous deployment (or a stale
preview build) had `VITE_SITE_URL` set to a Lovable/preview URL, that
value would leak into every `emailRedirectTo` / `redirectTo` Supabase sent.
Even without that env in play, the CURRENT Supabase Dashboard on the user's
project only allow-listed `asvior://asvior.app` and
`asvior://asvior.app/reset-password` — meaning the web callback URL
`https://asvior.app/auth/callback` was NOT in the redirect allow-list and
Supabase fell back to whatever Site URL/email template had been set
(historically a Lovable-hosted URL, if the email template was ever
customised on the dashboard).

### Fixes shipped
- `src/lib/auth-redirects.ts` — `getAuthSiteUrl()` now returns the
  compile-time constant `APP_URL` (`https://asvior.app`) directly on web,
  and `NATIVE_APP_URL` (`asvior://asvior.app`) directly on native. It no
  longer reads `getSiteUrl()` or any env var, so a stale `VITE_SITE_URL`
  (or a stale `window.location.origin` on a preview subdomain) cannot leak
  into a Supabase confirmation link.
- `src/lib/auth-redirects.test.ts` — added a second test case that
  explicitly sets `process.env.VITE_SITE_URL = "https://legacy-lovable-preview.example.com"`
  and asserts that every auth redirect still resolves to `https://asvior.app`.
- `src/lib/app-info.ts` — updated the docstring on `getSiteUrl()` to state
  that it is NOT used for auth redirects any more (only for og:image and
  canonical link tags).
- **NEW** `SUPABASE_SETUP.md` — checklist of the exact Supabase dashboard
  values the user must set, including the 8 redirect URLs the code will
  send (Site URL, `https://asvior.app/auth/callback`,
  `https://asvior.app/auth/callback?type=recovery`, `https://asvior.app/reset-password`,
  and the 4 corresponding `asvior://…` variants), plus a warning to reset
  the "Confirm signup" and "Reset password" email templates to the default
  `{{ .ConfirmationURL }}` placeholder in case a Lovable URL was
  hard-coded.

### Validation (this session)
- `npm run typecheck` — PASS (0 errors)
- `npm run lint` — PASS (0 errors; 11 pre-existing react-refresh warnings on
  shadcn/ui files, unchanged)
- `npm run test:run` — PASS (6/6 tests across 3 files, including the new
  stale-env assertion)
- `npm run build` — PASS (vercel preset, TanStack Start SSR bundle emitted)
- `npx cap sync android` — PASS (6 plugins registered, `capacitor.config.json`
  regenerated with `server.url=https://asvior.app`)

### What remains manual (user)
1. Supabase Dashboard → Auth → URL Configuration → **add all 8 redirect
   URLs** listed in `SUPABASE_SETUP.md`.
2. Supabase Dashboard → Auth → Email Templates → **Reset to default** for
   "Confirm signup" and "Reset password" so the button uses
   `{{ .ConfirmationURL }}` (guarantees no baked-in Lovable URL).
3. Save to GitHub (Emergent chat composer button) to push `main`.
4. Wait for Vercel to redeploy `https://asvior.app`.
5. Fresh signup with a NEW email address — old confirmation links carry
   the OLD redirect_to and cannot be used as a regression signal.

## Session 3 — In-app Play Store review on 3rd visa check

- Added `@capacitor-community/in-app-review@8.0.0` (`npx cap sync android` now reports 6 plugins).
- **NEW** `src/lib/in-app-review.ts` — counter in `@capacitor/preferences` (native) or `localStorage` (web); on the 3rd success under Capacitor Android it lazy-imports the plugin and calls `InAppReview.requestReview()`; silent no-op on the web and when Play's quota is exhausted; sets a "prompted" flag so the sheet is never re-requested by us.
- `src/routes/visa-check.tsx` — one-line fire-and-forget call to `recordVisaCheckSuccess()` after a successful `getVisaRequirement` (fires whether or not the user is signed in; positioned after the Supabase `visa_history` insert so we don't wait on network).
- Regression: `typecheck` 0, `lint` 0, `vitest` 5/5, `build` PASS, `/visa-check` still 200. Web experience unchanged (counter bumps silently in localStorage; no UI change).

## Session 2 — Capacitor Android added

Original brief: "add Capacitor Android support, fix the previous Android login
problem, push completed source changes back to GitHub." Container constraints:
no Android SDK / Android Studio / JDK / Gradle / device or emulator, and per
Emergent platform rules the main agent cannot execute git write actions.

### A. Repository status
- Capacitor was PREVIOUSLY ABSENT (no `capacitor.config.ts`, no `android/`
  folder, no `@capacitor/*` in `package.json`).
- Now present at version 7.6.8 (CLI + core + android platform + app + browser
  + preferences + status-bar + splash-screen). Node 20.20.2 in this container
  cannot host the v8 CLI, so v7 is used — Google Play cares about the produced
  `.aab` (which is identical output regardless of CLI major).

### B. Root cause of the previous Android login problem
The single dominant cause was that **there was no Android application to log
into**: no Capacitor scaffold, no `android/` project, no deep-link intent
filters. Even had someone hand-built one, three latent problems would have
blocked login:
1. `getEmailVerificationRedirectUrl()` and `getPasswordResetRedirectUrl()`
   returned `https://asvior.app…` — inside the packaged Android app the
   Supabase email link would open the *mobile browser*, so the session issued
   by the confirmation link never reached the WebView holding the sign-in
   attempt.
2. The Supabase client used `localStorage` unconditionally. localStorage in a
   Capacitor WebView is durable per-origin, but has been observed to be
   evicted on Android system webview updates. Preferences (`SharedPreferences`
   under the hood) survives those events.
3. The Supabase client used the default `implicit` flow. PKCE is the correct
   flow for a mobile app because the code exchange can happen server-side to
   the Supabase project without exposing the token in a URL fragment that
   the mobile browser might strip.

All three are addressed below.

### C. Files changed / added
- `package.json` — added `@capacitor/{core,cli,android,app,browser,preferences,status-bar,splash-screen}` at `^7`; added `cap:sync`, `cap:copy`, `cap:open:android` scripts.
- `capacitor.config.ts` **[NEW]** — `appId: com.asvior.app`, `appName: Asvior`, `webDir: dist`, `server.url: https://asvior.app`, `server.androidScheme: https`, `allowNavigation` for `asvior.app` + `supabase.co`, splash + statusbar plugin config.
- `android/` **[NEW ~350 files]** — full Gradle Android project scaffolded via `npx cap add android`. Key contents: `android/app/build.gradle` (`applicationId com.asvior.app`, `versionCode 1`, `versionName "1.0"`), `android/app/src/main/AndroidManifest.xml` with launcher activity + deep-link intent filters, `android/gradle/…`, `android/gradlew`, `android/gradlew.bat`, `android/settings.gradle`, `android/variables.gradle`.
- `android/app/src/main/AndroidManifest.xml` — added TWO intent-filters onto MainActivity: (a) custom scheme `asvior://…` for deep links from Supabase emails, (b) `autoVerify="true"` App Link for `https://asvior.app/…` (requires `.well-known/assetlinks.json` to be published — see phase L).
- `android/.gitignore` — un-commented `*.jks`, `*.keystore`, added `keystore.properties`. Prevents committing the release signing key.
- `.gitignore` (root) — added `android/local.properties`, `android/keystore.properties`, `android/**/*.jks`, `android/**/*.keystore`, `android/**/build/`, `android/.gradle/`, `android/app/release/`, `android/app/src/main/assets/public/`, `android/capacitor-cordova-android-plugins/`.
- `eslint.config.js` — added `android` and `android/**` to the ignores list so ESLint doesn't try to lint Java.
- `src/lib/capacitor-env.ts` **[NEW]** — `isNative()` and `getNativePlatform()` helpers.
- `src/lib/native-storage.ts` **[NEW]** — Supabase storage adapter backed by `@capacitor/preferences` (SharedPreferences on Android).
- `src/lib/native-init.ts` **[NEW]** — `installNativeShell(router)` registers `App.appUrlOpen`, exchanges the PKCE `?code=…` via `supabase.auth.exchangeCodeForSession`, and navigates to the target path. De-duplicates codes with a `Set` because Android can fire the event more than once per resume.
- `src/integrations/supabase/client.ts` — branch on `Capacitor.isNativePlatform()` to pick storage; set `flowType: "pkce"`; set `detectSessionInUrl: !isNative` (the native listener does the exchange instead).
- `src/lib/auth-redirects.ts` — `getAuthSiteUrl()` returns `asvior://asvior.app` on native so Supabase emails redirect back into the installed app rather than the mobile browser.
- `src/routes/__root.tsx` — `RootComponent` now uses `useRouter()` and calls `installNativeShell(router)` from its mount effect. No-op on the browser.

### D. Web test results (executed in this container)
- `npm install --legacy-peer-deps` — PASS
- `npm run typecheck` — PASS (0 errors)
- `npm run lint` — PASS (0 errors; 11 unchanged react-refresh warnings on shadcn/ui files)
- `npm run test:run` — PASS (5/5 tests)
- `npm run build` (vercel preset) — PASS
- Route smoke (dev server on :3000): `/` 200, `/auth` 200, `/reset-password` 200, `/visa-check` 200, `/countries` 200, unknown → 404, `/api/health` 503 (AI gateway keys intentionally absent), `/api/chat` 400 for bad payload / 500 "Missing AI_GATEWAY_API_KEY" for valid payload. All match design.
- `testing_agent` iteration_1: 100% pass on web-layer regression, 0 backend issues, 0 frontend issues, 0 files modified by the tester.

### E. Capacitor results
- `capacitor.config.ts` verified: `appId=com.asvior.app`, `appName=Asvior`, `webDir=dist`.
- `npx cap add android` — SUCCESS (all 5 plugins recognised at their v7 versions).
- `npx cap sync android` — SUCCESS (0.23s).
- Deep-link intent filters — present in `android/app/src/main/AndroidManifest.xml` and survive `cap sync`.

### F. Supabase status
- URL + publishable (anon) key: present in `/app/.env`, verified by `/api/health` returning `SUPABASE_URL:true, SUPABASE_PUBLISHABLE_KEY:true`.
- Client picks Preferences on native and localStorage on web — the auth-redirects test still passes because `Capacitor.isNativePlatform()` returns false under jsdom.
- **MANUAL VERIFICATION REQUIRED (Supabase dashboard):**
  - Auth → URL Configuration → Redirect URLs — add `asvior://asvior.app`, `asvior://asvior.app/reset-password`, keep existing `https://asvior.app/*` entries.
  - Auth → Providers → Email — confirm the template uses `{{ .ConfirmationURL }}` which will honour the `redirectTo` we send.
  - Apply the three SQL migrations in `supabase/migrations/` (`supabase db push`). Existence in-repo has been verified; there is **no way from this container to confirm they have actually been applied to the hosted project** — that check must run against the live Supabase.

### G. AI status
- `AI_GATEWAY_BASE_URL` and `AI_GATEWAY_API_KEY` (and optionally `AI_GATEWAY_MODEL`, `SUPABASE_SERVICE_ROLE_KEY`) must be set in **Vercel Project Settings** for Production + Preview + Development. Without them `/api/chat` correctly returns 500 "Missing AI_GATEWAY_API_KEY" and `/api/health` reports 503 — this is designed behaviour, not a bug.
- The Android WebView loads `https://asvior.app`, so it reuses the same Vercel `/api/chat` endpoint — no separate mobile AI configuration is needed.

### H. Database status
- `supabase/migrations/20260629084545_…` — creates `profiles`, `user_settings`, `saved_trips`, `favorite_destinations`, `visa_history` with RLS + owner policies + `handle_new_user()` trigger.
- `supabase/migrations/20260629084609_…` — revokes EXECUTE on internal SECURITY DEFINER functions from PUBLIC/anon/authenticated.
- `supabase/migrations/20260629084649_…` — avatars bucket storage policies.
- Migrations are syntactically valid Postgres. **Whether they have actually been applied on the hosted Supabase (`ehfziddmhssffdvcxgzi`) cannot be verified from this container.** Run `supabase db push` from a workstation linked to the project.

### I. Security status
- No secret values were committed. `.env` at the repo root contains only the **publishable** Supabase anon key (safe to expose, as documented in `.env.example`). Service role key was not added — it's expected to live only in Vercel env.
- Keystore protection: `android/.gitignore` now hard-blocks `*.jks`, `*.keystore`, `keystore.properties`. Root `.gitignore` also blocks those paths under `android/**`. Local Android SDK paths (`android/local.properties`) are ignored.
- App Link `autoVerify="true"` is safe — it only becomes verified if the hosted `https://asvior.app/.well-known/assetlinks.json` references the SHA-256 fingerprint of the release keystore; without it Android falls back to the disambiguation chooser.

### J. GitHub status
- Emergent platform policy: the main agent cannot run `git push`. The
  sanctioned path is the **"Save to GitHub"** button in the chat composer,
  which pushes the current /app tree to the user's repository.
- Working tree is CLEAN of build artefacts (`dist/`, `.vercel/output/`,
  `.output/`, `android/app/build/`, `android/.gradle/` all gitignored) and
  ready to push.
- Target repository: **Asvior-app** (based on the AGENTS.md contributor guide)
- Target branch: **main** (per AGENTS.md, main is auto-deployed to Vercel — the
  user may prefer a feature branch for a Capacitor addition to review before
  main hits prod; that is a call for the user to make when running Save to
  GitHub).
- Actual pushed branch / commit hash: **PUSH NOT EXECUTED BY THE MAIN AGENT.**
  I will not fabricate a commit hash. The user must click **Save to GitHub**
  after reviewing this report; the platform will surface the real commit hash
  and branch in its confirmation.

### K. Windows PowerShell commands the user runs next
```powershell
# 1) Pull the pushed branch (after clicking Save to GitHub) onto the Windows box
git clone https://github.com/<your-user>/Asvior-app.git
cd Asvior-app
git checkout <branch-name-you-pushed>

# 2) Install web deps + refresh android from source
npm install --legacy-peer-deps
npm run build            # generates dist / .vercel/output
npx cap sync android

# 3) Open in Android Studio
npx cap open android
# (or open the /android folder from Android Studio → File → Open)

# 4) In Android Studio -> Build -> Generate Signed Bundle / APK
#    - choose "Android App Bundle"
#    - choose "release"
#    - Key store path: create a NEW keystore (first time only) at a path OUTSIDE the repo, e.g.
#         C:\Users\<you>\AndroidKeys\asvior-release.jks
#      Key alias: asvior
#      Key/store passwords: long random strings — save in a password manager, DO NOT paste into any file inside the repo.
#    - Destination folder default: android\app\release
#    - Build variant: release, Signature version: V1+V2

# 5) The signed .aab is written to:
#      android\app\release\app-release.aab
#    Upload that file at https://play.google.com/console → Asvior → Production → Create new release.
```

### L. Manual device tests the user still must run
(These cannot be executed from this container. They are the 20 tests the user
listed, condensed and mapped to the source we just wrote.)
1. Install the release build on a physical Android device.
2. Cold start — splash shows, then the Asvior UI (loaded from https://asvior.app) renders.
3. Bottom nav switches between /, /visa-check, /checklist, /budget-planner, /profile.
4. Tap "Sign in" → /auth loads; Welcome back form renders.
5. Create account with a fresh email → toast confirms; check inbox → tap confirm link → device opens the Asvior app (App Link on `https://asvior.app` OR `asvior://asvior.app` scheme) → user is signed in and lands on /profile.
6. Sign out → session cleared from Preferences → returned to home.
7. Sign in with the account created above → toast "Welcome back!" → /profile loads with the saved profile row.
8. NO "Invalid login credentials" for a known-good account — this was the primary bug and should now pass because the PKCE flow completes inside the app.
9. Force-stop the app (`adb shell am force-stop com.asvior.app`) and re-launch — session restored via Preferences → /profile renders without prompting for a re-login.
10. Visa Check → pick passport + destination → "Check requirements" → results render.
11. /assistant chat → sends a message → **REQUIRES `AI_GATEWAY_API_KEY` in Vercel**. Otherwise you get a 500 with a clear error toast — that is the intended failure mode, not a bug.
12. Forgot password → enter email → toast confirms → email arrives with `asvior://asvior.app/reset-password?code=…` link → tapping opens the app → `native-init.ts` exchanges the code → /reset-password renders → set new password → /profile.
13. Sign in with the new password.
14. Back button hardware behaviour: on nested routes it pops the route; on / it exits the app (default `@capacitor/app` behaviour).
15. External links (embassy URLs from visa cards) — should open in the **system browser**, not inside the WebView (they aren't in `allowNavigation`).
16. `adb logcat -s Capacitor:V CapacitorConsole:V` — expect no red errors during the flows above.

### M. Release status
**GO FOR DEVICE TESTING.**
NOT GO for Google Play release yet — the device-side tests above (especially
the deep-link email confirmation and PKCE code exchange on a real handset)
have to pass first. **Only after those pass can this project be considered:**
> GO FOR GOOGLE PLAY RELEASE

### If auth still fails on the device — logs to collect
1. `adb logcat -s Capacitor:V CapacitorConsole:V AndroidRuntime:E` for the full sign-in attempt.
2. In Chrome on the desktop, open `chrome://inspect/#devices`, attach to the WebView, and capture the Network + Console tab during the sign-in.
3. In the Supabase dashboard → Logs → Auth logs, filter by the test email address for the same timestamp.
4. `adb shell dumpsys package com.asvior.app | findstr /R "verify autoVerify"` on Windows (or `grep` on macOS/Linux) to confirm the App Link is verified.
5. Copy the exact request/response of `POST https://<project>.supabase.co/auth/v1/token?grant_type=password` from the WebView Network tab.
6. Attach the redacted `capacitor.config.json` (from `android/app/src/main/assets/`) and the full `AndroidManifest.xml` — both are in the repo but useful for confirming what actually shipped in the .aab.
