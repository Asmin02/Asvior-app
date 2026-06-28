import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisaPilot — Your Travel & Visa Assistant" },
      { name: "description", content: "Check visa requirements, plan your travel checklist, and manage your trip budget with VisaPilot." },
      { property: "og:title", content: "VisaPilot — Your Travel & Visa Assistant" },
      { property: "og:description", content: "Check visa requirements, plan your travel checklist, and manage your trip budget with VisaPilot." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Logo / Brand */}
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
        <PlaneIcon className="h-8 w-8" />
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        VisaPilot
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your Travel & Visa Assistant
      </p>

      {/* Hero illustration area */}
      <div className="mt-8 w-full rounded-2xl bg-travel-sky/30 p-6 text-center">
        <GlobeIcon className="mx-auto h-12 w-12 text-travel-blue" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Plan smarter. Travel further.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Check visas, pack right, and stay on budget.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 w-full space-y-3">
        <Link
          to="/visa-check"
          className="flex w-full items-center gap-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
            <PassportIcon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Visa Check</p>
            <p className="text-xs opacity-80">Check if you need a visa</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 opacity-60" />
        </Link>

        <Link
          to="/checklist"
          className="flex w-full items-center gap-4 rounded-xl bg-card p-4 text-foreground shadow-sm ring-1 ring-border transition-transform active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-travel-sky text-travel-blue">
            <ChecklistIcon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Travel Checklist</p>
            <p className="text-xs text-muted-foreground">Don't forget anything</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          to="/budget-planner"
          className="flex w-full items-center gap-4 rounded-xl bg-card p-4 text-foreground shadow-sm ring-1 ring-border transition-transform active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-travel-sand text-travel-blue-dark">
            <WalletIcon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Budget Planner</p>
            <p className="text-xs text-muted-foreground">Plan your trip budget</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      <p className="mt-10 text-[10px] text-muted-foreground">
        No account needed &middot; Free &middot; Private
      </p>
    </div>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.919 17.919 0 01-8.716-2.247m0 0A9.004 9.004 0 003 12c0 1.681.445 3.268 1.22 4.625" />
    </svg>
  );
}

function PassportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z" />
    </svg>
  );
}

function ChecklistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m0 18V9" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
