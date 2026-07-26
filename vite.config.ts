import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import path from "node:path";

// Nitro deployment preset. `vercel` is the canonical production target
// (https://asvior.app). Override with NITRO_PRESET (e.g. `node-server`,
// `cloudflare-module`) at build time to target a different provider.
const preset = process.env.NITRO_PRESET || "vercel";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Point TanStack Start at src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    nitro({ preset }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
    ],
  },
  server: {
    port: 3000,
    host: true,
  },
});
