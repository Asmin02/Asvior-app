# Asvior — Audit Log

Original problem statement: Audit the imported Asvior repository end-to-end, fix
any repository-side blockers, run every validation available in this environment,
and report results without creating a replacement app.

## Repository confirmed
- Real Asvior project (`package.json.name = "asvior"`, `AGENTS.md` references
  `asvior.app`, Supabase project id `rxhthyqirdafhkymztvb` matches `.env`,
  `.env.example`, and `supabase/config.toml`).
- Stack: React 19 + TanStack Start (Nitro) + Vite 8 + Tailwind v4 + Supabase +
  AI SDK (openai-compatible gateway). Deployed to Vercel (`vercel.json`).
- Not an Android application. There is no Android/Gradle/AAR anywhere in the
  tree — the "Android SDK / Android Studio / device access" language in the
  brief does not apply to this codebase.

## Environment
- Node 20.20.2 (Nitro/AI SDK prefer >=22.12). Only produces engine warnings;
  install, typecheck, tests, and both build presets succeed on Node 20.
- Installed via `npm install --legacy-peer-deps` per `vercel.json` (589 pkgs,
  no errors).
- `.env` at repo root already contains Supabase public URL/key (safe to expose).
  AI_GATEWAY_* intentionally blank/commented — `.env.example` documents them as
  optional and `/api/chat` returns a clean 500 with "Missing AI_GATEWAY_API_KEY"
  when unset. `/api/health` correctly returns 503 in that case.

## Validation results (all executed in this environment)
| Check | Result |
| --- | --- |
| `npm install --legacy-peer-deps` | PASS (0 errors) |
| `npm run typecheck` (`tsc --noEmit`) | PASS (0 errors) |
| `npm run lint` | PASS (0 errors, 11 fast-refresh warnings in shadcn/ui files — pre-existing, non-blocking) |
| `npm run test:run` (vitest) | PASS (5/5: auth-redirects, combobox-viewport, runtime-health) |
| `npm run build` (Vercel preset) | PASS (`.vercel/output/{static,functions,config.json}` produced, config routes valid) |
| `NITRO_PRESET=node-server npm run build` | PASS (`.output/server/index.mjs` starts and serves) |
| Dev server (`vite dev` port 3000) | Boots in ~1.5s, no runtime errors in log |
| Live route smoke — 22 endpoints | All expected codes: `/` 200, `/visa-check` 200, `/auth` 200, `/countries` 200, `/country/JP` 200, `/budget-planner` 200, `/checklist` 200, `/summary` 200, `/assistant` 200, `/settings` 200, `/support` 200, `/about` 200, `/contact` 200, `/terms` 200, `/privacy` 200, `/trips` 200, `/profile` 200, `/favorites` 200, `/history` 200, `/reset-password` 200, `/manifest.webmanifest` 200, `/robots.txt` 200, `/sitemap.xml` 200, `/favicon.svg` 200, unknown route → 404. |
| `/api/health` behaviour | 503 with `ok:false` when AI_GATEWAY_* missing (correct — matches `getRuntimeHealth`). Supabase pair reported true when `.env` is loaded. |
| `/api/chat` behaviour | 500 "Missing AI_GATEWAY_API_KEY" when key absent; 400 on bad JSON payload; expects `messages[]` array as documented. |
| SSR — production node-server (port 3001) | Home page renders 46 KB of HTML including the "Where to" hero text; all 22 routes return the same status codes as dev. |
| Browser console (Playwright, home + visa-check + auth) | Zero JS errors, zero uncaught exceptions. Only artefacts: 18 `ERR_ABORTED` for HMR module fetches — expected because the automation navigates between routes faster than dev module preloads finish. |
| Screenshots | Home, Visa Check, and Auth all render as designed (glass cards, Plus Jakarta Sans, blue gradient hero, mobile-first `max-w-md` shell, bottom nav). No dark-on-dark or contrast issues. |
| Supabase migrations | Three migrations (`profiles`, `user_settings`, `saved_trips`, `favorite_destinations`, `visa_history`, avatars storage policies) all define RLS + owner policies + triggers. `handle_new_user()` and `set_updated_at()` have EXECUTE revoked from public/anon/authenticated after creation. Structure is consistent with `src/integrations/supabase/types.ts`. |

## MANUAL VERIFICATION REQUIRED (not testable from this container)
1. Vercel Project Settings — `AI_GATEWAY_BASE_URL`, `AI_GATEWAY_API_KEY`, and
   optionally `AI_GATEWAY_MODEL` / `SUPABASE_SERVICE_ROLE_KEY` must be set for
   Production + Preview + Development. Without them `/api/health` will report
   503 in production; `/api/chat` will 500. This is by design.
2. Supabase Dashboard → Authentication → URL Configuration must mirror
   `supabase/config.toml` (`site_url = https://asvior.app`, additional redirect
   URLs including `/reset-password` and `/auth/*`).
3. Supabase migrations must actually be applied against the hosted project
   (only the SQL files exist in-repo; `supabase db push` runs from a workstation
   with the linked project).
4. Live Supabase auth signup/signin round-trip against the real project — I
   didn't execute this because it would create real users in the production
   Supabase.

## Changes made to the repository
None. The audit revealed no repository-side blockers, so no code, config, or
env changes were applied.

## Backlog / suggestions (P2, non-blocking)
- Bump the container to Node 22 to silence the four `EBADENGINE` warnings from
  `@tanstack/start-plugin-core`, `@tanstack/start-server-core`,
  `@tanstack/start-storage-context`, and `ai@7`.
- The 11 lint warnings are all `react-refresh/only-export-components` on
  shadcn/ui primitives (they export `Slot`-style helpers alongside the
  component). Zero runtime impact.
- Consider migrating off `recharts@2.x` (deprecation notice from npm) and
  `tsconfck@3.1.6` (unmaintained transitive) at some point.

## Verdict
GO for the repository-side of the audit. All items testable inside this
container pass. The four MANUAL VERIFICATION REQUIRED items above are the
only remaining gates and can only be checked from the Vercel and Supabase
dashboards.
