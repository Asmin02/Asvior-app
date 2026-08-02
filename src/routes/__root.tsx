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
    <div className="flex min-h-dvh items-center justify-center gradient-hero-bg px-4">
      <div className="glass max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-display text-7xl text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">That destination isn't on our map.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-2xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95"
        >
          Go home
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
    <div className="flex min-h-dvh items-center justify-center gradient-hero-bg px-4">
      <div className="glass max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-2xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-float"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground"
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
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
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
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
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
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2"
    >
      <div className="glass-strong flex items-center justify-around rounded-3xl px-2 py-2">
        {navItems.map((item) => {
          const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-all"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all ${
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-float"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.4 : 2} />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
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
      <main className="mx-auto min-h-dvh max-w-md bg-background pb-[calc(7rem+env(safe-area-inset-bottom))] font-sans antialiased">
        <Outlet />
      </main>
      <FloatingAIButton />
      <MobileNav />
      <Toaster />
    </QueryClientProvider>
  );
}
