import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import path from "node:path";

// Nitro deployment preset. `vercel` is the canonical production target
// (https://asvior.app) and is used automatically on Vercel or when
// NITRO_PRESET is set explicitly. Everywhere else (Lovable preview/publish,
// local builds, Capacitor) we skip Nitro so TanStack Start emits the standard
// `dist/client` + `dist/server` output that the hosting pipeline expects.
const preset = process.env.NITRO_PRESET;
const useNitro = Boolean(preset) || process.env.VERCEL === "1";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Point TanStack Start at src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    ...(useNitro ? [nitro({ preset: preset || "vercel" })] : []),
    viteReact(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  server: {
    port: 3000,
    host: true,
  },
});
