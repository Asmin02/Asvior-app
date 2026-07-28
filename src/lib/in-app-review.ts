// In-app review prompt.
//
// Google Play only shows the review sheet a limited number of times per user
// per year and silently no-ops if the quota is exceeded — so we just fire the
// intent and let Play decide. On the web (or when the plugin is missing) the
// helper is a no-op.
//
// Trigger policy: fire on the 3rd successful visa check. Users who reach that
// point have demonstrably found value in the core feature, which is the
// moment Play's own guidance recommends prompting.
import { Preferences } from "@capacitor/preferences";
import { isNative } from "@/lib/capacitor-env";

const STORAGE_KEY = "asvior.visaCheckSuccessCount";
const REVIEW_TRIGGER_AT = 3;
const REVIEWED_KEY = "asvior.reviewPrompted";

async function readCount(): Promise<number> {
  if (isNative()) {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    return value ? Number(value) || 0 : 0;
  }
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(STORAGE_KEY) ?? "0") || 0;
}

async function writeCount(count: number): Promise<void> {
  if (isNative()) {
    await Preferences.set({ key: STORAGE_KEY, value: String(count) });
    return;
  }
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(count));
}

async function markPrompted(): Promise<void> {
  if (isNative()) {
    await Preferences.set({ key: REVIEWED_KEY, value: "1" });
    return;
  }
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEWED_KEY, "1");
}

async function wasPrompted(): Promise<boolean> {
  if (isNative()) {
    const { value } = await Preferences.get({ key: REVIEWED_KEY });
    return value === "1";
  }
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(REVIEWED_KEY) === "1";
}

export async function recordVisaCheckSuccess(): Promise<void> {
  try {
    if (await wasPrompted()) return;
    const next = (await readCount()) + 1;
    await writeCount(next);
    if (next < REVIEW_TRIGGER_AT || !isNative()) return;

    const mod = await import("@capacitor-community/in-app-review").catch(() => null);
    if (!mod?.InAppReview) return;
    await mod.InAppReview.requestReview();
    await markPrompted();
  } catch {
    // Play Store quota exceeded, plugin missing, or user dismissed — silent.
  }
}
