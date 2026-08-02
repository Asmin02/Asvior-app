import type { CapacitorConfig } from "@capacitor/cli";

// Asvior — Capacitor configuration.
//
// Android loading strategy (IMPORTANT):
// - By default this shell serves the **bundled** web build from `dist/client`
//   (populated by `npm run build` + `npx cap sync android`). Use this for
//   local UI verification and `installDebug` on a physical device.
// - Set `CAPACITOR_REMOTE_URL=https://asvior.app` before `cap sync` when you
//   want the WebView to load the live deployed site instead (SSR + /api/chat
//   on the server). Play Store release pipelines should set that env var.
//
// The application id (com.asvior.app) is what Google Play uses as the unique
// identifier. Do not change it after the first Play upload.
const remoteUrl = process.env.CAPACITOR_REMOTE_URL?.trim();

const config: CapacitorConfig = {
  appId: "com.asvior.app",
  appName: "Asvior",
  // TanStack Start client prerender output (not the repo root `dist/` folder).
  webDir: "dist/client",
  ...(remoteUrl
    ? {
        server: {
          url: remoteUrl,
          androidScheme: "https",
          cleartext: false,
          allowNavigation: ["asvior.app", "*.asvior.app", "*.supabase.co"],
        },
      }
    : {}),
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    // Native HTTP bypasses WebView CORS when the bundled shell calls
    // https://asvior.app/api/chat from https://localhost.
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: "#FAF8F4",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0B1F3A",
    },
  },
};

export default config;
