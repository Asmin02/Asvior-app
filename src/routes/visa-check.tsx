import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CountryCombobox } from "@/components/CountryCombobox";

export const Route = createFileRoute("/visa-check")({
  head: () => ({
    meta: [
      { title: "Visa Check — VisaPilot" },
      { name: "description", content: "Check visa requirements between countries with VisaPilot." },
      { property: "og:title", content: "Visa Check — VisaPilot" },
      { property: "og:description", content: "Check visa requirements between countries with VisaPilot." },
    ],
  }),
  component: VisaCheckPage,
});

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belarus",
  "Belgium", "Brazil", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia",
  "Czech Republic", "Denmark", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Germany",
  "Ghana", "Greece", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kuwait", "Laos", "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia",
  "Maldives", "Mexico", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", "UAE",
  "Ukraine", "United Kingdom", "United States", "Vietnam",
];

type Status = "Visa Required" | "Not Required" | "Visa on Arrival" | "ETA / eVisa";

interface VisaResult {
  status: Status;
  explanation: string;
  maxStay: string;
  documents: string[];
  processingTime: string;
  officialUrl: string;
}

function getVisaRequirement(passport: string, destination: string): VisaResult {
  const base = (status: Status, explanation: string, override: Partial<VisaResult> = {}): VisaResult => {
    const defaults: Record<Status, Pick<VisaResult, "maxStay" | "documents" | "processingTime">> = {
      "Not Required": {
        maxStay: "Up to 90 days",
        documents: ["Valid passport (6+ months)", "Return ticket", "Proof of accommodation"],
        processingTime: "No application required",
      },
      "Visa on Arrival": {
        maxStay: "15–30 days",
        documents: ["Valid passport", "Passport photo", "Visa fee (cash)", "Proof of onward travel"],
        processingTime: "Issued at the border (15–60 minutes)",
      },
      "ETA / eVisa": {
        maxStay: "Up to 90 days",
        documents: ["Valid passport", "Online application", "Credit/debit card for fee", "Recent photo"],
        processingTime: "Usually 24–72 hours",
      },
      "Visa Required": {
        maxStay: "Varies by visa type (typically 30–90 days)",
        documents: ["Valid passport", "Completed visa form", "Bank statements", "Travel itinerary", "Invitation letter (if applicable)"],
        processingTime: "2–6 weeks",
      },
    };
    return {
      status,
      explanation,
      officialUrl: `https://www.google.com/search?q=${encodeURIComponent(`${destination} official visa information for ${passport} citizens`)}`,
      ...defaults[status],
      ...override,
    };
  };

  if (passport === destination) {
    return base("Not Required", "You don't need a visa to travel within your own country.", {
      maxStay: "Unlimited",
      documents: ["National ID or passport"],
      processingTime: "—",
    });
  }

  const visaFreePairs: [string, string][] = [
    ["United States", "Canada"], ["Canada", "United States"],
    ["United Kingdom", "Ireland"], ["Ireland", "United Kingdom"],
    ["Germany", "France"], ["France", "Germany"],
    ["Germany", "Italy"], ["Italy", "Germany"],
    ["Germany", "Spain"], ["Spain", "Germany"],
    ["Germany", "Netherlands"], ["Netherlands", "Germany"],
    ["France", "Italy"], ["Italy", "France"],
    ["France", "Spain"], ["Spain", "France"],
    ["Australia", "New Zealand"], ["New Zealand", "Australia"],
    ["Singapore", "Malaysia"], ["Malaysia", "Singapore"],
    ["South Korea", "Japan"], ["Japan", "South Korea"],
    ["Hong Kong", "Taiwan"], ["Taiwan", "Hong Kong"],
    ["UAE", "Qatar"], ["Qatar", "UAE"],
    ["United States", "United Kingdom"], ["United Kingdom", "United States"],
  ];

  const visaOnArrivalPairs: [string, string][] = [
    ["United States", "Thailand"], ["United Kingdom", "Thailand"],
    ["Germany", "Thailand"], ["France", "Thailand"],
    ["Australia", "Thailand"], ["Canada", "Thailand"],
    ["United States", "Cambodia"], ["United Kingdom", "Cambodia"],
    ["United States", "Laos"], ["United Kingdom", "Laos"],
    ["United States", "Maldives"], ["United Kingdom", "Maldives"],
    ["United States", "Nepal"], ["United Kingdom", "Nepal"],
    ["Germany", "Indonesia"], ["France", "Indonesia"],
    ["Australia", "Indonesia"], ["Canada", "Indonesia"],
  ];

  const etaPairs: [string, string][] = [
    ["United States", "Australia"], ["United Kingdom", "Australia"],
    ["Germany", "Australia"], ["France", "Australia"],
    ["United States", "New Zealand"], ["United Kingdom", "New Zealand"],
  ];

  if (visaFreePairs.some(([a, b]) => a === passport && b === destination)) {
    return base(
      "Not Required",
      `Citizens of ${passport} can travel to ${destination} without a visa for short stays.`,
    );
  }
  if (visaOnArrivalPairs.some(([a, b]) => a === passport && b === destination)) {
    return base(
      "Visa on Arrival",
      `Citizens of ${passport} can obtain a visa on arrival in ${destination}.`,
    );
  }
  if (etaPairs.some(([a, b]) => a === passport && b === destination)) {
    return base(
      "ETA / eVisa",
      `Citizens of ${passport} must apply for an electronic visa online before traveling to ${destination}.`,
    );
  }

  const rand = (passport.length + destination.length) % 4;
  const status: Status =
    rand === 0 ? "Not Required" : rand === 1 ? "Visa on Arrival" : rand === 2 ? "ETA / eVisa" : "Visa Required";

  return base(
    status,
    `Estimated requirement for citizens of ${passport} traveling to ${destination}. Always confirm with official sources.`,
  );
}

const statusStyles: Record<Status, { chip: string; ring: string; icon: React.ReactNode }> = {
  "Not Required": {
    chip: "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/40",
    ring: "ring-green-200 dark:ring-green-900/60",
    icon: <CheckIcon className="h-3.5 w-3.5" />,
  },
  "Visa on Arrival": {
    chip: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40",
    ring: "ring-amber-200 dark:ring-amber-900/60",
    icon: <ClockIcon className="h-3.5 w-3.5" />,
  },
  "ETA / eVisa": {
    chip: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
    ring: "ring-blue-200 dark:ring-blue-900/60",
    icon: <GlobeIcon className="h-3.5 w-3.5" />,
  },
  "Visa Required": {
    chip: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/40",
    ring: "ring-red-200 dark:ring-red-900/60",
    icon: <CrossIcon className="h-3.5 w-3.5" />,
  },
};

function VisaCheckPage() {
  const [passport, setPassport] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState<VisaResult | null>(null);

  const handleCheck = () => {
    if (!passport || !destination) return;
    setResult(getVisaRequirement(passport, destination));
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Visa Check</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Search your passport and destination to see visa requirements.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Passport Country</label>
          <CountryCombobox
            value={passport}
            onChange={(v) => { setPassport(v); setResult(null); }}
            options={countries}
            placeholder="Search passport country..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Destination Country</label>
          <CountryCombobox
            value={destination}
            onChange={(v) => { setDestination(v); setResult(null); }}
            options={countries}
            placeholder="Search destination..."
          />
        </div>

        <Button
          onClick={handleCheck}
          disabled={!passport || !destination}
          className="w-full py-5 text-sm font-semibold"
        >
          Check Visa
        </Button>
      </div>

      {result && (
        <Card className={`mt-6 ring-1 ${statusStyles[result.status].ring}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2">
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[result.status].chip}`}>
                {statusStyles[result.status].icon}
                {result.status}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {passport} → {destination}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-foreground">{result.explanation}</p>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <InfoRow label="Maximum stay" value={result.maxStay} />
              <InfoRow label="Processing time" value={result.processingTime} />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Required documents
                </p>
                <ul className="mt-1.5 space-y-1">
                  {result.documents.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={result.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <GlobeIcon className="h-4 w-4" />
                Visit official information
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-[10px] text-muted-foreground">
              Demo data. Always confirm requirements with official government sources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
function CrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.919 17.919 0 01-8.716-2.247m0 0A9.004 9.004 0 003 12c0 1.681.445 3.268 1.22 4.625" />
    </svg>
  );
}
function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}
