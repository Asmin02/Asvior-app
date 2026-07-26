import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Asvior" },
      { name: "description", content: "How Asvior collects, uses, and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage
      badge={<><ShieldCheck className="h-3.5 w-3.5" /> Your data, protected</>}
      title="Privacy Policy"
      subtitle="How Asvior collects, uses, stores, and protects information in production use."
    >
      <InfoSection title="1. Information we collect">
        <p>
          When you create an account, we collect core account information such as email and
          optional profile fields you choose to provide, including name, nationality, passport
          country, and passport expiry date.
        </p>
        <p>
          If you use Asvior without signing in, planning data such as recent searches, draft
          checklists, and local settings remains on-device.
        </p>
      </InfoSection>

      <InfoSection title="2. How we use information">
        <p>
          We use data to operate app features, including account authentication, profile sync,
          favorites, history, and personalized travel-planning workflows.
        </p>
        <p>
          We do not sell personal information and we do not use your data for third-party ad
          targeting.
        </p>
      </InfoSection>

      <InfoSection title="3. AI Assistant processing">
        <p>
          Messages sent to the AI Assistant are processed to generate responses. Avoid sharing
          highly sensitive identifiers. Assistant conversation history is stored locally and can
          be managed from within the assistant experience.
        </p>
      </InfoSection>

      <InfoSection title="4. Storage and security">
        <p>
          Account-linked records are stored in managed infrastructure with access controls and
          encrypted transport. We apply least-privilege patterns for data access in application
          services.
        </p>
      </InfoSection>

      <InfoSection title="5. Data retention and deletion">
        <p>
          You may request deletion by using the in-app account deletion option. This removes
          account-scoped data associated with your profile. On-device data can also be cleared
          by uninstalling the app or clearing app storage.
        </p>
      </InfoSection>

      <InfoSection title="6. Your choices">
        <p>
          You control key settings such as language, theme, and notification preferences. You can
          also choose whether to sign in and sync across sessions.
        </p>
      </InfoSection>

      <InfoSection title="7. Contact">
        <p>
          Questions about privacy? Reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary underline-offset-2 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
