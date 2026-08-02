# Asvior — Contributor Guide

Asvior is a React 19 + TanStack Start application deployed at
[asvior.app](https://asvior.app). Please keep the `main` branch in a
working state — every commit is deployed to production via Vercel.

- Do not force-push, rebase, or amend commits that are already on `main`.
- Use `bun install` (or `npm install`) for dependencies.
- Use `npm run build` locally before opening a PR.
- **Android:** `npm run cap:sync` runs `build:cap` (Vite build + `scripts/prepare-cap-web.mjs`), copies fresh assets into `dist/client`, and syncs bundled assets to the Android shell. Bundled builds require `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` at build time (see `.env.example`). The app loads those assets by default. For a WebView that points at production (`https://asvior.app`), run `npm run cap:sync:remote` instead (UI changes must be deployed to production first).
- Environment variables live in `.env` and Vercel Project Settings.
