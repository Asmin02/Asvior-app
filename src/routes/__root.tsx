import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Home, Plane, CheckSquare, Wallet, User } from "lucide-react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { installNativeShell } from "../lib/native-init";
import { supabase } from "@/integrations/supabase/client";
import {
  applyAppearancePreferences,
  cacheAppearancePreferences,
  readCachedAppearancePreferences,
  resetGuestAppearance,
  clearSignedOutLocalState,
  DEFAULT_CURRENCY,
} from "@/lib/app-session";
import { Toaster } from "@/components/ui/sonner";
import { FloatingAIButton } from "@/components/FloatingAIButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="premium-card w-full max-w-md animate-fade-in rounded-3xl p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 text-3xl ring-1 ring-primary/10">
          🧭
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Off the map
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          That destination isn't on our map.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="premium-card w-full max-w-md animate-fade-in rounded-3xl p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 text-3xl ring-1 ring-primary/10">
          ☁️
        </div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border/60 bg-card/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-xl transition-transform active:scale-95"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0F172A" },
      { title: "ASVIOR — Your Premium Travel Concierge" },
      {
        name: "description",
        content:
          "ASVIOR is your premium travel concierge for visas, trip planning, budget intelligence, and seamless global journeys.",
      },
      { name: "author", content: "Asvior" },
      { property: "og:title", content: "ASVIOR — Your Premium Travel Concierge" },
      {
        property: "og:description",
        content:
          "ASVIOR is your premium travel concierge for visas, trip planning, budget intelligence, and seamless global journeys.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Asvior" },
      { name: "twitter:title", content: "ASVIOR — Your Premium Travel Concierge" },
      {
        name: "twitter:description",
        content:
          "ASVIOR is your premium travel concierge for visas, trip planning, budget intelligence, and seamless global journeys.",
      },
      { property: "og:url", content: "https://asvior.app" },
      { property: "og:site_name", content: "Asvior" },
      { property: "og:image", content: "https://asvior.app/og-image.svg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "ASVIOR — Your Premium Travel Concierge" },
      { name: "twitter:image", content: "https://asvior.app/og-image.svg" },
      { name: "twitter:image:alt", content: "ASVIOR — Your Premium Travel Concierge" },
      { name: "application-name", content: "Asvior" },
      { name: "apple-mobile-web-app-title", content: "Asvior" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://asvior.app" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/icon-192.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const capacitorBridgeShim =
    "(function(){if(typeof window==='undefined')return;window.Capacitor=window.Capacitor||{};if(typeof window.Capacitor.triggerEvent!=='function'){window.Capacitor.triggerEvent=function(){};}window.CapacitorWebView=window.CapacitorWebView||{};if(typeof window.CapacitorWebView.triggerEvent!=='function'){window.CapacitorWebView.triggerEvent=function(){};}})();";

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: capacitorBridgeShim }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MobileNav() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setSignedIn(!!data.session?.user);
      } catch {
        if (cancelled) return;
        setSignedIn(false);
      }
    };

    void refresh();

    let unsubscribe = () => {};

    try {
      const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (cancelled) return;
        setSignedIn(!!session?.user);
      });
      unsubscribe = () => authSub.subscription.unsubscribe();
    } catch {
      setSignedIn(false);
    }

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/visa-check", label: "Visa", icon: Plane },
    { to: "/checklist", label: "Checklist", icon: CheckSquare },
    { to: "/budget-planner", label: "Budget", icon: Wallet },
    { to: signedIn ? "/profile" : "/auth", label: "Profile", icon: User },
  ] as const;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-full border border-border/50 bg-card/80 p-1.5 shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--primary)_45%,transparent)] backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 transition-all duration-300 active:scale-95 ${
                isActive ? "bg-primary/10" : ""
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={isActive ? 2.25 : 1.9}
              />
              <span
                className={`text-[9.5px] font-semibold tracking-tight transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );

}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const activeUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncAppearanceForUser = async (userId: string) => {
      const cached = readCachedAppearancePreferences();
      if (cached) {
        applyAppearancePreferences(cached);
      }

      const { data: row, error } = await supabase
        .from("user_settings")
        .select("dark_mode, language, currency")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled || error || !row) return;

      const preferences = {
        darkMode: row.dark_mode,
        language: row.language,
        currency: row.currency || DEFAULT_CURRENCY,
      };

      applyAppearancePreferences(preferences);
      cacheAppearancePreferences(preferences);
    };

    const initialize = async () => {
      resetGuestAppearance();

      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (data.session?.user) {
          activeUserIdRef.current = data.session.user.id;
          await syncAppearanceForUser(data.session.user.id);
        }
      } catch {
        if (cancelled) return;
        activeUserIdRef.current = null;
        resetGuestAppearance();
      }
    };

    void initialize();

    let unsubscribe = () => {};

    try {
      const { data: authSub } = supabase.auth.onAuthStateChange((event, session) => {
        if (cancelled) return;

        if (event === "SIGNED_OUT") {
          clearSignedOutLocalState(activeUserIdRef.current ?? undefined);
          activeUserIdRef.current = null;
          resetGuestAppearance();
          return;
        }

        if (!session?.user) {
          activeUserIdRef.current = null;
          resetGuestAppearance();
          return;
        }

        activeUserIdRef.current = session.user.id;

        void syncAppearanceForUser(session.user.id);
      });
      unsubscribe = () => authSub.subscription.unsubscribe();
    } catch {
      activeUserIdRef.current = null;
      resetGuestAppearance();
    }

    // No-op in the browser. On Capacitor Android/iOS this registers the
    // appUrlOpen listener that exchanges the reset-password code from a deep
    // link into a live Supabase session before navigating to /reset-password.
    installNativeShell(router).catch(() => undefined);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="mx-auto min-h-dvh max-w-md bg-background pb-[calc(6rem+env(safe-area-inset-bottom))] font-sans antialiased">
        <Outlet />
      </main>
      <FloatingAIButton />
      <MobileNav />
      <Toaster />
    </QueryClientProvider>
  );
}
