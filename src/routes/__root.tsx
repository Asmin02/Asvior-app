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

import { Home, Plane, Sparkles, Wallet, User, Compass } from "lucide-react";



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

import { SplashScreen, TabBar, OnboardingGate, ErrorPage } from "@/components/asvior";

import { I18nProvider, notifyLanguageChanged, useT } from "@/lib/i18n";

import { notifyCurrencyChanged } from "@/lib/currency";



function NotFoundComponent() {

  return (

    <ErrorPage

      code="404"

      title="Page not found"

      description="This destination isn't on our map. Let's get you back on track."

      primaryAction={

        <Link to="/" className="asv-btn asv-btn-primary w-full">

          Return home

        </Link>

      }

    />

  );

}



function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {

  console.error(error);

  const router = useRouter();

  useEffect(() => {

    reportError(error, { boundary: "tanstack_root_error_component" });

  }, [error]);



  return (

    <ErrorPage

      title="Something went wrong"

      description="This page didn't load properly. Try again or head back home."

      primaryAction={

        <button

          type="button"

          className="asv-btn asv-btn-primary w-full"

          onClick={() => {

            router.invalidate();

            reset();

          }}

        >

          Try again

        </button>

      }

    />

  );

}



export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({

  head: () => ({

    meta: [

      { charSet: "utf-8" },

      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },

      { name: "theme-color", content: "#6D28D9" },

      { title: "Asvior — Travel, planned beautifully" },

      {

        name: "description",

        content:

          "Visa intelligence, trip budgets, packing checklists, and AI travel guidance for every journey.",

      },

      { name: "author", content: "Asvior" },

      { property: "og:title", content: "Asvior — Travel, planned beautifully" },

      {

        property: "og:description",

        content:

          "Visa intelligence, trip budgets, packing checklists, and AI travel guidance for every journey.",

      },

      { property: "og:type", content: "website" },

      { name: "twitter:card", content: "summary_large_image" },

      { name: "twitter:site", content: "@Asvior" },

      { property: "og:url", content: "https://asvior.app" },

      { property: "og:site_name", content: "Asvior" },

      { property: "og:image", content: "https://asvior.app/og-image.svg" },

      { name: "application-name", content: "Asvior" },

      { name: "apple-mobile-web-app-title", content: "Asvior" },

      { name: "apple-mobile-web-app-capable", content: "yes" },

      { name: "mobile-web-app-capable", content: "yes" },

    ],

    links: [

      { rel: "stylesheet", href: appCss },

      { rel: "canonical", href: "https://asvior.app" },

      { rel: "manifest", href: "/manifest.webmanifest" },

      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "32x32" },

      { rel: "apple-touch-icon", href: "/icon-192.png" },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },

      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },

      {

        rel: "stylesheet",

        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",

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



function AppTabBar() {

  const router = useRouter();

  const pathname = router.state.location.pathname;

  const [signedIn, setSignedIn] = useState(false);

  const t = useT();



  useEffect(() => {

    let cancelled = false;

    const refresh = async () => {

      try {

        const { data } = await supabase.auth.getSession();

        if (!cancelled) setSignedIn(!!data.session?.user);

      } catch {

        if (!cancelled) setSignedIn(false);

      }

    };

    void refresh();

    let unsub = () => {};

    try {

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {

        if (!cancelled) setSignedIn(!!session?.user);

      });

      unsub = () => sub.subscription.unsubscribe();

    } catch {

      setSignedIn(false);

    }

    return () => {

      cancelled = true;

      unsub();

    };

  }, []);



  return (

    <TabBar

      pathname={pathname}

      items={[

        { to: "/", label: t("nav.home"), icon: Home },

        { to: "/countries", label: "Discover", icon: Compass },

        {
          to: "/assistant",
          label: "AI",
          icon: Sparkles,
          match: (p) => p.startsWith("/assistant"),
        },

        { to: "/visa-check", label: t("nav.visa"), icon: Plane },

        { to: "/budget-planner", label: t("nav.budget"), icon: Wallet },

        {

          to: signedIn ? "/profile" : "/auth",

          label: t("nav.profile"),

          icon: User,

          match: (p) => p.startsWith("/profile") || p.startsWith("/auth"),

        },

      ]}

    />

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

      if (cached) applyAppearancePreferences(cached);



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

      notifyLanguageChanged(preferences.language);

      notifyCurrencyChanged(preferences.currency);

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

        if (!cancelled) {

          activeUserIdRef.current = null;

          resetGuestAppearance();

        }

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



    installNativeShell(router).catch(() => undefined);



    return () => {

      cancelled = true;

      unsubscribe();

    };

  }, [router]);



  return (

    <QueryClientProvider client={queryClient}>

      <I18nProvider>

        <OnboardingGate>

          <SplashScreen />

          <main className="asv-app mx-auto min-h-dvh w-full max-w-[1120px]">

            <Outlet />

          </main>

          <FloatingAIButton />

          <AppTabBar />

          <Toaster />

        </OnboardingGate>

      </I18nProvider>

    </QueryClientProvider>

  );

}


