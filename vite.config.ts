import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

// Lovable hosting adapter. It wires Tailwind, TanStack Start, React and the
// Nitro deploy plugin, and emits the build to `dist/` (dist/client +
// dist/server) which is what the hosting dist-check expects.
//
// Override the deploy target with NITRO_PRESET at build time (e.g.
// `vercel`, `node-server`) when deploying elsewhere.
const preset = process.env['NITRO_PRESET'];

export default defineConfig({
  tanstackStart: {
    // Point TanStack Start at src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  ...(preset ? { nitro: { preset } } : {}),
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
      dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
    },
  },
});
