import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, PhoneCall } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { HELLO_EMAIL, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Asvior" },
      {
        name: "description",
        content: "Contact the Asvior team for partnerships, press, or general questions.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InfoPage
      badge={
        <>
          <MessageCircle className="h-3.5 w-3.5" /> Contact Asvior
        </>
      }
      title="Contact"
      subtitle="For partnerships, press, or product feedback, reach us directly."
    >
      <InfoSection title="General inquiries">
        <p>For non-support questions, email:</p>
        <a
          href={`mailto:${HELLO_EMAIL}`}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-transform active:scale-95"
        >
          <Mail className="h-4 w-4" /> {HELLO_EMAIL}
        </a>
      </InfoSection>

      <InfoSection title="Need help with your account?">
        <p>For login, billing, account, and product support:</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95"
        >
          <PhoneCall className="h-4 w-4" /> {SUPPORT_EMAIL}
        </a>
      </InfoSection>

      <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-muted-foreground">
        <Link to="/support" className="hover:text-foreground">
          Support
        </Link>
        <span aria-hidden>·</span>
        <Link to="/about" className="hover:text-foreground">
          About
        </Link>
      </div>
    </InfoPage>
  );
}
