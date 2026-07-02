import europeImg from "@/assets/region-europe.jpg";
import asiaImg from "@/assets/region-asia.jpg";
import africaImg from "@/assets/region-africa.jpg";
import americasImg from "@/assets/region-americas.jpg";
import oceaniaImg from "@/assets/region-oceania.jpg";
import middleEastImg from "@/assets/region-middle-east.jpg";

export type Region = "europe" | "asia" | "africa" | "americas" | "oceania" | "middle-east";

export const REGION_META: Record<Region, { label: string; image: string }> = {
  europe: { label: "Europe", image: europeImg },
  asia: { label: "Asia", image: asiaImg },
  africa: { label: "Africa", image: africaImg },
  americas: { label: "Americas", image: americasImg },
  oceania: { label: "Oceania", image: oceaniaImg },
  "middle-east": { label: "Middle East", image: middleEastImg },
};

export const REGION_ORDER: Region[] = ["europe", "asia", "americas", "middle-east", "africa", "oceania"];
