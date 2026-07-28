// Persistent Supabase session storage for the Capacitor native shell.
//
// Web browsers keep the Supabase session in localStorage which is durable
// across app restarts. Inside a Capacitor Android WebView localStorage IS
// persisted per-origin, but @capacitor/preferences is stored in Android's
// SharedPreferences which survives WebView data-clearing edge cases and keeps
// the session usable even when the WebView is recycled by the OS. Supabase's
// StorageAdapter interface is intentionally minimal (getItem / setItem /
// removeItem) so we can bridge Capacitor Preferences into it directly.
import { Preferences } from "@capacitor/preferences";

export const capacitorSupabaseStorage = {
  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },
  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  },
};
