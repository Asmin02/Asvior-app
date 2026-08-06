import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "node:path";

// Read the project's existing environment (.env + process env) at config time.
// Nothing here creates or changes credentials — it only forwards the values the
// project already has so production/native bundles are built with the same
// public backend configuration the preview uses.
const env = loadEnv("", process.cwd(), "");

// Hosting build containers do not receive the local .env file. These are the
// project's PUBLIC client values (project URL + publishable key) — the same
// pair already shipped in every browser bundle, never a secret key — kept here
// so a build without .env cannot emit a bundle that fails to reach the backend.
const FALLBACK_BACKEND_URL = "https://rxhthyqirdafhkymztvb.supabase.co";
const FALLBACK_BACKEND_PUBLISHABLE_KEY = "sb_publishable_bsLdMMaUPVeFtOqL-qbg6w_1i8A3y4I";

const backendUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || FALLBACK_BACKEND_URL;
const backendPublishableKey =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY ||
  FALLBACK_BACKEND_PUBLISHABLE_KEY;

const backendDefines: Record<string, string> = {
  "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(backendUrl),
  "process.env.SUPABASE_URL": JSON.stringify(backendUrl),
  "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(backendPublishableKey),
  "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(backendPublishableKey),
};


export default defineConfig({
  // Point TanStack Start at src/server.ts (our SSR error wrapper).
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    define: backendDefines,
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
      dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
    },
    server: {
      host: true,
    },
  },
});
