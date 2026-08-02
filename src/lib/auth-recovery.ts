import { isNative } from "@/lib/capacitor-env";

export const RECOVERY_SESSION_FLAG = "asvior_recovery_in_progress";

export async function setRecoveryInProgress(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(RECOVERY_SESSION_FLAG, "1");
  }
  if (isNative()) {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key: RECOVERY_SESSION_FLAG, value: "1" });
  }
}

export async function clearRecoveryInProgress(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(RECOVERY_SESSION_FLAG);
  }
  if (isNative()) {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.remove({ key: RECOVERY_SESSION_FLAG });
  }
}

export async function isRecoveryInProgress(): Promise<boolean> {
  if (typeof window !== "undefined" && sessionStorage.getItem(RECOVERY_SESSION_FLAG) === "1") {
    return true;
  }
  if (isNative()) {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key: RECOVERY_SESSION_FLAG });
    return value === "1";
  }
  return false;
}
