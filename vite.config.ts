import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

const cloudUrl = "https://rxhthyqirdafhkymztvb.supabase.co";
const cloudPublishableKey = "sb_publishable_bsLdMMaUPVeFtOqL-qbg6w_1i8A3y4I";

export default defineConfig({
  // Point TanStack Start at src/server.ts (our SSR error wrapper).
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // These are public client configuration values, not secrets. Keep explicit
    // fallbacks so production and native builds cannot hydrate without the
    // Lovable Cloud connection when a hosting environment omits VITE_* vars.
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(cloudUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(cloudPublishableKey),
      "process.env.SUPABASE_URL": JSON.stringify(cloudUrl),
      "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(cloudPublishableKey),
    },
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
