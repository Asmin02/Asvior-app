// Native initialisation for the Capacitor Android/iOS shell.
//
// The only runtime this file matters for is Capacitor. In the browser it does
// nothing because @capacitor/app.addListener silently no-ops on the web
// adapter — but we still guard on isNative() to avoid registering listeners
// we don't need.
//
// What it wires up:
// 1. appUrlOpen + getLaunchUrl — catches deep links (asvior://... and App
//    Links to https://asvior.app/...) and forwards the path to the router.
//    The heavy lifting (exchanging the Supabase PKCE code for a session) is done
//    by the canonical `/auth/callback` route so we have one code path shared
//    with the web.
// 2. StatusBar + SplashScreen niceties for a polished first paint.
import { Capacitor } from "@capacitor/core";
import { isNative } from "@/lib/capacitor-env";
import { reportError } from "@/lib/error-reporting";
import { applyDeepLinkHash, parseDeepLinkTarget } from "@/lib/native-deep-link";

type NavigableRouter = {
  navigate: (opts: {
    to: string;
    search?: Record<string, string>;
    replace?: boolean;
  }) => Promise<unknown> | unknown;
};

let installed = false;

function navigateFromDeepLink(rawUrl: string, router: NavigableRouter | undefined): void {
  if (!rawUrl || !router?.navigate) return;

  const target = parseDeepLinkTarget(rawUrl);
  applyDeepLinkHash(target.pathname, target.search, target.hash);

  Promise.resolve(
    router.navigate({
      to: target.pathname,
      search: Object.keys(target.search).length > 0 ? target.search : undefined,
      replace: true,
    }),
  ).catch(() => undefined);
}

export async function installNativeShell(router: NavigableRouter | undefined): Promise<void> {
  if (installed || !isNative()) return;
  installed = true;

  try {
    const [{ App }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
      import("@capacitor/app"),
      import("@capacitor/status-bar"),
      import("@capacitor/splash-screen"),
    ]);

    await StatusBar.setOverlaysWebView({ overlay: false }).catch(() => undefined);
    await StatusBar.show().catch(() => undefined);
    await StatusBar.setStyle({ style: Style.Light }).catch(() => undefined);
    await StatusBar.setBackgroundColor({ color: "#6D28D9" }).catch(() => undefined);

    document.documentElement.classList.add("cap-native");
    const platform = Capacitor.getPlatform();
    if (platform === "android") {
      document.documentElement.classList.add("platform-android");
      document.documentElement.style.setProperty("--app-safe-top", "44px");
    } else if (platform === "ios") {
      document.documentElement.classList.add("platform-ios");
    }

    const applyViewportInset = () => {
      const top = Math.round(window.visualViewport?.offsetTop ?? 0);
      const minTop = platform === "android" ? 44 : 47;
      const next = Math.max(top, minTop);
      document.documentElement.style.setProperty("--app-safe-top", `${next}px`);
    };
    applyViewportInset();
    window.visualViewport?.addEventListener("resize", applyViewportInset);

    await SplashScreen.hide({ fadeOutDuration: 350 }).catch(() => undefined);

    App.addListener("appUrlOpen", (event) => {
      try {
        navigateFromDeepLink(event.url ?? "", router);
      } catch (err) {
        reportError(err instanceof Error ? err : new Error(String(err)), {
          boundary: "native_app_url_open",
        });
      }
    });

    // Cold-start deep links (e.g. password-reset email) arrive via getLaunchUrl,
    // not appUrlOpen, when the app was not already running.
    const launch = await App.getLaunchUrl();
    if (launch?.url) {
      navigateFromDeepLink(launch.url, router);
    }
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      boundary: "native_shell_install",
    });
  }
}

