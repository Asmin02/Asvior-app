import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageSquareText, ShieldCheck, FileText } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { APP_NAME, APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Asvior" },
      { name: "description", content: "Contact the Asvior team for support, feedback, partnerships, and policy requests." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InfoPage
      badge={<><MessageSquareText className="h-3.5 w-3.5" /> We are here to help</>}
      title="Contact"
      subtitle="Reach the Asvior team for support and product questions."
    >
      <InfoSection title="Customer support">
        <p>
          Need help with account access, sync issues, visa checker behavior, or billing-related
          questions in future releases? Contact support and include your device model and a short
          description of the issue for faster resolution.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${APP_NAME} Support`)}`}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95"
        >
          <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
        </a>
      </InfoSection>

      <InfoSection title="Business and partnerships">
        <p>
          For partnerships, integrations, and media inquiries, use the same address with the
          subject line "Partnership" so your request can be routed correctly.
        </p>
      </InfoSection>

      <InfoSection title="Policy requests">
        <p>
          For privacy-related requests or terms questions, contact us by email and reference your
          account email address.
        </p>
      </InfoSection>

      <InfoSection title="Release info">
        <p>
          {APP_NAME} version {APP_VERSION}
        </p>
      </InfoSection>

      <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-muted-foreground">
        <Link to="/about" className="inline-flex items-center gap-1 hover:text-foreground"><FileText className="h-3.5 w-3.5" /> About</Link>
        <span aria-hidden>·</span>
        <Link to="/privacy" className="inline-flex items-center gap-1 hover:text-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Privacy</Link>
      </div>
    </InfoPage>
  );
}
