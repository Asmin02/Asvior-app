import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "node:path";

// Read the project's existing environment (.env + process env) at config time.
// Nothing here creates or changes credentials — it only forwards the values the
// project already has so production/native bundles are built with the same
// public backend configuration the preview uses.
const env = loadEnv("", process.cwd(), "");

const backendUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const backendPublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

const backendDefines: Record<string, string> = {};
if (backendUrl) {
  backendDefines["import.meta.env.VITE_SUPABASE_URL"] = JSON.stringify(backendUrl);
  backendDefines["process.env.SUPABASE_URL"] = JSON.stringify(backendUrl);
}
if (backendPublishableKey) {
  backendDefines["import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY"] =
    JSON.stringify(backendPublishableKey);
  backendDefines["process.env.SUPABASE_PUBLISHABLE_KEY"] = JSON.stringify(backendPublishableKey);
}

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
