// Native initialisation for the Capacitor Android/iOS shell.
//
// The only runtime this file matters for is Capacitor. In the browser it does
// nothing because @capacitor/app.addListener silently no-ops on the web
// adapter — but we still guard on isNative() to avoid registering listeners
// we don't need.
//
// What it wires up:
// 1. appUrlOpen — catches deep links (asvior://... and App Links to
//    https://asvior.app/...) so the Supabase session in a password-reset
//    email can be applied inside the app rather than in the mobile browser.
// 2. Session-token handoff — Supabase's PKCE reset link carries
//    `?code=<code>` or a hash fragment. We exchange it via
//    supabase.auth.exchangeCodeForSession, then route to /reset-password.
// 3. StatusBar + SplashScreen niceties for a polished first paint.
import { isNative } from "@/lib/capacitor-env";
import { supabase } from "@/integrations/supabase/client";
import { reportError } from "@/lib/error-reporting";

type NavigableRouter = {
  navigate: (opts: { to: string; replace?: boolean }) => Promise<unknown> | unknown;
};

let installed = false;

export async function installNativeShell(router: NavigableRouter | undefined): Promise<void> {
  if (installed || !isNative()) return;
  installed = true;

  try {
    const [{ App }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
      import("@capacitor/app"),
      import("@capacitor/status-bar"),
      import("@capacitor/splash-screen"),
    ]);

    await StatusBar.setStyle({ style: Style.Dark }).catch(() => undefined);
    await SplashScreen.hide().catch(() => undefined);

    App.addListener("appUrlOpen", async (event) => {
      try {
        const rawUrl = event.url ?? "";
        if (!rawUrl) return;

        // Both asvior://reset-password?code=... and
        // https://asvior.app/reset-password?code=... need to end up on the
        // in-app reset-password route with a live session applied.
        const url = new URL(rawUrl);
        const code = url.searchParams.get("code");
        const errorParam = url.searchParams.get("error_description");
        const path = `${url.pathname || "/"}${url.search || ""}${url.hash || ""}`;

        if (errorParam) {
          reportError(new Error(`Deep link error: ${errorParam}`), {
            boundary: "native_app_url_open",
          });
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) reportError(error, { boundary: "native_exchange_code" });
        }

        // Best-effort route change. If the router hasn't hydrated yet the
        // WebView will already be loading the same URL from server.url so the
        // client just no-ops.
        if (router?.navigate) {
          Promise.resolve(router.navigate({ to: path, replace: true })).catch(() => undefined);
        }
      } catch (err) {
        reportError(err instanceof Error ? err : new Error(String(err)), {
          boundary: "native_app_url_open",
        });
      }
    });
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      boundary: "native_shell_install",
    });
  }
}
