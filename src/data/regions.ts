
export type Region = "europe" | "asia" | "africa" | "americas" | "oceania" | "middle-east";

export const REGION_META: Record<Region, { label: string; image: string }> = {
  europe: { label: "Europe", image: "/regions/region-europe.jpg" },
  asia: { label: "Asia", image: "/regions/region-asia.jpg" },
  africa: { label: "Africa", image: "/regions/region-africa.jpg" },
  americas: { label: "Americas", image: "/regions/region-americas.jpg" },
  oceania: { label: "Oceania", image: "/regions/region-oceania.jpg" },
  "middle-east": { label: "Middle East", image: "/regions/region-middle-east.jpg" },
};

export const REGION_ORDER: Region[] = [
  "europe",
  "asia",
  "americas",
  "middle-east",
  "africa",
  "oceania",
];
