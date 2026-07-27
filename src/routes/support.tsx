import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleHelp, Mail, ShieldCheck } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { HELLO_EMAIL, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Asvior" },
      {
        name: "description",
        content: "Get support for Asvior accounts, visa checks, and AI assistant issues.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <InfoPage
      badge={
        <>
          <CircleHelp className="h-3.5 w-3.5" /> Support Center
        </>
      }
      title="Support"
      subtitle="We usually reply within one business day."
    >
      <InfoSection title="Support email">
        <p>For account, password reset, and product issues:</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Asvior%20Support`}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95"
        >
          <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
        </a>
      </InfoSection>

      <InfoSection title="General contact">
        <p>
          If your question is not support-related, contact the team at{" "}
          <a
            href={`mailto:${HELLO_EMAIL}`}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            {HELLO_EMAIL}
          </a>
          .
        </p>
      </InfoSection>

      <InfoSection title="Security reporting">
        <p>
          If you found a security issue, include reproducible steps, affected route, and any
          screenshots. Sensitive reports are triaged first.
        </p>
        <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Responsible disclosure appreciated.
        </p>
      </InfoSection>

      <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-muted-foreground">
        <Link to="/contact" className="hover:text-foreground">
          Contact
        </Link>
        <span aria-hidden>·</span>
        <Link to="/about" className="hover:text-foreground">
          About
        </Link>
      </div>
    </InfoPage>
  );
}
