import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Sparkles, Globe2, Mail } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About VisaPilot — Premium Travel Assistant" },
      { name: "description", content: "VisaPilot helps travelers check visa requirements across 199 countries, plan budgets, and get AI travel guidance." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPage
      badge={<><Plane className="h-3.5 w-3.5" /> Version {APP_VERSION}</>}
      title="About VisaPilot"
      subtitle="Your premium travel companion — visas, checklists, budgets, and AI guidance in one app."
    >
      <InfoSection title="Our mission">
        <p>
          International travel paperwork shouldn't be confusing. VisaPilot turns complex visa
          rules into clear, friendly answers so you can plan with confidence — whether you're
          booking a weekend getaway or a round-the-world trip.
        </p>
      </InfoSection>

      <InfoSection title="What's inside">
        <ul className="list-none space-y-2">
          <li className="flex items-start gap-2">
            <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Visa requirements between 199 countries, with document checklists and country guides.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>An AI travel assistant for visas, budgets, packing, and destination tips.</span>
          </li>
          <li className="flex items-start gap-2">
            <Plane className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Trip planning tools: smart checklists, budget planner, and trip summaries.</span>
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Data sources">
        <p>
          Visa requirement data is based on the open Passport Index dataset, supplemented with
          links to official government portals. Requirements can change at any time — always
          verify with the destination's embassy or immigration authority before travelling.
        </p>
      </InfoSection>

      <InfoSection title="Get in touch">
        <p>We'd love to hear your feedback.</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95"
        >
          <Mail className="h-4 w-4" /> Contact support
        </a>
      </InfoSection>

      <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-muted-foreground">
        <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
        <span aria-hidden>·</span>
        <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
      </div>
    </InfoPage>
  );
}
