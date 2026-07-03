import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — VisaPilot" },
      { name: "description", content: "How VisaPilot collects, uses, and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage
      badge={<><ShieldCheck className="h-3.5 w-3.5" /> Your data, protected</>}
      title="Privacy Policy"
      subtitle="This page is maintained by the VisaPilot team to explain how the app handles your information."
    >
      <InfoSection title="What we collect">
        <p>
          If you create an account, we store your email address and any profile details you
          choose to add — such as your name, nationality, passport country, and passport expiry
          date. Adding passport details is always optional.
        </p>
        <p>
          Without an account, your visa searches, checklists, and budgets are stored only on
          your device and never leave it.
        </p>
      </InfoSection>

      <InfoSection title="How your data is used">
        <p>
          Your data is used solely to power VisaPilot features: remembering your passport for
          faster visa checks, syncing your trips and favorites across sessions, and warning you
          before your passport expires.
        </p>
        <p>We do not sell your personal data or share it with advertisers.</p>
      </InfoSection>

      <InfoSection title="AI Assistant conversations">
        <p>
          Messages you send to the AI Assistant are processed by an AI service to generate
          responses. Chat history is stored locally on your device — you can clear it anytime
          from the assistant screen. Avoid sharing sensitive documents or full passport numbers
          in chat.
        </p>
      </InfoSection>

      <InfoSection title="Data security">
        <p>
          Account data is stored in a secure cloud database with row-level access controls, so
          each user can only access their own records. Connections are encrypted in transit.
        </p>
      </InfoSection>

      <InfoSection title="Deleting your data">
        <p>
          You can permanently delete your account and all associated data anytime from
          Settings → Account → Delete account. Local device data can be cleared through your
          browser or device settings.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
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
