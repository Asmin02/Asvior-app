import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, Plane, CheckSquare, Wallet, User } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { FloatingAIButton } from "@/components/FloatingAIButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center gradient-hero-bg px-4">
      <div className="glass max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-display text-7xl text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That destination isn't on our map.
        </p>
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
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
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
            onClick={() => { router.invalidate(); reset(); }}
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
      { title: "Asvior — Premium Travel & Visa Assistant" },
      { name: "description", content: "Check visa requirements, plan trips, and get AI-powered travel guidance with Asvior." },
      { name: "author", content: "Asvior" },
      { property: "og:title", content: "Asvior — Premium Travel & Visa Assistant" },
      { property: "og:description", content: "Check visas, plan trips, and get AI-powered travel guidance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Asvior" },
      { name: "twitter:title", content: "Asvior — Premium Travel & Visa Assistant" },
      { name: "twitter:description", content: "Check visas, plan trips, and get AI-powered travel guidance." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
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

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/visa-check", label: "Visa", icon: Plane },
    { to: "/checklist", label: "Checklist", icon: CheckSquare },
    { to: "/budget-planner", label: "Budget", icon: Wallet },
    { to: "/profile", label: "Profile", icon: User },
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
              <div className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-float"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.4 : 2} />
              </div>
              <span className={`text-[10px] font-semibold tracking-tight ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
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

  useEffect(() => {
    const theme = localStorage.getItem("vp_theme");
    if (theme === "dark") document.documentElement.classList.add("dark");
    const lang = localStorage.getItem("vp_lang");
    if (lang) document.documentElement.setAttribute("lang", lang);
  }, []);

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
