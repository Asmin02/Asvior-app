// Runtime helpers for detecting the Capacitor native shell (Android / iOS) and
// wiring platform-specific behaviour without breaking the web build.
//
// Everything here is safe to import from the web bundle — the @capacitor/*
// packages ship no-op implementations when running in a normal browser (via
// their web adapters), and each helper additionally guards on
// isNativePlatform() so no native APIs are invoked from the browser.
import { Capacitor } from "@capacitor/core";

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function getNativePlatform(): "android" | "ios" | "web" {
  const p = Capacitor.getPlatform();
  return p === "android" || p === "ios" ? p : "web";
}
