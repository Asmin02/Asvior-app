// Native initialisation for the Capacitor Android/iOS shell.
//
// The only runtime this file matters for is Capacitor. In the browser it does
// nothing because @capacitor/app.addListener silently no-ops on the web
// adapter — but we still guard on isNative() to avoid registering listeners
// we don't need.
//
// What it wires up:
// 1. appUrlOpen — catches deep links (asvior://... and App Links to
//    https://asvior.app/...) and forwards the path to the router. The heavy
//    lifting (exchanging the Supabase PKCE code for a session) is done by
//    the canonical `/auth/callback` route so we have one code path shared
//    with the web.
// 2. StatusBar + SplashScreen niceties for a polished first paint.
import { isNative } from "@/lib/capacitor-env";
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

    App.addListener("appUrlOpen", (event) => {
      try {
        const rawUrl = event.url ?? "";
        if (!rawUrl) return;

        // Accepts:
        //   asvior://asvior.app/auth/callback?code=...
        //   asvior:///auth/callback?code=...      (host optional)
        //   https://asvior.app/auth/callback?code=...
        // We only need the path/query part — the callback route does the
        // Supabase code exchange itself.
        const url = new URL(rawUrl);
        const path = `${url.pathname || "/"}${url.search || ""}${url.hash || ""}`;

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
