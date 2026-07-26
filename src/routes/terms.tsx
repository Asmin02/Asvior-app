import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Asvior" },
      { name: "description", content: "Terms of use for the Asvior travel and visa assistant." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPage
      badge={<><FileText className="h-3.5 w-3.5" /> The fine print, kept simple</>}
      title="Terms of Service"
      subtitle="These terms govern your use of Asvior services and applications."
    >
      <InfoSection title="1. Acceptance of terms">
        <p>
          By accessing or using Asvior, you agree to these Terms of Service and applicable laws.
          If you do not agree, do not use the service.
        </p>
      </InfoSection>

      <InfoSection title="2. Service description">
        <p>
          Asvior is an informational travel-planning tool. It helps you understand visa
          requirements, build checklists, estimate budgets, and get AI-powered travel guidance.
        </p>
      </InfoSection>

      <InfoSection title="3. No legal or immigration advice">
        <p>
          Visa and entry requirements change frequently and can vary by individual
          circumstances. Information in Asvior — including AI Assistant responses — is
          provided for general guidance only and is <strong className="text-foreground">not legal or immigration advice</strong>.
        </p>
        <p>
          Always verify requirements with the official embassy, consulate, or government
          immigration authority of your destination before making travel decisions or bookings.
        </p>
      </InfoSection>

      <InfoSection title="4. Accounts and credentials">
        <p>
          You're responsible for keeping your login credentials secure and for the accuracy of
          the information you add to your profile. You may delete your account at any time from
          Settings.
        </p>
      </InfoSection>

      <InfoSection title="5. Acceptable use">
        <p>
          Don't misuse the app: no attempts to disrupt the service, access other users' data,
          or use the AI Assistant to generate harmful or unlawful content.
        </p>
      </InfoSection>

      <InfoSection title="6. Intellectual property">
        <p>
          The Asvior product, branding, and software are protected by intellectual property laws.
          You may not copy, reverse engineer, distribute, or exploit the service beyond permitted
          use.
        </p>
      </InfoSection>

      <InfoSection title="7. Availability and changes">
        <p>
          We may update, suspend, or discontinue parts of the service to improve reliability,
          security, and product quality.
        </p>
      </InfoSection>

      <InfoSection title="8. Limitation of liability">
        <p>
          Asvior is provided "as is". To the maximum extent permitted by law, we are not
          liable for losses arising from reliance on information in the app, including denied
          entry, visa refusals, or travel disruptions.
        </p>
      </InfoSection>

      <InfoSection title="9. Contact">
        <p>
          Questions about these terms? Contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary underline-offset-2 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
