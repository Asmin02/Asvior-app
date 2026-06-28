import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

type VisaResult = {
  status: "Visa Required" | "Not Required" | "Visa on Arrival" | "ETA / eVisa";
  explanation: string;
};

function getVisaRequirement(passport: string, destination: string): VisaResult {
  if (passport === destination) {
    return {
      status: "Not Required",
      explanation: "You don't need a visa to travel within your own country.",
    };
  }

  // Simplified mock data for demo purposes
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
    ["United States", "Canada"], ["United Kingdom", "Canada"],
    ["Germany", "Canada"], ["France", "Canada"],
    ["United States", "New Zealand"], ["United Kingdom", "New Zealand"],
  ];

  const pairKey = (a: string, b: string) => `${a} → ${b}`;

  if (visaFreePairs.some(([a, b]) => a === passport && b === destination)) {
    return {
      status: "Not Required",
      explanation: `Citizens of ${passport} can travel to ${destination} without a visa for short stays (typically up to 90 days).`,
    };
  }

  if (visaOnArrivalPairs.some(([a, b]) => a === passport && b === destination)) {
    return {
      status: "Visa on Arrival",
      explanation: `Citizens of ${passport} can obtain a visa on arrival in ${destination}. Bring a valid passport and required fees.`,
    };
  }

  if (etaPairs.some(([a, b]) => a === passport && b === destination)) {
    return {
      status: "ETA / eVisa",
      explanation: `Citizens of ${passport} need to apply for an electronic visa (eVisa/ETA) online before traveling to ${destination}.`,
    };
  }

  // Default fallback
  const rand = (passport.length + destination.length) % 4;
  if (rand === 0) {
    return {
      status: "Not Required",
      explanation: `Citizens of ${passport} can travel to ${destination} without a visa for short stays. Always verify with official sources before traveling.`,
    };
  } else if (rand === 1) {
    return {
      status: "Visa on Arrival",
      explanation: `Citizens of ${passport} can obtain a visa on arrival in ${destination}. Bring a valid passport and required fees.`,
    };
  } else if (rand === 2) {
    return {
      status: "ETA / eVisa",
      explanation: `Citizens of ${passport} need to apply for an electronic visa (eVisa/ETA) online before traveling to ${destination}.`,
    };
  } else {
    return {
      status: "Visa Required",
      explanation: `Citizens of ${passport} must obtain a visa before traveling to ${destination}. Contact the ${destination} embassy or consulate for application details.`,
    };
  }
}

function VisaCheckPage() {
  const [passport, setPassport] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState<VisaResult | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (!passport || !destination) return;
    setResult(getVisaRequirement(passport, destination));
    setChecked(true);
  };

  const statusColor = (status: VisaResult["status"]) => {
    switch (status) {
      case "Not Required":
        return "text-green-600 bg-green-50 ring-green-200";
      case "Visa on Arrival":
        return "text-amber-600 bg-amber-50 ring-amber-200";
      case "ETA / eVisa":
        return "text-blue-600 bg-blue-50 ring-blue-200";
      case "Visa Required":
        return "text-red-600 bg-red-50 ring-red-200";
      default:
        return "text-muted-foreground bg-muted ring-border";
    }
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Visa Check</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Select your passport and destination to check visa requirements.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Passport Country
          </label>
          <select
            value={passport}
            onChange={(e) => {
              setPassport(e.target.value);
              setChecked(false);
            }}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Destination Country
          </label>
          <select
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setChecked(false);
            }}
            className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleCheck}
          disabled={!passport || !destination}
          className="w-full py-5 text-sm font-semibold"
        >
          Check Visa
        </Button>
      </div>

      {checked && result && (
        <Card className={`mt-6 ring-1 ${statusColor(result.status).split(" ")[2]}`}>
          <CardContent className="p-5">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusColor(result.status)}`}>
              {result.status === "Not Required" && <CheckIcon className="h-3.5 w-3.5" />}
              {result.status === "Visa Required" && <CrossIcon className="h-3.5 w-3.5" />}
              {result.status === "Visa on Arrival" && <ClockIcon className="h-3.5 w-3.5" />}
              {result.status === "ETA / eVisa" && <GlobeIcon className="h-3.5 w-3.5" />}
              {result.status}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {result.explanation}
            </p>
            <p className="mt-3 text-[10px] text-muted-foreground">
              This is a simplified demo. Always confirm requirements with official sources before traveling.
            </p>
          </CardContent>
        </Card>
      )}
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
