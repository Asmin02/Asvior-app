import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Sparkles, Globe2, Mail } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { APP_NAME, APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Asvior — Premium Travel Assistant" },
      { name: "description", content: "Asvior helps travelers check visa requirements across 199 countries, plan budgets, and get AI travel guidance." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPage
      badge={<><Plane className="h-3.5 w-3.5" /> Version {APP_VERSION}</>}
      title="About Asvior"
      subtitle="A production-grade travel planning app for visa checks, trip preparation, and AI guidance."
    >
      <InfoSection title="Who we are">
        <p>
          {APP_NAME} helps travelers make faster, safer planning decisions by combining visa lookup,
          destination insights, trip tools, and AI guidance in one mobile-first experience.
        </p>
        <p>
          We design Asvior for practical travel workflows: check eligibility, verify requirements,
          organize plans, and keep moving without losing context.
        </p>
      </InfoSection>

      <InfoSection title="Core capabilities">
        <ul className="list-none space-y-2">
          <li className="flex items-start gap-2">
            <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Visa requirement guidance across 199 passport and destination combinations.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>AI travel assistant for planning support, document prep, budgets, and destination Q&A.</span>
          </li>
          <li className="flex items-start gap-2">
            <Plane className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Trip planning tools including checklists, budgeting, saved history, and summaries.</span>
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Data and reliability">
        <p>
          Asvior references public visa datasets and keeps travelers pointed to official embassy
          and immigration channels for final verification. Entry requirements can change quickly
          and may vary by traveler profile, route, and document type.
        </p>
        <p>
          Asvior provides guidance, not legal advice. Travelers should always verify decisions with
          official authorities before booking or departure.
        </p>
      </InfoSection>

      <InfoSection title="Version and release">
        <p>
          Current app version: <strong className="text-foreground">{APP_VERSION}</strong>
        </p>
      </InfoSection>

      <InfoSection title="Get in touch">
        <p>We welcome feedback, support requests, and partnership inquiries.</p>
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
        <span aria-hidden>·</span>
        <Link to="/contact" className="hover:text-foreground">Contact</Link>
      </div>
    </InfoPage>
  );
}
