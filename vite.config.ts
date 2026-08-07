import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import { loadEnv } from "vite";

// Lovable hosting adapter. It wires Tailwind, TanStack Start, React and the
// Nitro deploy plugin, and emits the build to `dist/` (dist/client +
// dist/server) which is what the hosting dist-check expects.
//
// Override the deploy target with NITRO_PRESET at build time (e.g.
// `vercel`, `node-server`) when deploying elsewhere.
const preset = process.env['NITRO_PRESET'];

// Public (publishable) backend config. These are safe to inline in the client
// bundle and are required at build time so the preview/production bundles do
// not crash with "Missing Supabase environment variable(s)".
const env = loadEnv(process.env['NODE_ENV'] ?? "production", process.cwd(), "");
const SUPABASE_URL =
  env['VITE_SUPABASE_URL'] || env['SUPABASE_URL'] || "https://rxhthyqirdafhkymztvb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
  env['SUPABASE_PUBLISHABLE_KEY'] ||
  "sb_publishable_bsLdMMaUPVeFtOqL-qbg6w_1i8A3y4I";
const SUPABASE_PROJECT_ID =
  env['VITE_SUPABASE_PROJECT_ID'] || env['SUPABASE_PROJECT_ID'] || "rxhthyqirdafhkymztvb";

export default defineConfig({
  tanstackStart: {
    // Point TanStack Start at src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  ...(preset ? { nitro: { preset } } : {}),
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(SUPABASE_PUBLISHABLE_KEY),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(SUPABASE_PROJECT_ID),
    },
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
      dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
    },
  },
});
