import type { CapacitorConfig } from "@capacitor/cli";

// Asvior — Capacitor configuration.
//
// The Android application id (com.asvior.app) is what Google Play uses as the
// unique identifier for the app. Do not change it after the first Play upload.
// versionCode / versionName live in android/app/build.gradle and are bumped per
// release; keep versionCode strictly monotonic.
//
// Loading strategy: this Capacitor shell wraps the deployed Asvior web app at
// https://asvior.app so the SSR-driven TanStack Start routes, /api/chat, and
// server functions all continue to work. `androidScheme: "https"` unifies the
// origin with the deployed site so localStorage/cookies used by the Supabase
// client behave the same as in a browser.
const config: CapacitorConfig = {
  appId: "com.asvior.app",
  appName: "Asvior",
  webDir: "dist",
  server: {
    url: "https://asvior.app",
    androidScheme: "https",
    cleartext: false,
    allowNavigation: [
      "asvior.app",
      "*.asvior.app",
      "*.supabase.co",
    ],
  },
  android: {
    // On Android 9+ cleartext http is blocked. We only ever talk to https
    // origins (asvior.app, supabase.co), so keep the default.
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: "#0F172A",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0F172A",
    },
  },
};

export default config;
