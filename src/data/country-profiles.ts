// AUTO-GENERATED country travel profiles. Edit with care — regenerate rather
// than hand-editing bulk data.
import type { Region } from "@/data/regions";

export interface CountryAttraction {
  name: string;
  blurb: string;
  emoji: string;
}

export interface CountryProfile {
  code: string;
  region: Region;
  capital: string;
  intro: string;
  bestSeason: string;
  currency: string;
  language: string;
  timezone: string;
  plug: string;
  emergency: string;
  cost: { budget: number; standard: number; luxury: number };
  attractions: CountryAttraction[];
  tips: { food: string; culture: string; transport: string; safety: string };
}

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
 "AD": {
  "code": "AD",
  "region": "europe",
  "capital": "Andorra la Vella",
  "intro": "A high-altitude tax haven nestled in the Pyrenees offering world-class skiing, mountain hiking, and duty-free shopping luxury.",
  "bestSeason": "Dec–Mar & Jul–Sep",
  "currency": "Euro (EUR)",
  "language": "Catalan",
  "timezone": "UTC+1",
  "plug": "Type F · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 80,
   "standard": 160,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Grandvalira",
    "blurb": "The largest ski resort in the Pyrenees with extensive snowy slopes.",
    "emoji": "⛷️"
   },
   {
    "name": "Caldea Spa",
    "blurb": "A futuristic thermal spa complex perfect for relaxation after hiking.",
    "emoji": "🧖"
   },
   {
    "name": "Madriu-Perafita-Claror",
    "blurb": "A stunning UNESCO glacial valley with historic stone shepherd cabins.",
    "emoji": "⛰️"
   },
   {
    "name": "Casa de la Vall",
    "blurb": "Historic 16th-century manor house once serving as the national parliament.",
    "emoji": "🏛️"
   }
  ],
  "tips": {
   "food": "Try Escudella, a hearty traditional stew typical of the mountain climate.",
   "culture": "Catalan is the official language; locals appreciate when you use it.",
   "transport": "There are no trains; rely on buses or rental cars to travel.",
   "safety": "Crime is extremely low, making it one of Europe's safest destinations."
  }
 },
 "AE": {
  "code": "AE",
  "region": "middle-east",
  "capital": "Abu Dhabi",
  "intro": "A futuristic oasis blending Bedouin heritage with soaring skyscrapers, golden deserts, and unparalleled luxury shopping experiences.",
  "bestSeason": "Nov–Mar",
  "currency": "UAE Dirham (AED)",
  "language": "Arabic, English",
  "timezone": "UTC+4",
  "plug": "Type G · 230V",
  "emergency": "999 police · 998 ambulance",
  "cost": {
   "budget": 100,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Burj Khalifa",
    "blurb": "The world's tallest building offering breathtaking views of Dubai's skyline.",
    "emoji": "🏙️"
   },
   {
    "name": "Sheikh Zayed Mosque",
    "blurb": "An architectural masterpiece in Abu Dhabi featuring eighty-two white marble domes.",
    "emoji": "🕌"
   },
   {
    "name": "Palm Jumeirah",
    "blurb": "A man-made archipelago shaped like a palm tree with luxury resorts.",
    "emoji": "🏝️"
   },
   {
    "name": "Empty Quarter",
    "blurb": "Vast, stunning sand dunes perfect for desert safaris and stargazing.",
    "emoji": "🐪"
   }
  ],
  "tips": {
   "food": "Must try Al Machboos, a flavorful spiced meat and rice dish.",
   "culture": "Dress modestly in public places, especially when visiting religious sites.",
   "transport": "Taxis are affordable; Dubai's metro is efficient and very clean.",
   "safety": "Extremely safe for travelers with strict laws and low crime rates."
  }
 },
 "AF": {
  "code": "AF",
  "region": "asia",
  "capital": "Kabul",
  "intro": "A rugged land of ancient history, silk road heritage, and dramatic mountain landscapes currently undergoing complex transitions.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Afghan Afghani (AFN)",
  "language": "Pashto, Dari",
  "timezone": "UTC+4:30",
  "plug": "Type C/F · 220V",
  "emergency": "112 police · 102 ambulance",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 150
  },
  "attractions": [
   {
    "name": "Band-e-Amir",
    "blurb": "A series of six deep blue lakes set against desert cliffs.",
    "emoji": "💧"
   },
   {
    "name": "Babur Tomb",
    "blurb": "The historic, terraced garden burial site of the first Mughal emperor.",
    "emoji": "🌳"
   },
   {
    "name": "Minaret of Jam",
    "blurb": "A towering 12th-century UNESCO brick structure in a remote valley.",
    "emoji": "🗼"
   },
   {
    "name": "Blue Mosque",
    "blurb": "A stunning, intricately tiled shrine located in the city of Mazar-i-Sharif.",
    "emoji": "🕌"
   }
  ],
  "tips": {
   "food": "Kabuli Pulao is the national dish and is wonderfully fragrant.",
   "culture": "Hospitality is deeply ingrained; follow local customs regarding dress and gender.",
   "transport": "Internal travel is difficult; check current security advisories before moving between cities.",
   "safety": "High safety risks; check all government travel warnings before planning any visit."
  }
 },
 "AG": {
  "code": "AG",
  "region": "americas",
  "capital": "St. John's",
  "intro": "A tropical paradise boasting 365 white-sand beaches, vibrant coral reefs, and a rich colonial maritime history.",
  "bestSeason": "Dec–Apr",
  "currency": "East Caribbean Dollar (XCD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type A/B · 230V",
  "emergency": "999/911 emergency",
  "cost": {
   "budget": 120,
   "standard": 280,
   "luxury": 650
  },
  "attractions": [
   {
    "name": "Nelson's Dockyard",
    "blurb": "A restored Georgian naval base still serving the yachting community today.",
    "emoji": "⛵"
   },
   {
    "name": "Shirley Heights",
    "blurb": "Famous lookout providing iconic views and Sunday sunset barbecue parties.",
    "emoji": "🌅"
   },
   {
    "name": "Dickenson Bay",
    "blurb": "The most popular beach for swimming, watersports, and beach bars.",
    "emoji": "🏖️"
   },
   {
    "name": "Devil’s Bridge",
    "blurb": "A natural limestone arch carved by thousands of years of Atlantic waves.",
    "emoji": "🌊"
   }
  ],
  "tips": {
   "food": "Try 'Fungi and Pepperpot,' the national dish made of cornmeal and stew.",
   "culture": "Locals are friendly; it is polite to greet everyone with 'Good morning'.",
   "transport": "Buses are cheap but infrequent; renting a car is best for exploring.",
   "safety": "Generally safe, but avoid isolated beaches and walking alone at night."
  }
 },
 "AL": {
  "code": "AL",
  "region": "europe",
  "capital": "Tirana",
  "intro": "Europe’s hidden gem featuring wild mountains, pristine turquoise coastlines, and a fascinating blend of Ottoman and Mediterranean history.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Albanian Lek (ALL)",
  "language": "Albanian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "129 police · 127 ambulance",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Butrint",
    "blurb": "Ancient Greek and Roman ruins set within a lush national park.",
    "emoji": "🏛️"
   },
   {
    "name": "Berat",
    "blurb": "The 'City of a Thousand Windows' known for its Ottoman architecture.",
    "emoji": "🏘️"
   },
   {
    "name": "Theth",
    "blurb": "A remote mountain village offering some of the best hiking in Europe.",
    "emoji": "🥾"
   },
   {
    "name": "Ksamil Islands",
    "blurb": "Crystal clear waters and white sand beaches on the Albanian Riviera.",
    "emoji": "🌊"
   }
  ],
  "tips": {
   "food": "Flija is a delicious layered pancake traditional in many households.",
   "culture": "A nod means 'no' and a shake means 'yes' sometimes; it’s confusing!",
   "transport": "Furgons (minibuses) are the common way to travel between different towns.",
   "safety": "Albania is very safe; people are famously hospitable to foreign visitors."
  }
 },
 "AM": {
  "code": "AM",
  "region": "asia",
  "capital": "Yerevan",
  "intro": "A land of ancient monasteries, dramatic canyons, and high-altitude lakes settled in the shadow of Mount Ararat.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Armenian Dram (AMD)",
  "language": "Armenian",
  "timezone": "UTC+4",
  "plug": "Type C/F · 230V",
  "emergency": "103 ambulance · 102 police",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Khor Virap",
    "blurb": "Iconic monastery offering the most famous view of Mount Ararat.",
    "emoji": "⛪"
   },
   {
    "name": "Tatev Monastery",
    "blurb": "Medieval monastery reached by the world’s longest reversible cable car.",
    "emoji": "🚠"
   },
   {
    "name": "Lake Sevan",
    "blurb": "Huge alpine lake known as the 'Jewel of Armenia'.",
    "emoji": "⛵"
   },
   {
    "name": "The Cascade",
    "blurb": "Giant limestone stairway in Yerevan housing contemporary art and gardens.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Don't miss Lavash, the traditional flatbread baked in underground ovens.",
   "culture": "Family is central; expect warm welcomes and invitations for coffee.",
   "transport": "Yerevan has a metro; use taxis (apps) for cheap intercity travel.",
   "safety": "Yerevan is very safe at night, but be cautious near border zones."
  }
 },
 "AO": {
  "code": "AO",
  "region": "africa",
  "capital": "Luanda",
  "intro": "An emerging frontier offering vast wildlife parks, dramatic coastal cliffs, and a unique Luso-African cultural fusion.",
  "bestSeason": "Jun–Sep",
  "currency": "Angolan Kwanza (AOA)",
  "language": "Portuguese",
  "timezone": "UTC+1",
  "plug": "Type C · 220V",
  "emergency": "113 police · 112 ambulance",
  "cost": {
   "budget": 70,
   "standard": 200,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Kalandula Falls",
    "blurb": "Among Africa’s largest waterfalls, majestic and thunderous in the rainy season.",
    "emoji": "💦"
   },
   {
    "name": "Tundavala Gap",
    "blurb": "A massive volcanic abyss offering breathtaking views over the plains.",
    "emoji": "🌄"
   },
   {
    "name": "Kissama Park",
    "blurb": "The country's top wildlife sanctuary for seeing elephants and giraffes.",
    "emoji": "🐘"
   },
   {
    "name": "Ilha de Luanda",
    "blurb": "A sandy peninsula known for upscale restaurants and lively nightlife.",
    "emoji": "🍹"
   }
  ],
  "tips": {
   "food": "Muamba de Galinha is a rich, palm-oil based chicken stew.",
   "culture": "Learning basic Portuguese phrases will greatly improve your travel experience.",
   "transport": "Traffic in Luanda is legendary; plan for significant delays during peak hours.",
   "safety": "Luanda can be dangerous; avoid walking at night and watch for pickpockets."
  }
 },
 "AR": {
  "code": "AR",
  "region": "americas",
  "capital": "Buenos Aires",
  "intro": "A passionate land of tango, world-class steak, and diverse landscapes from glacial Patagonia to colorful Andean peaks.",
  "bestSeason": "Oct–Dec & Mar–May",
  "currency": "Argentine Peso (ARS)",
  "language": "Spanish",
  "timezone": "UTC-3",
  "plug": "Type C/I · 220V",
  "emergency": "911 emergency",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Iguazu Falls",
    "blurb": "A colossal system of 275 waterfalls bordering Brazil in the jungle.",
    "emoji": "🌊"
   },
   {
    "name": "Perito Moreno",
    "blurb": "An advancing glacier where visitors watch massive ice chunks crash down.",
    "emoji": "🧊"
   },
   {
    "name": "La Boca",
    "blurb": "Colorful neighborhood in Buenos Aires famous for tango and soccer.",
    "emoji": "💃"
   },
   {
    "name": "Mendoza",
    "blurb": "The heart of wine country, famous for high-altitude Malbec production.",
    "emoji": "🍷"
   }
  ],
  "tips": {
   "food": "Enjoy a traditional 'Asado' (barbecue) for the ultimate local dining experience.",
   "culture": "Dinner starts late (9 PM or later); don't arrive early to restaurants.",
   "transport": "Long-distance buses are incredibly comfortable with lie-flat seats and meals.",
   "safety": "Be aware of petty theft in Buenos Aires; use 'blue dollar' rates."
  }
 },
 "AT": {
  "code": "AT",
  "region": "europe",
  "capital": "Vienna",
  "intro": "The imperial heart of Europe featuring grand classical music venues, alpine splendor, and historic coffee house traditions.",
  "bestSeason": "Jun–Aug & Dec",
  "currency": "Euro (EUR)",
  "language": "German",
  "timezone": "UTC+1",
  "plug": "Type F · 230V",
  "emergency": "133 police · 144 ambulance",
  "cost": {
   "budget": 90,
   "standard": 190,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Schönbrunn Palace",
    "blurb": "The former Habsburg summer residence with stunning gardens and interiors.",
    "emoji": "🏰"
   },
   {
    "name": "Hallstatt",
    "blurb": "A fairytale lakeside village surrounded by steep alpine mountains.",
    "emoji": "🏡"
   },
   {
    "name": "Salzburg Old Town",
    "blurb": "Birthplace of Mozart and the picturesque setting for 'The Sound of Music'.",
    "emoji": "🎼"
   },
   {
    "name": "Grossglockner Road",
    "blurb": "High alpine road offering panoramic views of Austria's highest peak.",
    "emoji": "🏔️"
   }
  ],
  "tips": {
   "food": "Savor a Wiener Schnitzel followed by a slice of Sachertorte cake.",
   "culture": "Sunday is a day of rest; most shops are strictly closed.",
   "transport": "Trains (ÖBB) are punctual and efficient for traveling across the country.",
   "safety": "One of the safest countries in the world; standard precautions suffice."
  }
 },
 "AU": {
  "code": "AU",
  "region": "oceania",
  "capital": "Canberra",
  "intro": "A vast continent of unique wildlife, vibrant coastal cities, ancient rainforests, and the iconic red Outback.",
  "bestSeason": "Sep–Nov & Mar–May",
  "currency": "Australian Dollar (AUD)",
  "language": "English",
  "timezone": "UTC+8 to +11",
  "plug": "Type I · 230V",
  "emergency": "000 emergency",
  "cost": {
   "budget": 110,
   "standard": 240,
   "luxury": 550
  },
  "attractions": [
   {
    "name": "Sydney Opera House",
    "blurb": "World-famous architectural icon situated on the beautiful Sydney Harbour.",
    "emoji": "⛵"
   },
   {
    "name": "Great Barrier Reef",
    "blurb": "The world's largest coral reef system teeming with diverse marine life.",
    "emoji": "🤿"
   },
   {
    "name": "Uluru",
    "blurb": "Sacred red sandstone monolith in the heart of the Northern Territory.",
    "emoji": "🌞"
   },
   {
    "name": "Great Ocean Road",
    "blurb": "Scenic coastal drive featuring the Twelve Apostles limestone stacks.",
    "emoji": "🚗"
   }
  ],
  "tips": {
   "food": "Try a meat pie or fresh seafood at a local market.",
   "culture": "Tipping is not mandatory or expected but appreciated for great service.",
   "transport": "Domestic flights are necessary for long distances; cities have good trains.",
   "safety": "Always swim between the red and yellow flags at the beach."
  }
 },
 "AZ": {
  "code": "AZ",
  "region": "middle-east",
  "capital": "Baku",
  "intro": "A captivating 'Land of Fire' where ultra-modern skyscrapers meet historic silk road villages and bubbling mud volcanoes.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Azerbaijani Manat (AZN)",
  "language": "Azerbaijani",
  "timezone": "UTC+4",
  "plug": "Type C/F · 230V",
  "emergency": "102 police · 103 ambulance",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Flame Towers",
    "blurb": "Three flame-shaped skyscrapers that dominate the Baku skyline with LED displays.",
    "emoji": "🔥"
   },
   {
    "name": "Icherisheher",
    "blurb": "The atmospheric Old City, a UNESCO site with the Maiden Tower.",
    "emoji": "🧱"
   },
   {
    "name": "Gobustan",
    "blurb": "National park featuring ancient rock carvings and unique active mud volcanoes.",
    "emoji": "🌋"
   },
   {
    "name": "Sheki Khan's Palace",
    "blurb": "Ornate 18th-century palace famous for its intricate stained-glass windows.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Drink tea (Chay) served in pear-shaped glasses with local fruit jams.",
   "culture": "Do not mention or bring items from Armenia due to conflict.",
   "transport": "In Baku, the metro is cheap; elsewhere, use the 'marshrutka' minibuses.",
   "safety": "Generally very safe, but be careful with unlicensed street taxis."
  }
 },
 "BA": {
  "code": "BA",
  "region": "europe",
  "capital": "Sarajevo",
  "intro": "A heart-shaped land of stunning waterfalls, Ottoman history, and resilient spirit at the crossroads of East and West.",
  "bestSeason": "May–Sep & Dec–Feb",
  "currency": "Convertible Mark (BAM)",
  "language": "Bosnian, Croatian, Serbian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "122 police · 124 ambulance",
  "cost": {
   "budget": 35,
   "standard": 75,
   "luxury": 160
  },
  "attractions": [
   {
    "name": "Stari Most",
    "blurb": "Iconic reconstructed Ottoman bridge in Mostar where locals dive into water.",
    "emoji": "🌉"
   },
   {
    "name": "Baščaršija",
    "blurb": "Sarajevo's old bazaar neighborhood, the cultural and historical heart of city.",
    "emoji": "☕"
   },
   {
    "name": "Kravica Falls",
    "blurb": "Beautiful tufa waterfalls perfect for swimming during the hot summer months.",
    "emoji": "🌊"
   },
   {
    "name": "Jajce",
    "blurb": "Historic town with a dramatic waterfall located right in the center.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "You must try Ćevapi (grilled minced meat cables in pita bread).",
   "culture": "Coffee is a slow ritual; don't rush through a Bosnian coffee.",
   "transport": "The train from Sarajevo to Mostar is exceptionally scenic and recommended.",
   "safety": "Stay on marked paths when hiking due to the risk of mines."
  }
 },
 "BB": {
  "code": "BB",
  "region": "americas",
  "capital": "Bridgetown",
  "intro": "A quintessential Caribbean paradise blending British colonial history with world-class surf, golden sands, and legendary rum punch culture.",
  "bestSeason": "Dec–Apr",
  "currency": "Barbadian Dollar (BBD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type A/B · 115V",
  "emergency": "211 police · 311 fire · 511 ambulance",
  "cost": {
   "budget": 120,
   "standard": 280,
   "luxury": 650
  },
  "attractions": [
   {
    "name": "Harrison's Cave",
    "blurb": "Underground tram ride through limestone caverns with flowing streams and pools.",
    "emoji": "🪨"
   },
   {
    "name": "Bathsheba Beach",
    "blurb": "Dramatic Atlantic coast famous for giant boulders and world-class surfing waves.",
    "emoji": "🌊"
   },
   {
    "name": "Mount Gay Distillery",
    "blurb": "Explore the history of the world's oldest commercial rum distillery.",
    "emoji": "🥃"
   },
   {
    "name": "Carlisle Bay",
    "blurb": "Pristine marine park perfect for snorkeling over historic shipwrecks and coral.",
    "emoji": "🤿"
   }
  ],
  "tips": {
   "food": "Must try the national dish, cou-cou and flying fish.",
   "culture": "Camouflage clothing is illegal for civilians to wear in Barbados.",
   "transport": "Yellow 'Z' buses are a loud, fun, and cheap way to travel.",
   "safety": "Keep belongings secure at night on secluded beaches."
  }
 },
 "BD": {
  "code": "BD",
  "region": "asia",
  "capital": "Dhaka",
  "intro": "A vibrant delta nation of endless river paths, the world's largest mangrove forest, and incredible hospitality.",
  "bestSeason": "Nov–Feb",
  "currency": "Bangladeshi Taka (BDT)",
  "language": "Bengali",
  "timezone": "UTC+6",
  "plug": "Type C/D/G/K · 220V",
  "emergency": "999",
  "cost": {
   "budget": 25,
   "standard": 60,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Sundarbans",
    "blurb": "Largest mangrove forest on Earth, home to the elusive Royal Bengal Tiger.",
    "emoji": "🐅"
   },
   {
    "name": "Cox's Bazar",
    "blurb": "The world's longest continuous natural sandy beach stretching 120 kilometers.",
    "emoji": "🏖️"
   },
   {
    "name": "Ahsan Manzil",
    "blurb": "The majestic 'Pink Palace' showcasing grand Mogul architectural heritage in Dhaka.",
    "emoji": "🕌"
   },
   {
    "name": "Srimangal",
    "blurb": "The tea capital featuring rolling green hills and layered seven-color tea.",
    "emoji": "🍵"
   }
  ],
  "tips": {
   "food": "Sample street food like Jhalmuri, but stick to bottled water.",
   "culture": "Dress modestly and always ask before taking photos of people.",
   "transport": "Experience a rickshaw ride in Dhaka for the ultimate local vibe.",
   "safety": "Avoid travel near border areas and monitor local news for strikes."
  }
 },
 "BE": {
  "code": "BE",
  "region": "europe",
  "capital": "Brussels",
  "intro": "Europe’s political heart charms visitors with medieval squares, surrealist art, and the world's finest chocolate and craft ales.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "Dutch, French, German",
  "timezone": "UTC+1",
  "plug": "Type C/E · 230V",
  "emergency": "112",
  "cost": {
   "budget": 90,
   "standard": 190,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Grand Place",
    "blurb": "Breathtaking UNESCO-listed central square surrounded by ornate 17th-century guildhalls.",
    "emoji": "🏛️"
   },
   {
    "name": "Canals of Bruges",
    "blurb": "Fairytale waterways winding through one of Europe's best-preserved medieval cities.",
    "emoji": "🛶"
   },
   {
    "name": "Atomium",
    "blurb": "Iconic steel landmark offering panoramic views of the Brussels skyline.",
    "emoji": "⚛️"
   },
   {
    "name": "Gravensteen",
    "blurb": "Imposing 12th-century 'Castle of the Counts' in the heart of Ghent.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Pair thick-cut Belgian fries with local mussels for a classic meal.",
   "culture": "Tipping is included in the bill, but rounded change is appreciated.",
   "transport": "The rail network is excellent for day trips between major cities.",
   "safety": "Be alert for pickpockets at busy Brussels train stations."
  }
 },
 "BF": {
  "code": "BF",
  "region": "africa",
  "capital": "Ouagadougou",
  "intro": "A West African cultural hub renowned for its vibrant music, expansive arts festivals, and warm, welcoming spirit.",
  "bestSeason": "Nov–Feb",
  "currency": "West African CFA franc (XOF)",
  "language": "French, Mossi",
  "timezone": "UTC+0",
  "plug": "Type C/E · 220V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 35,
   "standard": 85,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Sindou Peaks",
    "blurb": "Stunning jagged sandstone formations sculpted by wind over millions of years.",
    "emoji": "⛰️"
   },
   {
    "name": "Tiebele Village",
    "blurb": "Traditional Kassena houses decorated with intricate, hand-painted geometric patterns.",
    "emoji": "🎨"
   },
   {
    "name": "Banfora Waterfalls",
    "blurb": "Cascading falls and natural pools perfect for a refreshing swim.",
    "emoji": "💦"
   },
   {
    "name": "Grand Mosque of Bobo-Dioulasso",
    "blurb": "Magnificent Sudano-Sahelian mud architecture built in the late 19th century.",
    "emoji": "🕌"
   }
  ],
  "tips": {
   "food": "Try 'Poulet Bicyclette', a popular and flavorful local grilled chicken.",
   "culture": "Respectful greetings are essential; never use your left hand for giving.",
   "transport": "Bush taxis (sept-places) are the primary way to travel between towns.",
   "safety": "Check current travel advisories due to regional security concerns."
  }
 },
 "BG": {
  "code": "BG",
  "region": "europe",
  "capital": "Sofia",
  "intro": "Eastern Europe’s hidden gem offers affordable ski resorts, Black Sea beaches, and ancient Roman ruins nestled in Balkan mountains.",
  "bestSeason": "Jun–Aug & Dec–Mar",
  "currency": "Bulgarian Lev (BGN)",
  "language": "Bulgarian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 45,
   "standard": 95,
   "luxury": 230
  },
  "attractions": [
   {
    "name": "Alexander Nevsky Cathedral",
    "blurb": "Gigantic neo-Byzantine temple with gold-plated domes in central Sofia.",
    "emoji": "⛪"
   },
   {
    "name": "Rila Monastery",
    "blurb": "Stunning 10th-century spiritual retreat decorated with colorful, detailed frescoes.",
    "emoji": "🎨"
   },
   {
    "name": "Plovdiv Old Town",
    "blurb": "Ancient city featuring a perfectly preserved Roman theater still used today.",
    "emoji": "🏟️"
   },
   {
    "name": "Seven Rila Lakes",
    "blurb": "Breathtaking glacial lakes situated high in the rugged Rila Mountains.",
    "emoji": "🏔️"
   }
  ],
  "tips": {
   "food": "Start your meal with a Shopska salad and local rakia.",
   "culture": "Be aware: shaking the head often means yes, nodding means no.",
   "transport": "Buses and trains connect cities, but car rentals offer mountain access.",
   "safety": "Standard precautions apply; be wary of taxi scams at airports."
  }
 },
 "BH": {
  "code": "BH",
  "region": "middle-east",
  "capital": "Manama",
  "intro": "An island kingdom merging rich Dilmun heritage with a modern, cosmopolitan skyline and a passion for Formula 1.",
  "bestSeason": "Nov–Mar",
  "currency": "Bahraini Dinar (BHD)",
  "language": "Arabic, English",
  "timezone": "UTC+3",
  "plug": "Type G · 230V",
  "emergency": "999",
  "cost": {
   "budget": 100,
   "standard": 220,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Qal'at al-Bahrain",
    "blurb": "Ancient Portuguese fort and UNESCO site overlooking the Arabian Gulf coast.",
    "emoji": "🏰"
   },
   {
    "name": "Bab Al Bahrain",
    "blurb": "Historical gate leading into the vibrant, narrow alleys of Manama Souq.",
    "emoji": "🛍️"
   },
   {
    "name": "Tree of Life",
    "blurb": "Mysterious 400-year-old tree thriving alone in the middle of the desert.",
    "emoji": "🌳"
   },
   {
    "name": "Bahrain International Circuit",
    "blurb": "World-class racing venue home to the annual Formula 1 Grand Prix.",
    "emoji": "🏎️"
   }
  ],
  "tips": {
   "food": "Don't miss Machboos, a spiced rice dish with meat or fish.",
   "culture": "Dress respectfully in public; alcohol is available in hotels and bars.",
   "transport": "Taxis and ride-sharing are common; public buses are improving.",
   "safety": "Bahrain is generally very safe for expatriates and tourists alike."
  }
 },
 "BI": {
  "code": "BI",
  "region": "africa",
  "capital": "Gitega",
  "intro": "The beating heart of Africa, home to the hypnotic Royal Drummers and the misty shores of Lake Tanganyika.",
  "bestSeason": "Jun–Aug",
  "currency": "Burundian Franc (BIF)",
  "language": "Kirundi, French, English",
  "timezone": "UTC+2",
  "plug": "Type C/E · 220V",
  "emergency": "117 police · 118 fire · 112 ambulance",
  "cost": {
   "budget": 30,
   "standard": 75,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Lake Tanganyika",
    "blurb": "Crystal clear waters offering beach relaxation and incredible freshwater biodiversity.",
    "emoji": "🏖️"
   },
   {
    "name": "Rusizi National Park",
    "blurb": "Wetlands providing views of hippos, crocodiles, and numerous migratory birds.",
    "emoji": "🦛"
   },
   {
    "name": "Gishora Drum Sanctuary",
    "blurb": "Experience the powerful, rhythmic performance of the world-famous Burundian drummers.",
    "emoji": "🥁"
   },
   {
    "name": "Kigwena Forest",
    "blurb": "Dense tropical forest reserve home to primates and hornbills.",
    "emoji": "🐒"
   }
  ],
  "tips": {
   "food": "Try grilled 'Mukeke' fish, a delicious delicacy from Lake Tanganyika.",
   "culture": "Shaking hands is standard; learning 'Amahoro' (peace) is highly appreciated.",
   "transport": "Motorcycle taxis (tuk-tuks) are common for short city distances.",
   "safety": "Travel outside the capital requires caution; check travel warnings frequently."
  }
 },
 "BJ": {
  "code": "BJ",
  "region": "africa",
  "capital": "Porto-Novo",
  "intro": "The cradle of Voodoo culture, featuring stilt villages, palm-fringed coasts, and a complex history at the Ouidah slave port.",
  "bestSeason": "Nov–Feb",
  "currency": "West African CFA franc (XOF)",
  "language": "French, Fon, Yoruba",
  "timezone": "UTC+1",
  "plug": "Type C/E · 220V",
  "emergency": "117 police · 118 fire",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 210
  },
  "attractions": [
   {
    "name": "Ganvie",
    "blurb": "Africa's largest lake village, entirely built on stilts over Lake Nokoué.",
    "emoji": "🛶"
   },
   {
    "name": "Ouidah Museum of History",
    "blurb": "Located in a Portuguese fort, documenting the transatlantic slave trade history.",
    "emoji": "🏛️"
   },
   {
    "name": "Pendjari National Park",
    "blurb": "One of West Africa's best reserves for lions, elephants, and cheetahs.",
    "emoji": "🐘"
   },
   {
    "name": "Temple of Pythons",
    "blurb": "Sacred site housing dozens of respected pythons central to Voodoo belief.",
    "emoji": "🐍"
   }
  ],
  "tips": {
   "food": "Sample 'Amiwo', a traditional red corn paste served with meat.",
   "culture": "Voodoo is an official religion; approach sacred sites with extreme respect.",
   "transport": "Zémidjans (moto-taxis) are the fastest way to get around cities.",
   "safety": "Be cautious at night in Cotonou and avoid deserted beach areas."
  }
 },
 "BN": {
  "code": "BN",
  "region": "asia",
  "capital": "Bandar Seri Begawan",
  "intro": "A serene sultanate on Borneo, boasting opulent gold-domed mosques and pristine, untouched rainforests.",
  "bestSeason": "Jan–May",
  "currency": "Brunei Dollar (BND)",
  "language": "Malay, English",
  "timezone": "UTC+8",
  "plug": "Type G · 240V",
  "emergency": "993 police · 995 fire · 991 ambulance",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Omar Ali Saifuddien Mosque",
    "blurb": "An architectural masterpiece featuring gold domes and a ceremonial stone barge.",
    "emoji": "🕌"
   },
   {
    "name": "Kampong Ayer",
    "blurb": "Historic water village known as the 'Venice of the East'.",
    "emoji": "🏠"
   },
   {
    "name": "Ulu Temburong Park",
    "blurb": "Pristine jungle accessible by boat, featuring a thrilling canopy walkway.",
    "emoji": "🌳"
   },
   {
    "name": "Jame' Asr Hassanil Bolkiah",
    "blurb": "Brunei's largest mosque, boasting 29 golden domes and exquisite mosaics.",
    "emoji": "✨"
   }
  ],
  "tips": {
   "food": "Try Ambuyat, the national dish made from sago palm starch.",
   "culture": "Brunei is dry; alcohol is not sold. Observe strict local laws.",
   "transport": "Water taxis are essential for exploring the river and water villages.",
   "safety": "Brunei is one of the safest countries in Southeast Asia."
  }
 },
 "BO": {
  "code": "BO",
  "region": "americas",
  "capital": "Sucre (constitutional), La Paz (admin)",
  "intro": "From the surreal Uyuni salt flats to the dizzying heights of La Paz, Bolivia offers raw, breathtaking Andean beauty.",
  "bestSeason": "May–Oct",
  "currency": "Boliviano (BOB)",
  "language": "Spanish, Quechua, Aymara",
  "timezone": "UTC-4",
  "plug": "Type A/C · 220V",
  "emergency": "110 police · 118 ambulance",
  "cost": {
   "budget": 35,
   "standard": 75,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Salar de Uyuni",
    "blurb": "The world's largest salt flat, creating a stunning infinite mirror effect.",
    "emoji": "🧂"
   },
   {
    "name": "Mi Teleférico",
    "blurb": "The world's highest cable car system offering spectacular views of La Paz.",
    "emoji": "🚠"
   },
   {
    "name": "Lake Titicaca",
    "blurb": "High-altitude blue lake featuring the sacred Isla del Sol.",
    "emoji": "🛶"
   },
   {
    "name": "Tiwanaku",
    "blurb": "Ancient archaeological site of a pre-Columbian civilization near Lake Titicaca.",
    "emoji": "🗿"
   }
  ],
  "tips": {
   "food": "Eat Salteñas in the morning; they are delicious, juicy meat pastries.",
   "culture": "Chew coca leaves or drink mate de coca to help with altitude.",
   "transport": "Buses are cheap but journeys are long; flights save significant time.",
   "safety": "Watch out for petty theft in crowded markets and bus stations."
  }
 },
 "BR": {
  "code": "BR",
  "region": "americas",
  "capital": "Brasília",
  "intro": "A colossal land of samba, Amazonian biodiversity, and iconic beaches, pulsing with incomparable energy and tropical heat.",
  "bestSeason": "Dec–Mar",
  "currency": "Brazilian Real (BRL)",
  "language": "Portuguese",
  "timezone": "UTC-2 to -5",
  "plug": "Type N · 127V/220V",
  "emergency": "190 police · 193 fire · 192 ambulance",
  "cost": {
   "budget": 50,
   "standard": 130,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Christ the Redeemer",
    "blurb": "Colossal Art Deco statue overlooking Rio de Janeiro from Corcovado mountain.",
    "emoji": "🏷️"
   },
   {
    "name": "Iguazu Falls",
    "blurb": "Massive system of 275 waterfalls bordering Argentina, surrounded by rainforest.",
    "emoji": "🌊"
   },
   {
    "name": "Amazon Rainforest",
    "blurb": "Enter the world's largest jungle from Manaus for wildlife and river cruises.",
    "emoji": "🐒"
   },
   {
    "name": "Pelourinho",
    "blurb": "The colorful, historic heart of Salvador, famous for Afro-Brazilian culture.",
    "emoji": "🏠"
   }
  ],
  "tips": {
   "food": "Don't miss a traditional Churrascaria for an endless meat feast.",
   "culture": "Brazilians are expressive and physical; personal space is smaller than elsewhere.",
   "transport": "Domestic flights are best for distance; use Uber in major cities.",
   "safety": "Avoid wearing flashy jewelry and keep your phone out of sight."
  }
 },
 "BS": {
  "code": "BS",
  "region": "americas",
  "capital": "Nassau",
  "intro": "An archipelago of 700 islands offering turquoise waters, world-class diving, and a relaxed, rhythmic island lifestyle.",
  "bestSeason": "Dec–Apr",
  "currency": "Bahamian Dollar (BSD)",
  "language": "English",
  "timezone": "UTC-5",
  "plug": "Type A/B · 120V",
  "emergency": "911 or 919",
  "cost": {
   "budget": 130,
   "standard": 300,
   "luxury": 700
  },
  "attractions": [
   {
    "name": "Exuma Cays",
    "blurb": "Famous for the swimming pigs and impossibly clear sapphire waters.",
    "emoji": "🐷"
   },
   {
    "name": "Atlantis Paradise Island",
    "blurb": "Massive resort featuring a huge waterpark and open-air marine habitat.",
    "emoji": "🏰"
   },
   {
    "name": "Blue Hole National Park",
    "blurb": "Andros island gem featuring deep, mysterious underwater limestone sinkholes.",
    "emoji": "🕳️"
   },
   {
    "name": "Queen's Staircase",
    "blurb": "Solid limestone staircase hand-carved by slaves to honor Queen Victoria.",
    "emoji": "🪜"
   }
  ],
  "tips": {
   "food": "Conch salad is the essential Bahamian snack you must try.",
   "culture": "Junkanoo is a vibrant street parade held on Boxing Day/New Year's.",
   "transport": "Use 'jitneys' (buses) in Nassau for an affordable local transit experience.",
   "safety": "Be cautious in 'Over-the-Hill' areas in Nassau after dark."
  }
 },
 "BT": {
  "code": "BT",
  "region": "asia",
  "capital": "Thimphu",
  "intro": "The Himalayan Kingdom of Bhutan offers a mystical journey through ancient monasteries and pristine landscapes where Gross National Happiness prevails.",
  "bestSeason": "Mar–May & Sep–Nov",
  "currency": "Bhutanese Ngultrum (BTN)",
  "language": "Dzongkha",
  "timezone": "UTC+6",
  "plug": "Type D/G · 230V",
  "emergency": "113 police · 112 ambulance",
  "cost": {
   "budget": 200,
   "standard": 250,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Tiger’s Nest",
    "blurb": "Iconic monastery perched precariously on a cliffside above Paro Valley.",
    "emoji": "🧗"
   },
   {
    "name": "Punakha Dzong",
    "blurb": "Architectural masterpiece situated at the confluence of two glacial rivers.",
    "emoji": "🏰"
   },
   {
    "name": "Dochula Pass",
    "blurb": "Mountain pass featuring 108 memorial stupas and panoramic Himalayan views.",
    "emoji": "🏔️"
   },
   {
    "name": "Buddha Dordenma",
    "blurb": "A massive golden Buddha statue overlooking the capital city of Thimphu.",
    "emoji": "🧘"
   }
  ],
  "tips": {
   "food": "Ema Datshi, a spicy chili and cheese stew, is the national dish.",
   "culture": "Dress conservatively and remove shoes when entering temples or administrative buildings.",
   "transport": "Travel is generally managed via pre-booked guided tours with private drivers.",
   "safety": "Bhutan is incredibly safe, but be cautious of high altitude sickness."
  }
 },
 "BW": {
  "code": "BW",
  "region": "africa",
  "capital": "Gaborone",
  "intro": "A premier safari destination where the Kalahari Desert meets the lush, wildlife-rich waterways of the Okavango Delta.",
  "bestSeason": "May–Sep",
  "currency": "Botswana Pula (BWP)",
  "language": "English, Setswana",
  "timezone": "UTC+2",
  "plug": "Type G/M · 230V",
  "emergency": "999 police · 997 ambulance",
  "cost": {
   "budget": 80,
   "standard": 250,
   "luxury": 800
  },
  "attractions": [
   {
    "name": "Okavango Delta",
    "blurb": "Navigate a vast inland delta by traditional mokoro canoe through reeds.",
    "emoji": "🛶"
   },
   {
    "name": "Chobe National Park",
    "blurb": "Home to one of the largest concentrations of elephants in Africa.",
    "emoji": "🐘"
   },
   {
    "name": "Makgadikgadi Pans",
    "blurb": "Surreal white salt flats that transform during the annual zebra migration.",
    "emoji": "🦓"
   },
   {
    "name": "Tsodilo Hills",
    "blurb": "UNESCO site featuring thousands of ancient San rock art paintings.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Try Seswaa, a traditional slow-cooked pounded meat served with maize meal.",
   "culture": "Respect elders and use both hands when giving or receiving gifts.",
   "transport": "Small bush planes are the primary way to reach remote luxury camps.",
   "safety": "Keep a safe distance from wild animals and follow guide instructions strictly."
  }
 },
 "BY": {
  "code": "BY",
  "region": "europe",
  "capital": "Minsk",
  "intro": "A land of dense primeval forests, Soviet-era architecture, and grand fortresses waiting to be discovered by intrepid travelers.",
  "bestSeason": "May–Sep",
  "currency": "Belarusian Ruble (BYN)",
  "language": "Belarusian, Russian",
  "timezone": "UTC+3",
  "plug": "Type C/F · 220V",
  "emergency": "102 police · 103 ambulance",
  "cost": {
   "budget": 45,
   "standard": 90,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Mir Castle",
    "blurb": "A stunning 16th-century complex blending Gothic, Renaissance, and Baroque styles.",
    "emoji": "🏯"
   },
   {
    "name": "Belovezhskaya Pushcha",
    "blurb": "Ancient woodland and home to the rare European bison.",
    "emoji": "🦬"
   },
   {
    "name": "Brest Fortress",
    "blurb": "Monumental Soviet memorial commemorating the defense during World War II.",
    "emoji": "🎖️"
   },
   {
    "name": "Nesvizh Radziwill",
    "blurb": "Grand palace and park complex reflecting the power of nobility.",
    "emoji": "🌳"
   }
  ],
  "tips": {
   "food": "Dranniki, savory potato pancakes, are a staple and must-try dish.",
   "culture": "Public displays of affection are generally discouraged in traditional areas.",
   "transport": "The clean, efficient Minsk Metro is perfect for city exploration.",
   "safety": "Avoid political demonstrations and carry your passport at all times."
  }
 },
 "BZ": {
  "code": "BZ",
  "region": "americas",
  "capital": "Belmopan",
  "intro": "Belize blends Caribbean vibes with Central American jungles, featuring the Northern Hemisphere's largest barrier reef and ancient Mayan ruins.",
  "bestSeason": "Nov–Apr",
  "currency": "Belize Dollar (BZD)",
  "language": "English, Spanish, Kriol",
  "timezone": "UTC-6",
  "plug": "Type A/B/G · 110V/220V",
  "emergency": "911 police · 90 ambulance",
  "cost": {
   "budget": 70,
   "standard": 160,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Great Blue Hole",
    "blurb": "Massive underwater sinkhole offshore, famous for world-class scuba diving.",
    "emoji": "🕳️"
   },
   {
    "name": "Caracol",
    "blurb": "Enormous Mayan archaeological site hidden deep within the Chiquibul Forest.",
    "emoji": "🗿"
   },
   {
    "name": "Ambergris Caye",
    "blurb": "The largest island, serving as a hub for water sports.",
    "emoji": "🏝️"
   },
   {
    "name": "Cockscomb Basin",
    "blurb": "World's only jaguar preserve offering hiking trails and waterfall swims.",
    "emoji": "🐆"
   }
  ],
  "tips": {
   "food": "Rice and beans with stewed chicken is the everyday comfort food.",
   "culture": "Relax and adopt the 'go slow' attitude of the islands.",
   "transport": "Golf carts are the primary mode of transport on the cayes.",
   "safety": "Be cautious in Belize City at night; stay in tourist areas."
  }
 },
 "CA": {
  "code": "CA",
  "region": "americas",
  "capital": "Ottawa",
  "intro": "From the rugged Rockies to vibrant cosmopolitan hubs, Canada spans a continent with breathtaking natural wonders and friendly charm.",
  "bestSeason": "Jun–Aug & Dec–Mar",
  "currency": "Canadian Dollar (CAD)",
  "language": "English, French",
  "timezone": "UTC-3.5 to -8",
  "plug": "Type A/B · 120V",
  "emergency": "911 police/fire/ambulance",
  "cost": {
   "budget": 100,
   "standard": 220,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Banff National Park",
    "blurb": "Turquoise lakes and towering peaks in the heart of the Rockies.",
    "emoji": "🏔️"
   },
   {
    "name": "Niagara Falls",
    "blurb": "Thunderous waterfalls straddling the border with breathtaking power.",
    "emoji": "🌊"
   },
   {
    "name": "Old Quebec",
    "blurb": "Historic walled city with European charm and cobblestone streets.",
    "emoji": "🥐"
   },
   {
    "name": "CN Tower",
    "blurb": "Sky-scraping landmark in Toronto offering panoramic views of Lake Ontario.",
    "emoji": "🗼"
   }
  ],
  "tips": {
   "food": "Don't leave without trying Poutine—chips, cheese curds, and hot gravy.",
   "culture": "Tipping 15–20% in restaurants and bars is standard etiquette.",
   "transport": "A rental car is essential for exploring the vast national parks.",
   "safety": "Be 'bear aware' when hiking and store food in lockers."
  }
 },
 "CD": {
  "code": "CD",
  "region": "africa",
  "capital": "Kinshasa",
  "intro": "The Democratic Republic of the Congo is a wild frontier of immense biodiversity, featuring active volcanoes and rare gorillas.",
  "bestSeason": "May–Sep",
  "currency": "Congolese Franc (CDF)",
  "language": "French, Lingala, Swahili",
  "timezone": "UTC+1 to +2",
  "plug": "Type C/D/E · 220V",
  "emergency": "112 general",
  "cost": {
   "budget": 60,
   "standard": 150,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Virunga National Park",
    "blurb": "Africa's oldest park where you can track endangered mountain gorillas.",
    "emoji": "🦍"
   },
   {
    "name": "Mount Nyiragongo",
    "blurb": "Active volcano featuring the world's largest persistent lava lake.",
    "emoji": "🌋"
   },
   {
    "name": "Lola ya Bonobo",
    "blurb": "The world's only sanctuary for orphaned and rescued bonobos.",
    "emoji": "🐒"
   },
   {
    "name": "Garamba Park",
    "blurb": "Savannah and forest landscapes home to elephants and giraffes.",
    "emoji": "🦒"
   }
  ],
  "tips": {
   "food": "Moambe Chicken, cooked in palm nut paste, is a national favorite.",
   "culture": "Photography requires caution; always ask permission before taking pictures.",
   "transport": "Infrastructure is limited; use reputable domestic airlines for long distances.",
   "safety": "Check current travel advisories due to regional instability and conflict."
  }
 },
 "CF": {
  "code": "CF",
  "region": "africa",
  "capital": "Bangui",
  "intro": "Off the beaten path, the Central African Republic protects some of the continent's most pristine and remote rainforest ecosystems.",
  "bestSeason": "Nov–Mar",
  "currency": "CFA Franc (XAF)",
  "language": "French, Sango",
  "timezone": "UTC+1",
  "plug": "Type C/E · 220V",
  "emergency": "117 police · 1212 ambulance",
  "cost": {
   "budget": 50,
   "standard": 130,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Dzanga-Sangha",
    "blurb": "Dense rainforest park famous for forest elephant and gorilla sightings.",
    "emoji": "🌿"
   },
   {
    "name": "Boali Falls",
    "blurb": "Massive waterfalls located just a short distance from the capital.",
    "emoji": "💦"
   },
   {
    "name": "Manovo-Gounda",
    "blurb": "UNESCO-listed national park featuring diverse flora and savanna fauna.",
    "emoji": "🦓"
   },
   {
    "name": "Bangui Market",
    "blurb": "Vibrant local market for experiencing the pulse of the city.",
    "emoji": "🥭"
   }
  ],
  "tips": {
   "food": "Cassava is the dietary staple, often served as 'gozo'.",
   "culture": "Respectful greetings are important; take time to exchange pleasantries.",
   "transport": "Road conditions are very poor; 4WD vehicles are mandatory for travel.",
   "safety": "Serious security risks persist; professional security and guides are vital."
  }
 },
 "CG": {
  "code": "CG",
  "region": "africa",
  "capital": "Brazzaville",
  "intro": "The Republic of the Congo offers accessible tropical adventures, stylish cities, and the lush Congo River banks.",
  "bestSeason": "Jun–Sep",
  "currency": "CFA Franc (XAF)",
  "language": "French, Lingala",
  "timezone": "UTC+1",
  "plug": "Type C/E · 230V",
  "emergency": "117 police · 118 fire",
  "cost": {
   "budget": 70,
   "standard": 160,
   "luxury": 380
  },
  "attractions": [
   {
    "name": "Odzala-Kokoua",
    "blurb": "Remote park known for lowland gorillas and unique forest clearings.",
    "emoji": "🐾"
   },
   {
    "name": "Basilique St. Anne",
    "blurb": "Striking green-roofed basilica situated in the heart of Brazzaville.",
    "emoji": "⛪"
   },
   {
    "name": "Lesio Louna",
    "blurb": "A gorilla sanctuary dedicated to reintroducing orphans into the wild.",
    "emoji": "🌳"
   },
   {
    "name": "Diosso Gorges",
    "blurb": "Beautiful red rock formations carved by wind and sea erosion.",
    "emoji": "🏜️"
   }
  ],
  "tips": {
   "food": "Saka-Saka, made from cassava leaves, is a popular and nutritious dish.",
   "culture": "Observe the 'Sapeurs', local men known for their extraordinary high-fashion style.",
   "transport": "Taxis are the best way to move around Brazzaville and Pointe-Noire.",
   "safety": "Keep valuables hidden and avoid walking alone after dark."
  }
 },
 "CH": {
  "code": "CH",
  "region": "europe",
  "capital": "Bern",
  "intro": "Switzerland is a precision-engineered paradise of emerald lakes, soaring Alps, and charming alpine villages.",
  "bestSeason": "Jun–Sep & Dec–Mar",
  "currency": "Swiss Franc (CHF)",
  "language": "German, French, Italian",
  "timezone": "UTC+1",
  "plug": "Type J · 230V",
  "emergency": "117 police · 144 ambulance",
  "cost": {
   "budget": 120,
   "standard": 280,
   "luxury": 650
  },
  "attractions": [
   {
    "name": "Matterhorn",
    "blurb": "The iconic jagged peak overlooking the car-free village of Zermatt.",
    "emoji": "🏔️"
   },
   {
    "name": "Lake Lucerne",
    "blurb": "Stunning lake surrounded by mountains, perfect for historic steamboat cruises.",
    "emoji": "🚢"
   },
   {
    "name": "Jungfraujoch",
    "blurb": "The 'Top of Europe' accessible by a scenic cogwheel train.",
    "emoji": "🚆"
   },
   {
    "name": "Chateau de Chillon",
    "blurb": "Medieval island castle located on the shores of Lake Geneva.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Indulge in authentic cheese fondue or raclette in mountain taverns.",
   "culture": "Punctuality is highly valued; trains and meetings always start on time.",
   "transport": "Invest in a Swiss Travel Pass for seamless bus and train journeys.",
   "safety": "Water from public fountains is clean and safe to drink."
  }
 },
 "CI": {
  "code": "CI",
  "region": "africa",
  "capital": "Yamoussoukro",
  "intro": "Côte d'Ivoire features golden beaches, French-colonial history, and the world's largest basilica amidst cacao plantations.",
  "bestSeason": "Nov–Mar",
  "currency": "CFA Franc (XAF)",
  "language": "French",
  "timezone": "UTC+0",
  "plug": "Type C/E · 230V",
  "emergency": "111 police · 185 ambulance",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Yamoussoukro Basilica",
    "blurb": "The world's largest Christian church, modeled after St. Peter's.",
    "emoji": "⛪"
   },
   {
    "name": "Grand-Bassam",
    "blurb": "UNESCO historic town featuring crumbling colonial architecture and beaches.",
    "emoji": "🏖️"
   },
   {
    "name": "Tai National Park",
    "blurb": "Primal rainforest sanctuary home to pygmy hippos and chimpanzees.",
    "emoji": "🐒"
   },
   {
    "name": "Plateau District",
    "blurb": "Abidjan's modern business hub known as the 'Manhattan of Africa'.",
    "emoji": "🏙️"
   }
  ],
  "tips": {
   "food": "Try Kedjenou, a slow-cooked spicy chicken stew served with Acheke.",
   "culture": "Bargaining is expected in markets but be polite and fair.",
   "transport": "Shared taxis (woro-woro) are the standard for city transport.",
   "safety": "Stick to major roads when traveling between cities during daylight."
  }
 },
 "CL": {
  "code": "CL",
  "region": "americas",
  "capital": "Santiago",
  "intro": "A thin ribbon of a country stretching from the arid Atacama Desert to the icy fjords of Patagonia.",
  "bestSeason": "Oct–Mar",
  "currency": "Chilean Peso (CLP)",
  "language": "Spanish",
  "timezone": "UTC-3 to -5",
  "plug": "Type C/L · 220V",
  "emergency": "133 police · 131 ambulance",
  "cost": {
   "budget": 60,
   "standard": 140,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Torres del Paine",
    "blurb": "World-famous national park ideal for trekking among granite towers.",
    "emoji": "🏔️"
   },
   {
    "name": "Atacama Desert",
    "blurb": "The driest place on Earth, legendary for stargazing and geysers.",
    "emoji": "🌵"
   },
   {
    "name": "Easter Island",
    "blurb": "Remote island known for its mysterious and massive Moai statues.",
    "emoji": "🗿"
   },
   {
    "name": "Valparaíso",
    "blurb": "Bohemian port city known for colorful houses and steep funiculars.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Don't miss the Pastel de Choclo, a savory corn pie.",
   "culture": "Chileans take their time; dinner usually starts late around 9 PM.",
   "transport": "Domestic flights are the best way to bridge the massive distances.",
   "safety": "Be aware of pickpockets in crowded areas of Santiago and Valparaíso."
  }
 },
 "CM": {
  "code": "CM",
  "region": "africa",
  "capital": "Yaoundé",
  "intro": "Known as 'Africa in miniature,' Cameroon boasts diverse landscapes ranging from volcanic mountains to palm-lined coastlines.",
  "bestSeason": "Nov–Feb",
  "currency": "CFA Franc (XAF)",
  "language": "French, English",
  "timezone": "UTC+1",
  "plug": "Type C/E · 220V",
  "emergency": "117 police · 112 ambulance",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Mount Cameroon",
    "blurb": "An active volcano and West Africa's highest peak for hikers.",
    "emoji": "🌋"
   },
   {
    "name": "Waza National Park",
    "blurb": "Wildlife reserve famous for lions, giraffes, and large elephant herds.",
    "emoji": "🦁"
   },
   {
    "name": "Kribi Beaches",
    "blurb": "Pristine white sands where waterfalls plunge directly into the sea.",
    "emoji": "🏖️"
   },
   {
    "name": "Foumban",
    "blurb": "Center of Bamum culture featuring a grand palace and artisanal crafts.",
    "emoji": "🎭"
   }
  ],
  "tips": {
   "food": "Ndole, a bitter leaf and nut stew, is the national culinary pride.",
   "culture": "Always seek permission before photographing people or government buildings.",
   "transport": "Night buses are available, but daytime travel is much safer.",
   "safety": "Avoid the Far North and Northwest/Southwest regions due to security concerns."
  }
 },
 "CN": {
  "code": "CN",
  "region": "asia",
  "capital": "Beijing",
  "intro": "A vast tapestry of ancient dynastic history, hyper-modern megacities, and diverse landscapes stretching from the Himalayas to the Pacific.",
  "bestSeason": "Apr–May & Sep–Oct",
  "currency": "Renminbi (CNY)",
  "language": "Mandarin",
  "timezone": "UTC+8",
  "plug": "Type A/C/I · 220V",
  "emergency": "110 police · 120 ambulance",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Great Wall of China",
    "blurb": "Ancient fortifications winding across rugged mountain ridges near Beijing.",
    "emoji": "🧱"
   },
   {
    "name": "The Bund",
    "blurb": "Historic colonial waterfront facing Shanghai's futuristic skyline.",
    "emoji": "🏙️"
   },
   {
    "name": "Terracotta Army",
    "blurb": "Thousands of life-sized clay soldiers guarding an emperor's tomb.",
    "emoji": "🛡️"
   },
   {
    "name": "Zhangjiajie",
    "blurb": "Pillar-like sandstone peaks that inspired the world of Avatar.",
    "emoji": "⛰️"
   }
  ],
  "tips": {
   "food": "Download AliPay or WeChat Pay for seamless payments at restaurants.",
   "culture": "Avoid leaving chopsticks sticking vertically in a bowl of rice.",
   "transport": "The high-speed rail network is efficient and connects all major cities.",
   "safety": "Monitor air quality indexes in large industrial or northern cities."
  }
 },
 "CO": {
  "code": "CO",
  "region": "americas",
  "capital": "Bogotá",
  "intro": "Experience the vibrant rhythm of salsa, high-altitude coffee plantations, and the colorful colonial streets of the Caribbean coast.",
  "bestSeason": "Dec–Mar",
  "currency": "Colombian Peso (COP)",
  "language": "Spanish",
  "timezone": "UTC-5",
  "plug": "Type A/B · 110V",
  "emergency": "123 emergency",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Cartagena Old Town",
    "blurb": "Walled colonial city with bougainvillea-draped balconies and cobblestone streets.",
    "emoji": "🏰"
   },
   {
    "name": "Cocora Valley",
    "blurb": "Home to the world's tallest palm trees in lush mountains.",
    "emoji": "🌴"
   },
   {
    "name": "Tayrona Park",
    "blurb": "Dense jungle meeting pristine Caribbean beaches and turquoise water.",
    "emoji": "🏖️"
   },
   {
    "name": "Medellín Comuna 13",
    "blurb": "Former hillside slum transformed into a hub of street art.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Try Bandeja Paisa, a hearty platter representing the national cuisine.",
   "culture": "Don't mention the dark history unless a local brings it up.",
   "transport": "Internal flights are often cheaper and safer than long-distance buses.",
   "safety": "Keep your phone out of sight on busy city streets."
  }
 },
 "CR": {
  "code": "CR",
  "region": "americas",
  "capital": "San José",
  "intro": "A sustainable paradise of cloud forests, active volcanoes, and incredible biodiversity where the 'Pura Vida' lifestyle reigns supreme.",
  "bestSeason": "Dec–Apr",
  "currency": "Costa Rican Colón (CRC)",
  "language": "Spanish",
  "timezone": "UTC-6",
  "plug": "Type A/B · 120V",
  "emergency": "911 emergency",
  "cost": {
   "budget": 55,
   "standard": 130,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Arenal Volcano",
    "blurb": "Perfectly conical volcano surrounded by natural thermal hot springs.",
    "emoji": "🌋"
   },
   {
    "name": "Monteverde",
    "blurb": "Mystical cloud forest famed for zip-lining and rare bird sightings.",
    "emoji": "☁️"
   },
   {
    "name": "Manuel Antonio",
    "blurb": "Scenic national park where monkeys play on white sand beaches.",
    "emoji": "🐒"
   },
   {
    "name": "Tortuguero",
    "blurb": "Network of jungle canals serving as vital sea turtle nesting sites.",
    "emoji": "🐢"
   }
  ],
  "tips": {
   "food": "Gallo Pinto is the essential breakfast of rice and beans.",
   "culture": "Respect nature; it is the country's most protected and valued resource.",
   "transport": "Renting a 4x4 is highly recommended for reaching remote parks.",
   "safety": "Watch out for strong riptides at many Pacific coast beaches."
  }
 },
 "CU": {
  "code": "CU",
  "region": "americas",
  "capital": "Havana",
  "intro": "A nostalgic time capsule defined by vintage cars, crumbling Spanish architecture, and the soulful sounds of Son and Mambo.",
  "bestSeason": "Dec–Mar",
  "currency": "Cuban Peso (CUP)",
  "language": "Spanish",
  "timezone": "UTC-5",
  "plug": "Type A/B/C/L · 110/220V",
  "emergency": "106 police · 105 fire",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Old Havana",
    "blurb": "UNESCO-listed core filled with Baroque cathedrals and classic car taxis.",
    "emoji": "🇨🇺"
   },
   {
    "name": "Viñales Valley",
    "blurb": "Lush tobacco fields set against dramatic limestone karst mogotes.",
    "emoji": "🚬"
   },
   {
    "name": "Varadero",
    "blurb": "Twenty kilometers of pristine, powder-soft Caribbean sand and resorts.",
    "emoji": "🌊"
   },
   {
    "name": "Trinidad",
    "blurb": "Exquisitely preserved colonial town with colorful houses and cobblestones.",
    "emoji": "🏘️"
   }
  ],
  "tips": {
   "food": "Bring snacks and medicine, as shortages are common in local shops.",
   "culture": "Stay in 'Casas Particulares' for a more authentic local connection.",
   "transport": "Classic American cars function both as taxis and private tours.",
   "safety": "Internet access is limited; download maps and translation offline."
  }
 },
 "CV": {
  "code": "CV",
  "region": "africa",
  "capital": "Praia",
  "intro": "Ten volcanic islands in the Atlantic offering a unique blend of African rhythm, Portuguese history, and dramatic volcanic scenery.",
  "bestSeason": "Nov–Jun",
  "currency": "Cape Verdean Escudo (CVE)",
  "language": "Portuguese, Crioulo",
  "timezone": "UTC-1",
  "plug": "Type C/F · 230V",
  "emergency": "132 police · 130 fire",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 240
  },
  "attractions": [
   {
    "name": "Pico do Fogo",
    "blurb": "Active volcano and the highest peak in the archipelago.",
    "emoji": "🌋"
   },
   {
    "name": "Santa Maria",
    "blurb": "Vibrant beach town on Sal Island famous for windsurfing.",
    "emoji": "🏄"
   },
   {
    "name": "Mindelo",
    "blurb": "The cultural capital of São Vicente, home of Morna music.",
    "emoji": "🎸"
   },
   {
    "name": "Paul Valley",
    "blurb": "Lush, terraced volcanic valley perfect for island hiking trips.",
    "emoji": "🥾"
   }
  ],
  "tips": {
   "food": "Cachupa is the slow-cooked national stew of corn and beans.",
   "culture": "The concept of 'Morabeza' represents Cabo Verdean hospitality and kindness.",
   "transport": "Inter-island ferries can be unreliable; domestic flights are faster.",
   "safety": "Be cautious of strong currents when swimming in open ocean."
  }
 },
 "CY": {
  "code": "CY",
  "region": "europe",
  "capital": "Nicosia",
  "intro": "The sunshine-filled birthplace of Aphrodite where blue-flag beaches meet ancient ruins and a divided, fascinating capital city.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Greek, Turkish",
  "timezone": "UTC+2",
  "plug": "Type G · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 70,
   "standard": 150,
   "luxury": 320
  },
  "attractions": [
   {
    "name": "Paphos Archeological Park",
    "blurb": "Exceptional Roman mosaics and ruins near the sea.",
    "emoji": "🏛️"
   },
   {
    "name": "Fig Tree Bay",
    "blurb": "Consistently ranked among Europe's best beaches for its clarity.",
    "emoji": "🏖️"
   },
   {
    "name": "Troodos Mountains",
    "blurb": "Pinewood slopes featuring painted Byzantine churches and vineyards.",
    "emoji": "🍷"
   },
   {
    "name": "Kourion",
    "blurb": "Spectacular ancient amphitheater perched high on a coastal cliff.",
    "emoji": "🎭"
   }
  ],
  "tips": {
   "food": "Try a traditional Meze to sample 20+ local dishes.",
   "culture": "Don't forget that Nicosia is the world's last divided capital.",
   "transport": "Renting a car is essential as public transport is limited.",
   "safety": "Standard sun protection is vital during the extreme summer heat."
  }
 },
 "CZ": {
  "code": "CZ",
  "region": "europe",
  "capital": "Prague",
  "intro": "A fairytale central European heartland boasting gothic spires, hearty cuisine, and the world's most famous brewery traditions.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Czech Koruna (CZK)",
  "language": "Czech",
  "timezone": "UTC+1",
  "plug": "Type E · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Charles Bridge",
    "blurb": "Iconic 14th-century stone bridge lined with statues of saints.",
    "emoji": "🌉"
   },
   {
    "name": "Cesky Krumlov",
    "blurb": "Picture-perfect medieval town looped by the Vltava River.",
    "emoji": "🏰"
   },
   {
    "name": "Sedlec Ossuary",
    "blurb": "Small chapel artistically decorated with thousands of human bones.",
    "emoji": "💀"
   },
   {
    "name": "Prague Castle",
    "blurb": "The largest ancient castle complex in the entire world.",
    "emoji": "👑"
   }
  ],
  "tips": {
   "food": "Beer is often cheaper than water; Pilsner Urquell is iconic.",
   "culture": "Always validate your ticket before boarding trams or the metro.",
   "transport": "Prague is very walkable, but use the excellent tram system.",
   "safety": "Watch for pickpockets in crowded spots like the Old Town."
  }
 },
 "DE": {
  "code": "DE",
  "region": "europe",
  "capital": "Berlin",
  "intro": "A powerhouse of culture and industry offering everything from buzzing techno clubs to romantic Rhine Valley castles.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "German",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "110 police · 112 fire",
  "cost": {
   "budget": 80,
   "standard": 170,
   "luxury": 380
  },
  "attractions": [
   {
    "name": "Neuschwanstein",
    "blurb": "The real-life inspiration for Disney's Sleeping Beauty castle.",
    "emoji": "🏰"
   },
   {
    "name": "Brandenburg Gate",
    "blurb": "Berlin's grand neoclassical monument symbolizing German unity.",
    "emoji": "🏛️"
   },
   {
    "name": "The Black Forest",
    "blurb": "Dense evergreen forests, waterfalls, and traditional cuckoo clock villages.",
    "emoji": "🌲"
   },
   {
    "name": "Marienplatz",
    "blurb": "Munich's heart featuring the famous Glockenspiel and beer halls.",
    "emoji": "🍺"
   }
  ],
  "tips": {
   "food": "Cash is still king in many smaller bakeries and cafes.",
   "culture": "Don't cross the street on red; locals take laws seriously.",
   "transport": "The Bahn (train) is excellent but book early for savings.",
   "safety": "Germany is very safe, including for solo female travelers."
  }
 },
 "DJ": {
  "code": "DJ",
  "region": "africa",
  "capital": "Djibouti",
  "intro": "A raw, otherworldly landscape of salt lakes, volcanic plains, and whale shark nurseries at the horn of Africa.",
  "bestSeason": "Nov–Mar",
  "currency": "Djiboutian Franc (DJF)",
  "language": "French, Arabic",
  "timezone": "UTC+3",
  "plug": "Type C/E · 220V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 70,
   "standard": 160,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Lake Assal",
    "blurb": "A saline lake crater 150m below sea level; Africa's lowest.",
    "emoji": "🧂"
   },
   {
    "name": "Lake Abbé",
    "blurb": "Steam-hissing limestone chimneys on a lunar-like desert plain.",
    "emoji": "🏜️"
   },
   {
    "name": "Moucha Island",
    "blurb": "Coral reefs and calm waters perfect for diving and snorkeling.",
    "emoji": "🏝️"
   },
   {
    "name": "Day Forest",
    "blurb": "Ancient juniper forest offering a cool escape from desert heat.",
    "emoji": "🌲"
   }
  ],
  "tips": {
   "food": "Sample Yemenite-style fish, a popular spicy local specialty.",
   "culture": "Islam is the main religion; dress modestly outside beach areas.",
   "transport": "4x4 vehicles are mandatory for visiting the salt lakes.",
   "safety": "Extreme heat in summer can be dangerous; stay hydrated."
  }
 },
 "DK": {
  "code": "DK",
  "region": "europe",
  "capital": "Copenhagen",
  "intro": "The home of 'Hygge', minimalist design, and bicycle-filled streets across a network of flat, windy islands.",
  "bestSeason": "Jun–Aug",
  "currency": "Danish Krone (DKK)",
  "language": "Danish",
  "timezone": "UTC+1",
  "plug": "Type C/F/E/K · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 100,
   "standard": 230,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Nyhavn",
    "blurb": "Iconic 17th-century waterfront with brightly colored gabled houses.",
    "emoji": "⛵"
   },
   {
    "name": "Tivoli Gardens",
    "blurb": "Historic amusement park with fairy lights and wooden coasters.",
    "emoji": "🎡"
   },
   {
    "name": "The Little Mermaid",
    "blurb": "Famous bronze statue inspired by Hans Christian Andersen's tale.",
    "emoji": "🧜‍♀️"
   },
   {
    "name": "Kronborg Castle",
    "blurb": "Elsinore castle, the legendary setting for Shakespeare's Hamlet.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Try a Smørrebrød, the open-faced sandwich found everywhere.",
   "culture": "Rent a bike; it is the most authentic way to explore.",
   "transport": "The metro runs 24/7 and is incredibly efficient.",
   "safety": "Scandinavia is very safe, but keep belongings close in Tivoli."
  }
 },
 "DM": {
  "code": "DM",
  "region": "americas",
  "capital": "Roseau",
  "intro": "The 'Nature Island' of the Caribbean, covered in lush rainforests, steaming hot springs, and spectacular volcanic peaks.",
  "bestSeason": "Nov–May",
  "currency": "East Caribbean Dollar (XCD)",
  "language": "English, French Patois",
  "timezone": "UTC-4",
  "plug": "Type G · 230V",
  "emergency": "999 emergency",
  "cost": {
   "budget": 60,
   "standard": 140,
   "luxury": 320
  },
  "attractions": [
   {
    "name": "Boiling Lake",
    "blurb": "The world's second-largest flooded fumarole, reachable by challenging hike.",
    "emoji": "♨️"
   },
   {
    "name": "Champagne Reef",
    "blurb": "Underwater geothermal vents creating bubbles like a glass of champagne.",
    "emoji": "🥂"
   },
   {
    "name": "Trafalgar Falls",
    "blurb": "Twin waterfalls ('Father' and 'Mother') cascading into natural pools.",
    "emoji": "🌊"
   },
   {
    "name": "Morne Trois Pitons",
    "blurb": "UNESCO-protected park full of orchid-rich forests and volcanoes.",
    "emoji": "⛰️"
   }
  ],
  "tips": {
   "food": "Try Callaloo soup, a creamy green dish with local herbs.",
   "culture": "Don't rush; time moves slowly here (island time).",
   "transport": "Driving is on the left; roads are very steep and winding.",
   "safety": "Wear sturdy boots for hiking; trails can be very muddy."
  }
 },
 "DO": {
  "code": "DO",
  "region": "americas",
  "capital": "Santo Domingo",
  "intro": "A Caribbean jewel where turquoise waters meet colonial history and the vibrant energy of Merengue and Bachata.",
  "bestSeason": "Dec–Apr",
  "currency": "Dominican Peso (DOP)",
  "language": "Spanish",
  "timezone": "UTC-4",
  "plug": "Type A/B · 110V",
  "emergency": "911 emergency",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Zona Colonial",
    "blurb": "The oldest permanent European settlement in the New World.",
    "emoji": "⛪"
   },
   {
    "name": "Punta Cana",
    "blurb": "Renowned for its vast stretches of white sand and resorts.",
    "emoji": "🏝️"
   },
   {
    "name": "Pico Duarte",
    "blurb": "The Caribbean's highest peak, offering a true mountain adventure.",
    "emoji": "🥾"
   },
   {
    "name": "Bahía de las Águilas",
    "blurb": "Stunning, remote beach located within the Jaragua National Park.",
    "emoji": "⛵"
   }
  ],
  "tips": {
   "food": "La Bandera (meat, rice, beans) is the staple lunch meal.",
   "culture": "Baseball is the national passion; catch a game if possible.",
   "transport": "Use 'Motoconchos' (motorcycle taxis) with caution and negotiated prices.",
   "safety": "Drink only bottled water and avoid tap water entirely."
  }
 },
 "DZ": {
  "code": "DZ",
  "region": "africa",
  "capital": "Algiers",
  "intro": "A vast North African frontier where Roman ruins overlook the Mediterranean and golden Sahara dunes stretch toward the horizon.",
  "bestSeason": "Oct–Apr",
  "currency": "Algerian Dinar (DZD)",
  "language": "Arabic, Berber, French",
  "timezone": "UTC+1",
  "plug": "Type C/E · 230V",
  "emergency": "17 police · 14 fire",
  "cost": {
   "budget": 40,
   "standard": 85,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Djémila",
    "blurb": "Remarkably preserved Roman ruins nestled in a beautiful mountain setting.",
    "emoji": "🏛️"
   },
   {
    "name": "Casbah of Algiers",
    "blurb": "A labyrinthine UNESCO-listed old city with stunning traditional architecture.",
    "emoji": "🏘️"
   },
   {
    "name": "Tassili n'Ajjer",
    "blurb": "Prehistoric rock art and alien-looking sandstone landscapes in the deep Sahara.",
    "emoji": "🏜️"
   },
   {
    "name": "Notre Dame d'Afrique",
    "blurb": "Neo-Byzantine basilica offering sweeping views over the Bay of Algiers.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Try hearty couscous and spicy merguez sausages from local market stalls.",
   "culture": "Dress modestly and always ask permission before photographing local people.",
   "transport": "Internal flights are the most efficient way to cross the vast desert.",
   "safety": "Stick to established tourist routes and hire a guide for desert excursions."
  }
 },
 "EC": {
  "code": "EC",
  "region": "americas",
  "capital": "Quito",
  "intro": "Experience four worlds in one nation, from Andean peaks and Amazon jungles to the unique wildlife of the Galapagos Islands.",
  "bestSeason": "Jun–Sep",
  "currency": "US Dollar (USD)",
  "language": "Spanish, Kichwa",
  "timezone": "UTC-5 & -6",
  "plug": "Type A/B · 120V",
  "emergency": "911",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Galapagos Islands",
    "blurb": "A living laboratory of evolution with fearless wildlife and pristine beaches.",
    "emoji": "🐢"
   },
   {
    "name": "Cotopaxi",
    "blurb": "One of the world's highest active volcanoes with a perfect snow-capped cone.",
    "emoji": "🌋"
   },
   {
    "name": "Quito Old Town",
    "blurb": "The best-preserved colonial center in South America with ornate gold churches.",
    "emoji": "⛪"
   },
   {
    "name": "Otavalo Market",
    "blurb": "South America’s most famous indigenous market for vibrant textiles and crafts.",
    "emoji": "🧣"
   }
  ],
  "tips": {
   "food": "Sample 'locro de papa' potato soup and fresh exotic fruits daily.",
   "culture": "Learn basic Spanish phrases to better connect with friendly local residents.",
   "transport": "Buses are cheap and frequent, but keep a close eye on bags.",
   "safety": "Take precautions against altitude sickness when visiting the Andean highlands."
  }
 },
 "EE": {
  "code": "EE",
  "region": "europe",
  "capital": "Tallinn",
  "intro": "A digital-forward nation blending fairy-tale medieval architecture with wild forests and a stunning Baltic coastline.",
  "bestSeason": "May–Aug",
  "currency": "Euro (EUR)",
  "language": "Estonian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 60,
   "standard": 130,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Tallinn Old Town",
    "blurb": "Magical medieval streets protected by stone walls and turreted towers.",
    "emoji": "🏰"
   },
   {
    "name": "Lahemaa National Park",
    "blurb": "Expansive coastal forests, bogs, and historic manor houses by the sea.",
    "emoji": "🌲"
   },
   {
    "name": "Saaremaa",
    "blurb": "A peaceful island famed for windmills, juniper beer, and Bishop's Castle.",
    "emoji": "🌬️"
   },
   {
    "name": "Kumu Museum",
    "blurb": "Cutting-edge modern art museum showcasing Estonia’s complex and creative history.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Try black rye bread and local marzipan for a traditional treat.",
   "culture": "Estonians value privacy; respect personal space and avoid overly loud behavior.",
   "transport": "Public transport in Tallinn is excellent and very easy to navigate.",
   "safety": "Wear reflectors on your clothing when walking outside in the dark."
  }
 },
 "EG": {
  "code": "EG",
  "region": "middle-east",
  "capital": "Cairo",
  "intro": "The cradle of civilization, where mighty pyramids and the timeless Nile River tell the story of ancient pharaohs.",
  "bestSeason": "Oct–Apr",
  "currency": "Egyptian Pound (EGP)",
  "language": "Arabic",
  "timezone": "UTC+3",
  "plug": "Type C/F · 220V",
  "emergency": "122 police · 123 amb",
  "cost": {
   "budget": 35,
   "standard": 90,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Pyramids of Giza",
    "blurb": "The last surviving Wonder of the Ancient World standing tall today.",
    "emoji": "📐"
   },
   {
    "name": "Valley of the Kings",
    "blurb": "Legendary burial ground of powerful pharaohs including the famous Tutankhamun.",
    "emoji": "⚰️"
   },
   {
    "name": "Karnak Temple",
    "blurb": "A massive, awe-inspiring complex of sanctuaries, kiosks, pylons, and obelisks.",
    "emoji": "🏛️"
   },
   {
    "name": "The Red Sea",
    "blurb": "World-class diving in crystal waters filled with vibrant coral and fish.",
    "emoji": "🤿"
   }
  ],
  "tips": {
   "food": "Don't miss 'koshary', a delicious mix of lentils, rice, and pasta.",
   "culture": "Haggling is an essential part of the Egyptian market shopping experience.",
   "transport": "Use ride-sharing apps like Uber in Cairo for hassle-free, fixed-price travel.",
   "safety": "Always drink bottled water and carry small change for tips (baksheesh)."
  }
 },
 "ER": {
  "code": "ER",
  "region": "africa",
  "capital": "Asmara",
  "intro": "A hidden gem featuring Art Deco treasures, high-altitude landscapes, and a unique blend of African and Italian influences.",
  "bestSeason": "Oct–Mar",
  "currency": "Eritrean Nakfa (ERN)",
  "language": "Tigrinya, Arabic, English",
  "timezone": "UTC+3",
  "plug": "Type C/L · 230V",
  "emergency": "113 police · 114 fire",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Modernist Asmara",
    "blurb": "Exceptional Italian modernist architecture throughout this UNESCO-listed capital city.",
    "emoji": "🏢"
   },
   {
    "name": "Dahlak Archipelago",
    "blurb": "Untouched islands in the Red Sea offering spectacular, pristine diving spots.",
    "emoji": "🏝️"
   },
   {
    "name": "Massawa",
    "blurb": "An evocative port town featuring Ottoman, Egyptian, and Italian architectural styles.",
    "emoji": "⚓"
   },
   {
    "name": "Qohaito",
    "blurb": "Ancient ruins and rock art perched on a high mountain plateau.",
    "emoji": "⛰️"
   }
  ],
  "tips": {
   "food": "Savor a traditional coffee ceremony and spicy injera with stewed lentils.",
   "culture": "Wait for the host to invite you before starting your meal.",
   "transport": "Travel permits are required for tourists leaving the capital city limits.",
   "safety": "Internet access is limited; plan your routes and downloads well ahead."
  }
 },
 "ES": {
  "code": "ES",
  "region": "europe",
  "capital": "Madrid",
  "intro": "A passionate land of diverse regions, world-class art, architectural wonders, and a sun-soaked Mediterranean lifestyle.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Spanish, Catalan, Basque",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 80,
   "standard": 180,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "La Sagrada Família",
    "blurb": "Gaudí’s unfinished masterpiece with soaring spires and kaleidoscopic stained glass.",
    "emoji": "🏗️"
   },
   {
    "name": "The Alhambra",
    "blurb": "A stunning Moorish palace and fortress complex in beautiful Granada.",
    "emoji": "🕌"
   },
   {
    "name": "Prado Museum",
    "blurb": "Madrid’s temple of art housing incredible works by Velázquez and Goya.",
    "emoji": "🖼️"
   },
   {
    "name": "Seville Cathedral",
    "blurb": "The world's largest Gothic cathedral and home to Christopher Columbus' tomb.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Dinner happens late; many restaurants don't open until 8:00 or 9:00 PM.",
   "culture": "Don't expect much activity during 'siesta' hours in smaller towns.",
   "transport": "The AVE high-speed train is the best way to travel between cities.",
   "safety": "Be extremely vigilant against pickpockets in busy tourist areas and subways."
  }
 },
 "ET": {
  "code": "ET",
  "region": "africa",
  "capital": "Addis Ababa",
  "intro": "An ancient empire of dramatic highlands, rock-hewn churches, and the proud source of the world's coffee culture.",
  "bestSeason": "Oct–Mar",
  "currency": "Ethiopian Birr (ETB)",
  "language": "Amharic",
  "timezone": "UTC+3",
  "plug": "Type C/F · 220V",
  "emergency": "991 police · 939 amb",
  "cost": {
   "budget": 30,
   "standard": 75,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Lalibela",
    "blurb": "Thirteen remarkable medieval monolithic churches carved entirely out of solid rock.",
    "emoji": "⛪"
   },
   {
    "name": "Simien Mountains",
    "blurb": "Breathtaking peaks home to Gelada monkeys and rare Walia ibex.",
    "emoji": "⛰️"
   },
   {
    "name": "Omo Valley",
    "blurb": "Remote region famous for diverse tribes and ancient cultural traditions.",
    "emoji": "🌍"
   },
   {
    "name": "Danakil Depression",
    "blurb": "Alien landscape of bubbling lava lakes and neon yellow sulfur springs.",
    "emoji": "🧪"
   }
  ],
  "tips": {
   "food": "Eating is communal; use 'injera' bread to scoop up various 'wat' stews.",
   "culture": "Ethiopia follows its own 13-month calendar and a unique 12-hour clock.",
   "transport": "Domestic flights are highly recommended for covering the rugged, vast distances.",
   "safety": "Check current regional travel advisories before visiting peripheral border areas."
  }
 },
 "FI": {
  "code": "FI",
  "region": "europe",
  "capital": "Helsinki",
  "intro": "The world's happiest country, where modern design meets vast archipelagos and the magical Northern Lights.",
  "bestSeason": "Jun–Aug & Dec–Mar",
  "currency": "Euro (EUR)",
  "language": "Finnish, Swedish",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 100,
   "standard": 220,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Suomenlinna",
    "blurb": "A historic sea fortress spread across six picturesque Baltic islands.",
    "emoji": "🏰"
   },
   {
    "name": "Santa Claus Village",
    "blurb": "The official home of Santa, located on the Arctic Circle.",
    "emoji": "🎅"
   },
   {
    "name": "Lake Saimaa",
    "blurb": "A massive lake system dotted with thousands of islands and seals.",
    "emoji": "🛶"
   },
   {
    "name": "Helsinki Cathedral",
    "blurb": "An iconic white neoclassical cathedral overlooking the bustling Senate Square.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Sample reindeer meat, forest berries, and salty licorice called 'salmiakki'.",
   "culture": "Sauna is a core part of life; expect to be invited.",
   "transport": "Trains are punctual and clean, with great connections to the north.",
   "safety": "In winter, be careful of black ice and dress in layers."
  }
 },
 "FJ": {
  "code": "FJ",
  "region": "oceania",
  "capital": "Suva",
  "intro": "A tropical paradise of 333 islands known for vibrant coral reefs, soft white sands, and incomparable hospitality.",
  "bestSeason": "May–Oct",
  "currency": "Fijian Dollar (FJD)",
  "language": "English, Fijian, Hindi",
  "timezone": "UTC+12",
  "plug": "Type I · 240V",
  "emergency": "911 police · 917 amb",
  "cost": {
   "budget": 70,
   "standard": 180,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Mamanuca Islands",
    "blurb": "Stunning chain of islands with turquoise waters and world-class surfing.",
    "emoji": "🏄"
   },
   {
    "name": "Garden of the Sleeping Giant",
    "blurb": "Lush botanical garden featuring thousands of orchids and peaceful pathways.",
    "emoji": "🌺"
   },
   {
    "name": "Bouma National Heritage Park",
    "blurb": "Tropical rainforest with spectacular waterfalls and coastal forest walks.",
    "emoji": "🏞️"
   },
   {
    "name": "Beqa Lagoon",
    "blurb": "Famous for spectacular shark diving and legendary fire-walking ceremonies.",
    "emoji": "🦈"
   }
  ],
  "tips": {
   "food": "Try 'lovo', a delicious feast cooked in an underground earth oven.",
   "culture": "Don't wear hats in villages; it's considered an insult to the chief.",
   "transport": "Small boats and seaplanes are the primary ways to hop between islands.",
   "safety": "Remove your shoes before entering someone's home and dress respectfully."
  }
 },
 "FM": {
  "code": "FM",
  "region": "oceania",
  "capital": "Palikir",
  "intro": "An emerald archipelago in the North Pacific offering incredible diving and mysterious ancient stone cities.",
  "bestSeason": "Dec–Apr",
  "currency": "US Dollar (USD)",
  "language": "English",
  "timezone": "UTC+10 & +11",
  "plug": "Type A/B · 120V",
  "emergency": "911",
  "cost": {
   "budget": 80,
   "standard": 170,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Nan Madol",
    "blurb": "The 'Venice of the Pacific', an ancient ruined city built on reefs.",
    "emoji": "🗿"
   },
   {
    "name": "Chuuk Lagoon",
    "blurb": "The world's best wreck diving site featuring a sunken WWII fleet.",
    "emoji": "🚢"
   },
   {
    "name": "Yap Stone Money",
    "blurb": "Unique giant limestone discs used as traditional currency on Yap island.",
    "emoji": "🪙"
   },
   {
    "name": "Kepirohi Waterfall",
    "blurb": "A stunning 20-meter high basalt waterfall on the island of Pohnpei.",
    "emoji": "🌊"
   }
  ],
  "tips": {
   "food": "Seafood is king; fresh tuna and reef fish are staples here.",
   "culture": "Respect local 'taboo' signs which often mark sacred or private areas.",
   "transport": "Domestic travel relies on United Airlines' 'Island Hopper' or local charters.",
   "safety": "Always use a specialized local guide for visiting remote archaeological sites."
  }
 },
 "FR": {
  "code": "FR",
  "region": "europe",
  "capital": "Paris",
  "intro": "The world’s most visited country, celebrated for its iconic landmarks, exquisite cuisine, and timeless art.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "French",
  "timezone": "UTC+1",
  "plug": "Type C/E · 230V",
  "emergency": "112",
  "cost": {
   "budget": 90,
   "standard": 220,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Eiffel Tower",
    "blurb": "The iron symbol of Paris offering incomparable views over the city.",
    "emoji": "🗼"
   },
   {
    "name": "Mont-Saint-Michel",
    "blurb": "A magical abbey perched on a rocky island in Normandy.",
    "emoji": "🏰"
   },
   {
    "name": "Louvre Museum",
    "blurb": "The world's largest art museum, home to the enigmatic Mona Lisa.",
    "emoji": "🖼️"
   },
   {
    "name": "Palace of Versailles",
    "blurb": "The opulent former residence of the French kings and queens.",
    "emoji": "👑"
   }
  ],
  "tips": {
   "food": "Always say 'Bonjour' when entering a shop or ordering food.",
   "culture": "Dining is an art form; don't rush through your restaurant meals.",
   "transport": "The TGV train network is incredibly fast for traveling between regions.",
   "safety": "Ignore strangers offering 'friendship bracelets' or petition signatures in Paris."
  }
 },
 "GA": {
  "code": "GA",
  "region": "africa",
  "capital": "Libreville",
  "intro": "Africa's 'Last Eden', where pristine rainforests meet the Atlantic and elephants roam along the beach.",
  "bestSeason": "Jun–Aug & Dec–Jan",
  "currency": "CFA Franc (XAF)",
  "language": "French, Fang",
  "timezone": "UTC+1",
  "plug": "Type C · 220V",
  "emergency": "1722 police · 18 fire",
  "cost": {
   "budget": 60,
   "standard": 150,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Loango National Park",
    "blurb": "Famous 'surfing hippos' and elephants strolling on beautiful wild beaches.",
    "emoji": "🐘"
   },
   {
    "name": "Lopé National Park",
    "blurb": "UNESCO site where rainforest meets savanna, home to thousands of mandrills.",
    "emoji": "🐒"
   },
   {
    "name": "Ivindo National Park",
    "blurb": "Includes the spectacular Kongou Falls, often called the 'Niagara of Africa'.",
    "emoji": "🌊"
   },
   {
    "name": "Pointe-Denis",
    "blurb": "Relaxing beach destination across the estuary from the busy capital Libreville.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Try 'Poulet Nyembwé', chicken cooked in a rich palm nut sauce.",
   "culture": "Respectful behavior is expected; avoid criticizing the government in public.",
   "transport": "The Jungle Express train is a scenic but slow way to travel.",
   "safety": "Pack high-quality insect repellent and take malaria prophylaxis as prescribed."
  }
 },
 "GB": {
  "code": "GB",
  "region": "europe",
  "capital": "London",
  "intro": "A tapestry of royal history, rolling green hills, and vibrant cities blending ancient heritage with cutting-edge modern culture.",
  "bestSeason": "May–Sep",
  "currency": "British Pound (GBP)",
  "language": "English",
  "timezone": "UTC+0",
  "plug": "Type G · 230V",
  "emergency": "999",
  "cost": {
   "budget": 80,
   "standard": 200,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Tower of London",
    "blurb": "Historic castle housing the Crown Jewels and centuries of royal drama.",
    "emoji": "🏰"
   },
   {
    "name": "Stonehenge",
    "blurb": "Mysterious prehistoric stone circle standing tall on the Salisbury Plain.",
    "emoji": "🗿"
   },
   {
    "name": "Edinburgh Castle",
    "blurb": "Iconic fortress dominating the skyline of Scotland's hilly capital city.",
    "emoji": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
   },
   {
    "name": "The Cotswolds",
    "blurb": "Charming limestone villages and golden meadows in the English countryside.",
    "emoji": "🏡"
   }
  ],
  "tips": {
   "food": "Try traditional afternoon tea for a quintessential British culinary experience.",
   "culture": "Always join the back of a queue and avoid cutting in line.",
   "transport": "Invest in an Oyster card or use contactless for London travel.",
   "safety": "Keep an eye on bags in crowded tourist areas like Piccadilly Circus."
  }
 },
 "GD": {
  "code": "GD",
  "region": "americas",
  "capital": "St. George's",
  "intro": "Known as the Spice Isle, this lush volcanic paradise offers fragrant air, turquoise waters, and hidden rainforest waterfalls.",
  "bestSeason": "Jan–May",
  "currency": "East Caribbean Dollar (XCD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type G · 230V",
  "emergency": "911",
  "cost": {
   "budget": 90,
   "standard": 220,
   "luxury": 550
  },
  "attractions": [
   {
    "name": "Grand Anse Beach",
    "blurb": "World-famous two-mile stretch of pristine white sand and calm waters.",
    "emoji": "🏖️"
   },
   {
    "name": "Underwater Sculpture Park",
    "blurb": "Unique ecological art installation for divers and snorkelers beneath the waves.",
    "emoji": "🤿"
   },
   {
    "name": "Grand Etang National Park",
    "blurb": "Rainforest hiking trails surrounding a stunning volcanic crater lake.",
    "emoji": "🐒"
   },
   {
    "name": "Belmont Estate",
    "blurb": "Historical plantation offering farm-to-table dining and artisan chocolate tours.",
    "emoji": "🍫"
   }
  ],
  "tips": {
   "food": "Don't leave without tasting Oil Down, the flavorful national dish.",
   "culture": "Dress modestly when away from the beach to respect local customs.",
   "transport": "Local minibuses are cheap, frequent, and a great way to explore.",
   "safety": "Be cautious of strong currents on the Atlantic side of the island."
  }
 },
 "GE": {
  "code": "GE",
  "region": "asia",
  "capital": "Tbilisi",
  "intro": "At the crossroads of Europe and Asia, Georgia dazzles with Caucasus peaks, ancient monasteries, and legendary amber wine.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Georgian Lari (GEL)",
  "language": "Georgian",
  "timezone": "UTC+4",
  "plug": "Type C/F · 220V",
  "emergency": "112",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Vardzia",
    "blurb": "Spectacular cave monastery complex dating back to the 12th century.",
    "emoji": "⛰️"
   },
   {
    "name": "Gergety Trinity Church",
    "blurb": "Iconic church perched against the backdrop of Mount Kazbek.",
    "emoji": "⛪"
   },
   {
    "name": "Narikala Fortress",
    "blurb": "Ancient citadel offering panoramic views over the colorful city of Tbilisi.",
    "emoji": "🚠"
   },
   {
    "name": "Uplistsikhe",
    "blurb": "Fascinating rock-hewn town representing one of Georgia's oldest urban settlements.",
    "emoji": "🏺"
   }
  ],
  "tips": {
   "food": "Always share food; Georgians believe guests are gifts from God.",
   "culture": "Men should wear trousers and women scarves when entering churches.",
   "transport": "Marshrutkas (minibuses) connect most towns affordably and efficiently.",
   "safety": "Stick to marked trails when hiking in the high Caucasus mountains."
  }
 },
 "GH": {
  "code": "GH",
  "region": "africa",
  "capital": "Accra",
  "intro": "A beacon of stability in West Africa, Ghana offers rich Ashanti heritage, sobering history, and golden Atlantic beaches.",
  "bestSeason": "Nov–Feb",
  "currency": "Ghanaian Cedi (GHS)",
  "language": "English",
  "timezone": "UTC+0",
  "plug": "Type D/G · 230V",
  "emergency": "191 police · 192 fire/amb",
  "cost": {
   "budget": 40,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Cape Coast Castle",
    "blurb": "Poignant historical site detailing the heartbreaking history of the slave trade.",
    "emoji": "🏰"
   },
   {
    "name": "Kakum National Park",
    "blurb": "Suspended canopy walkway high above a lush tropical rainforest floor.",
    "emoji": "🌳"
   },
   {
    "name": "Mole National Park",
    "blurb": "Ghana's largest wildlife refuge where elephants roam the savannah plains.",
    "emoji": "🐘"
   },
   {
    "name": "Makola Market",
    "blurb": "Hectic, colorful epicenter of trade in the heart of Accra.",
    "emoji": "🧺"
   }
  ],
  "tips": {
   "food": "Jollof rice is a local staple; prepare for spicy heat levels.",
   "culture": "Always use the right hand for eating and giving gifts.",
   "transport": "Tro-tros are the local shared vans; they are cheap but crowded.",
   "safety": "Carry a mosquito repellent to prevent malaria during your stay."
  }
 },
 "GM": {
  "code": "GM",
  "region": "africa",
  "capital": "Banjul",
  "intro": "Enveloping the Gambia River, this narrow country is a birdwatcher's paradise with sun-soaked beaches and friendly riverside towns.",
  "bestSeason": "Nov–Feb",
  "currency": "Gambian Dalasi (GMD)",
  "language": "English",
  "timezone": "UTC+0",
  "plug": "Type G · 230V",
  "emergency": "117 police · 118 fire · 119 amb",
  "cost": {
   "budget": 35,
   "standard": 85,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Kachikally Crocodile Pool",
    "blurb": "Sacred site where visitors can touch tame, well-fed crocodiles safely.",
    "emoji": "🐊"
   },
   {
    "name": "Kunta Kinteh Island",
    "blurb": "UNESCO site reflecting the harrowing history of the Atlantic slave trade.",
    "emoji": "⛓️"
   },
   {
    "name": "Bijilo Forest Park",
    "blurb": "Nature reserve known for its inquisitive monkeys and varied birdlife.",
    "emoji": "🐒"
   },
   {
    "name": "Albert Market",
    "blurb": "Vibrant Banjul market filled with textiles, crafts, and tropical fruits.",
    "emoji": "🛍️"
   }
  ],
  "tips": {
   "food": "Domoda, a peanut-based stew, is a must-try local specialty.",
   "culture": "Greeting people is important; always ask 'How are you?' first.",
   "transport": "Bush taxis are the standard way to travel between towns.",
   "safety": "Be wary of 'Bumsters'—friendly locals seeking money for unsolicited help."
  }
 },
 "GN": {
  "code": "GN",
  "region": "africa",
  "capital": "Conakry",
  "intro": "From the Fouta Djallon highlands to the wild coast, Guinea offers raw adventure for the intrepid traveler seeking nature.",
  "bestSeason": "Nov–Mar",
  "currency": "Guinean Franc (GNF)",
  "language": "French",
  "timezone": "UTC+0",
  "plug": "Type C/F/K · 220V",
  "emergency": "117 police · 442 fire",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Fouta Djallon",
    "blurb": "Stunning plateau featuring dramatic waterfalls, cliffs, and excellent hiking trails.",
    "emoji": "🥾"
   },
   {
    "name": "Îles de Los",
    "blurb": "Relaxing archipelago near Conakry known for forested interiors and beaches.",
    "emoji": "🏝️"
   },
   {
    "name": "Grande Mosquée",
    "blurb": "One of the largest mosques in sub-Saharan Africa, located in Conakry.",
    "emoji": "🕌"
   },
   {
    "name": "Mount Nimba",
    "blurb": "UNESCO-listed peak home to rare flora and diverse wildlife species.",
    "emoji": "⛰️"
   }
  ],
  "tips": {
   "food": "Expect meals based on rice, cassava, and delicious peanut sauces.",
   "culture": "Always seek permission before taking photos of people or buildings.",
   "transport": "Expect long, dusty travel times; 4x4 vehicles are highly recommended.",
   "safety": "Check current political stability and travel advisories before your trip."
  }
 },
 "GQ": {
  "code": "GQ",
  "region": "africa",
  "capital": "Malabo",
  "intro": "Central Africa’s only Spanish-speaking nation, Equatorial Guinea features pristine rainforests and distinct colonial architecture across island and mainland.",
  "bestSeason": "Dec–Feb",
  "currency": "Central African CFA Franc (XAF)",
  "language": "Spanish, French, Portuguese",
  "timezone": "UTC+1",
  "plug": "Type C/E · 220V",
  "emergency": "114 police · 113 fire",
  "cost": {
   "budget": 100,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Malabo Cathedral",
    "blurb": "Beautiful neo-Gothic church situated in the heart of the capital city.",
    "emoji": "⛪"
   },
   {
    "name": "Monte Alén National Park",
    "blurb": "Teeming rainforest sanctuary home to elusive gorillas and forest elephants.",
    "emoji": "🦍"
   },
   {
    "name": "Arena Blanca",
    "blurb": "Bioko Island's only white sand beach, famous for its seasonal butterflies.",
    "emoji": "🦋"
   },
   {
    "name": "Pico Basile",
    "blurb": "Tallest mountain in the country providing views of nearby Cameroon.",
    "emoji": "🌋"
   }
  ],
  "tips": {
   "food": "Try Succulent grilled fish or chicken with spicy 'pili-pili' sauce.",
   "culture": "Obtaining permits for photography is often required but difficult.",
   "transport": "Taxis are the main way to get around Malabo and Bata.",
   "safety": "Keep your passport and visa handy for frequent police checkpoints."
  }
 },
 "GR": {
  "code": "GR",
  "region": "europe",
  "capital": "Athens",
  "intro": "Where ancient myths come to life amidst sun-drenched islands, azure seas, and the white-washed charm of the Mediterranean.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Greek",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 70,
   "standard": 150,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Acropolis of Athens",
    "blurb": "Universal symbol of the classical spirit and Western ancient civilization.",
    "emoji": "🏛️"
   },
   {
    "name": "Santorini Caldera",
    "blurb": "Dramatic volcanic cliffs topped with famous blue-domed churches and sunsets.",
    "emoji": "🌅"
   },
   {
    "name": "Meteora",
    "blurb": "Otherworldly monasteries perched atop towering natural sandstone rock pillars.",
    "emoji": "⛰️"
   },
   {
    "name": "Delphi",
    "blurb": "Ancient sanctuary dedicated to Apollo, once home to the famous Oracle.",
    "emoji": "🏺"
   }
  ],
  "tips": {
   "food": "Meze is meant for sharing; try small plates of everything local.",
   "culture": "In some villages, a nod upwards means 'no' rather than 'yes'.",
   "transport": "Ferries are the lifeblood of the islands; book early in summer.",
   "safety": "Be careful when walking on slick, ancient marble and cobblestone streets."
  }
 },
 "GT": {
  "code": "GT",
  "region": "americas",
  "capital": "Guatemala City",
  "intro": "A land of eternal spring, where Mayan ruins emerge from jungles and colorful markets thrive under smoke-drifting volcanoes.",
  "bestSeason": "Nov–Apr",
  "currency": "Guatemalan Quetzal (GTQ)",
  "language": "Spanish",
  "timezone": "UTC-6",
  "plug": "Type A/B · 120V",
  "emergency": "110 police · 122/123 fire",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Tikal",
    "blurb": "Massive Mayan city complex hidden deep within the northern rainforest.",
    "emoji": "🛕"
   },
   {
    "name": "Lake Atitlán",
    "blurb": "Spectacular volcanic lake surrounded by indigenous villages and lush peaks.",
    "emoji": "🛶"
   },
   {
    "name": "Antigua",
    "blurb": "UNESCO-listed colonial city featuring cobblestone streets and colorful crumbling ruins.",
    "emoji": "🏘️"
   },
   {
    "name": "Chichicastenango Market",
    "blurb": "One of the largest and most vibrant traditional markets in the Americas.",
    "emoji": "🎭"
   }
  ],
  "tips": {
   "food": "Try Pepián, a rich, spicy meat stew and Guatemala's national dish.",
   "culture": "Respect local Mayan ceremonies; do not approach or photograph altars.",
   "transport": "Chicken buses are iconic but can be very crowded and fast.",
   "safety": "Stick to tourist shuttles for intercity travel rather than public buses."
  }
 },
 "GW": {
  "code": "GW",
  "region": "africa",
  "capital": "Bissau",
  "intro": "Languid rivers and the unspoiled Bijagós islands define this hidden West African gem where matriarchal traditions still flourish.",
  "bestSeason": "Nov–Feb",
  "currency": "West African CFA Franc (XOF)",
  "language": "Portuguese, Crioulo",
  "timezone": "UTC+0",
  "plug": "Type C · 220V",
  "emergency": "117 police · 112 amb",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Orango Island",
    "blurb": "Rare habitat where saltwater hippos can be found bathing in the sea.",
    "emoji": "🦛"
   },
   {
    "name": "Bissau Velho",
    "blurb": "The atmospheric old center of the capital with crumbling Portuguese architecture.",
    "emoji": "🏚️"
   },
   {
    "name": "João Vieira-Poilão",
    "blurb": "Remote island park serving as a crucial nesting site for turtles.",
    "emoji": "🐢"
   },
   {
    "name": "Quinhamel",
    "blurb": "Coastal village known for local crafts and traditional weaving techniques.",
    "emoji": "🧶"
   }
  ],
  "tips": {
   "food": "Fresh cashews and seafood are highlights of the local diet.",
   "culture": "Traditional beliefs are strong; always respect local chiefs when visiting villages.",
   "transport": "Boats to the Bijagós islands are infrequent; plan your schedule carefully.",
   "safety": "Malaria is prevalent; ensure you have appropriate prophylactics and nets."
  }
 },
 "GY": {
  "code": "GY",
  "region": "americas",
  "capital": "Georgetown",
  "intro": "South America’s only English-speaking country offers vast pristine rainforests, thundering waterfalls, and a unique Caribbean-style culture.",
  "bestSeason": "Feb–Apr & Aug–Oct",
  "currency": "Guyanese Dollar (GYD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type A/B/D/G · 120V/240V",
  "emergency": "911 police · 912 fire · 913 amb",
  "cost": {
   "budget": 55,
   "standard": 130,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Kaieteur Falls",
    "blurb": "The world’s largest single-drop waterfall by volume, set in deep jungle.",
    "emoji": "🌊"
   },
   {
    "name": "St. George's Cathedral",
    "blurb": "One of the world’s tallest free-standing wooden buildings in Georgetown.",
    "emoji": "⛪"
   },
   {
    "name": "Rupununi Savannah",
    "blurb": "Vast grasslands home to giant anteaters, jaguars, and caimans.",
    "emoji": "🐆"
   },
   {
    "name": "Iwokrama Forest",
    "blurb": "Pristine rainforest reserve offering canopy walks and world-class nature spotting.",
    "emoji": "🦜"
   }
  ],
  "tips": {
   "food": "Don't miss Pepperpot, an Amerindian-inspired meat stew served with bread.",
   "culture": "Guyanese culture is a unique blend of South American and Caribbean.",
   "transport": "Small planes are necessary to reach the remote interior sites.",
   "safety": "Be cautious in Georgetown after dark; stick to well-lit main areas."
  }
 },
 "HK": {
  "code": "HK",
  "region": "asia",
  "capital": "Hong Kong",
  "intro": "A high-octane metropolis where neon-lit skyscrapers meet traditional temples and green mountain trails meet the South China Sea.",
  "bestSeason": "Oct–Dec",
  "currency": "Hong Kong Dollar (HKD)",
  "language": "Cantonese, English",
  "timezone": "UTC+8",
  "plug": "Type G · 220V",
  "emergency": "999",
  "cost": {
   "budget": 70,
   "standard": 180,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Victoria Peak",
    "blurb": "Stunning overlook providing the most famous panoramic view of the skyline.",
    "emoji": "🏙️"
   },
   {
    "name": "Star Ferry",
    "blurb": "Iconic, affordable boat ride between Hong Kong Island and Kowloon Peninsula.",
    "emoji": "🚢"
   },
   {
    "name": "Tian Tan Buddha",
    "blurb": "Enormous bronze Big Buddha statue situated peacefully on Lantau Island.",
    "emoji": "🏮"
   },
   {
    "name": "Temple Street Night Market",
    "blurb": "Bustling evening bazaar for shopping, fortune tellers, and street food.",
    "emoji": "🍜"
   }
  ],
  "tips": {
   "food": "Dim Sum is an essential experience; try a traditional tea house.",
   "culture": "Be polite on public transport; eating and drinking is strictly prohibited.",
   "transport": "The Octopus card works for all transport and most convenience stores.",
   "safety": "Very safe, but stay alert for pickpockets in dense crowds."
  }
 },
 "HN": {
  "code": "HN",
  "region": "americas",
  "capital": "Tegucigalpa",
  "intro": "A Central American gem where Mayan ruins meet turquoise Caribbean waters and lush mountainous coffee plantations.",
  "bestSeason": "Dec–Apr",
  "currency": "Honduran Lempira (HNL)",
  "language": "Spanish",
  "timezone": "UTC-6",
  "plug": "Type A/B · 120V",
  "emergency": "911 emergency",
  "cost": {
   "budget": 40,
   "standard": 85,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Copán Ruinas",
    "blurb": "Detailed Mayan hieroglyphics and impressive stone stelae in a jungle setting.",
    "emoji": "🗿"
   },
   {
    "name": "Roatán",
    "blurb": "World-class diving and snorkeling along the vibrant Mesoamerican Barrier Reef.",
    "emoji": "🏝️"
   },
   {
    "name": "Pico Bonito",
    "blurb": "Biodiverse national park offering rugged hiking trails and rushing waterfalls.",
    "emoji": "🦜"
   },
   {
    "name": "Lago de Yojoa",
    "blurb": "Largest natural lake in Honduras, perfect for birdwatching and craft beer.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Try a Baleada, a thick flour tortilla filled with beans and cheese.",
   "culture": "Respect local modesty and avoid discussing sensitive political history with strangers.",
   "transport": "Use 'directo' buses for longer trips; they are safer and faster.",
   "safety": "Stick to tourist areas and avoid walking alone at night in cities."
  }
 },
 "HR": {
  "code": "HR",
  "region": "europe",
  "capital": "Zagreb",
  "intro": "Where sun-drenched Adriatic coastline meets medieval walled cities and cascading turquoise waterfalls.",
  "bestSeason": "May–Jun & Sep",
  "currency": "Euro (EUR)",
  "language": "Croatian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 70,
   "standard": 150,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Dubrovnik Old Town",
    "blurb": "Walk the iconic limestone walls of the 'Pearl of the Adriatic'.",
    "emoji": "🏰"
   },
   {
    "name": "Plitvice Lakes",
    "blurb": "Sixteen terraced lakes joined by waterfalls and limestone canyons.",
    "emoji": "🌊"
   },
   {
    "name": "Hvar Island",
    "blurb": "Glitzy harbor town known for lavender fields and vibrant nightlife.",
    "emoji": "🛥️"
   },
   {
    "name": "Diocletian's Palace",
    "blurb": "A living Roman ruin forming the historic heart of Split.",
    "emoji": "🏛️"
   }
  ],
  "tips": {
   "food": "Sample 'Peka', a slow-cooked meat and vegetable dish under a bell.",
   "culture": "Coffee drinking is a slow, social ritual that lasts for hours.",
   "transport": "The ferry network is excellent for hopping between the many islands.",
   "safety": "Be cautious of sea urchins when swimming off rocky beaches."
  }
 },
 "HT": {
  "code": "HT",
  "region": "americas",
  "capital": "Port-au-Prince",
  "intro": "A resilient nation boasting vibrant Caribbean art, historic fortresses, and a rich, complex cultural heritage.",
  "bestSeason": "Nov–Mar",
  "currency": "Haitian Gourde (HTG)",
  "language": "Haitian Creole, French",
  "timezone": "UTC-5",
  "plug": "Type A/B · 110V",
  "emergency": "114 police · 116 ambulance",
  "cost": {
   "budget": 45,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Citadelle Laferrière",
    "blurb": "Massive mountaintop fortress and symbol of Haitian liberty and power.",
    "emoji": "🏰"
   },
   {
    "name": "Sans-Souci Palace",
    "blurb": "The ruins of the former royal residence in Milot.",
    "emoji": "🏛️"
   },
   {
    "name": "Bassins Bleu",
    "blurb": "Stunning cobalt blue pools hidden in the lush hills of Jacmel.",
    "emoji": "💧"
   },
   {
    "name": "Labadee",
    "blurb": "Private resort peninsula offering pristine beaches and motorized water sports.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Don't miss 'Griot', delicious fried pork served with spicy pikliz salad.",
   "culture": "Photography of locals should only be done with explicit individual permission.",
   "transport": "Colorful 'tap-taps' are the main form of local shared transportation.",
   "safety": "Check current government travel advisories due to significant security concerns."
  }
 },
 "HU": {
  "code": "HU",
  "region": "europe",
  "capital": "Budapest",
  "intro": "A central European treasure famous for grand architecture, thermal baths, and the winding Danube River.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Hungarian Forint (HUF)",
  "language": "Hungarian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 60,
   "standard": 130,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Parliament Building",
    "blurb": "A massive Gothic Revival masterpiece sitting on the Danube banks.",
    "emoji": "🏛️"
   },
   {
    "name": "Széchenyi Baths",
    "blurb": "Iconic yellow thermal spa offering indoor and outdoor mineral pools.",
    "emoji": "♨️"
   },
   {
    "name": "Fisherman's Bastion",
    "blurb": "Neo-Romanesque terrace providing panoramic views over the city.",
    "emoji": "🏰"
   },
   {
    "name": "Lake Balaton",
    "blurb": "Central Europe's largest lake, perfect for summer swimming and wine.",
    "emoji": "🍷"
   }
  ],
  "tips": {
   "food": "Warm up with a hearty bowl of Gulyás (goulash) spiced with paprika.",
   "culture": "Always clink glasses when toasting, except when drinking beer.",
   "transport": "Budapest is highly walkable; use the historic M1 metro line.",
   "safety": "Check exchange rates carefully to avoid scams at unofficial kiosks."
  }
 },
 "ID": {
  "code": "ID",
  "region": "asia",
  "capital": "Jakarta",
  "intro": "A vast archipelago of thousands of islands offering tropical jungles, volcanic peaks, and ancient temples.",
  "bestSeason": "May–Sep",
  "currency": "Indonesian Rupiah (IDR)",
  "language": "Indonesian",
  "timezone": "UTC+7 to +9",
  "plug": "Type C/F · 230V",
  "emergency": "110 police · 118 ambulance",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Borobudur",
    "blurb": "The world's largest Buddhist temple, especially majestic at sunrise.",
    "emoji": "🛕"
   },
   {
    "name": "Ubud",
    "blurb": "Bali's cultural heart filled with terraced rice paddies and art.",
    "emoji": "🌴"
   },
   {
    "name": "Komodo National Park",
    "blurb": "Home to the world's largest lizards and spectacular pink beaches.",
    "emoji": "🦎"
   },
   {
    "name": "Raja Ampat",
    "blurb": "An underwater paradise with the highest marine biodiversity on Earth.",
    "emoji": "🐠"
   }
  ],
  "tips": {
   "food": "Nasi Goreng is the national staple; try it at street stalls.",
   "culture": "Dress modestly and cover shoulders/knees when visiting any religious site.",
   "transport": "Download Gojek or Grab for cheap and easy motorbike taxis.",
   "safety": "Drink only bottled or filtered water to avoid ‘Bali Belly’."
  }
 },
 "IE": {
  "code": "IE",
  "region": "europe",
  "capital": "Dublin",
  "intro": "The Emerald Isle enchants with rugged Atlantic cliffs, ancient folklore, and exceptionally warm hospitality.",
  "bestSeason": "Jun–Aug",
  "currency": "Euro (EUR)",
  "language": "English, Irish",
  "timezone": "UTC+0",
  "plug": "Type G · 230V",
  "emergency": "112 or 999",
  "cost": {
   "budget": 90,
   "standard": 190,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Cliffs of Moher",
    "blurb": "Dramatic sea cliffs plummeting into the wild Atlantic Ocean.",
    "emoji": "🌊"
   },
   {
    "name": "Trinity College",
    "blurb": "Home to the stunning Long Room library and Book of Kells.",
    "emoji": "📚"
   },
   {
    "name": "Ring of Kerry",
    "blurb": "Scenic circular drive through lush landscapes and coastal villages.",
    "emoji": "🚗"
   },
   {
    "name": "Rock of Cashel",
    "blurb": "A spectacular group of medieval buildings set on limestone outcrops.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Try a full Irish breakfast or fresh seafood chowder.",
   "culture": "Pubs are social hubs for music and talk, not just drinking.",
   "transport": "Renting a car is best for reaching the remote western coast.",
   "safety": "Weather changes rapidly; always carry a waterproof jacket when outdoors."
  }
 },
 "IL": {
  "code": "IL",
  "region": "middle-east",
  "capital": "Jerusalem",
  "intro": "A land of profound history and modern innovation where sacred sites meet vibrant Mediterranean beaches.",
  "bestSeason": "Apr–May & Sep–Oct",
  "currency": "Israeli New Shekel (ILS)",
  "language": "Hebrew, Arabic",
  "timezone": "UTC+2",
  "plug": "Type C/H · 230V",
  "emergency": "100 police · 101 ambulance",
  "cost": {
   "budget": 90,
   "standard": 200,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Old City Jerusalem",
    "blurb": "The spiritual heart of three major religions within ancient walls.",
    "emoji": "🕌"
   },
   {
    "name": "The Dead Sea",
    "blurb": "Floating in mineral-rich waters at the lowest point on Earth.",
    "emoji": "🌊"
   },
   {
    "name": "Masada",
    "blurb": "Historic desert fortress with breathtaking views over the Dead Sea Valley.",
    "emoji": "🏰"
   },
   {
    "name": "Tel Aviv Beaches",
    "blurb": "Sun-soaked Mediterranean sands paired with a non-stop urban lifestyle.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Don't skip the hummus and hot pita from local markets.",
   "culture": "Shabbat (Friday evening to Saturday) sees many businesses and transport close.",
   "transport": "The Rav-Kav card is essential for all bus and train travel.",
   "safety": "Be prepared for thorough security checks at airports and malls."
  }
 },
 "IN": {
  "code": "IN",
  "region": "asia",
  "capital": "New Delhi",
  "intro": "A sensory explosion of vibrant colors, ancient spirituality, and diverse landscapes from Himalayas to tropical shores.",
  "bestSeason": "Oct–Mar",
  "currency": "Indian Rupee (INR)",
  "language": "Hindi, English",
  "timezone": "UTC+5:30",
  "plug": "Type C/D/M · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 30,
   "standard": 75,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Taj Mahal",
    "blurb": "The world's most famous monument to love, crafted in white marble.",
    "emoji": "🕌"
   },
   {
    "name": "Varanasi Ghats",
    "blurb": "Ancient spiritual rituals performed on the banks of the Ganges.",
    "emoji": "🕯️"
   },
   {
    "name": "Kerala Backwaters",
    "blurb": "Peaceful houseboat cruises through palm-fringed canals and lagoons.",
    "emoji": "🌴"
   },
   {
    "name": "Jaipur",
    "blurb": "The 'Pink City' known for grand palaces and intricate forts.",
    "emoji": "🐘"
   }
  ],
  "tips": {
   "food": "Opt for busy stalls with high turnover to ensure food freshness.",
   "culture": "Remove shoes before entering homes and places of worship.",
   "transport": "Trains are the soul of India; book tickets well in advance.",
   "safety": "Be cautious of overly friendly strangers offering unsolicited travel advice."
  }
 },
 "IQ": {
  "code": "IQ",
  "region": "middle-east",
  "capital": "Baghdad",
  "intro": "The cradle of civilization, where the Tigris and Euphrates rivers frame millennia of human history.",
  "bestSeason": "Oct–Nov & Mar–Apr",
  "currency": "Iraqi Dinar (IQD)",
  "language": "Arabic, Kurdish",
  "timezone": "UTC+3",
  "plug": "Type C/G · 230V",
  "emergency": "104 police · 122 ambulance",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Ziggurat of Ur",
    "blurb": "A massive Sumerian stepped pyramid dating back to the Bronze Age.",
    "emoji": "📐"
   },
   {
    "name": "Erbil Citadel",
    "blurb": "Continuously inhabited mountaintop settlement in the heart of Kurdistan.",
    "emoji": "🏰"
   },
   {
    "name": "Ancient Babylon",
    "blurb": "The legendary home of the Hanging Gardens and Ishtar Gate.",
    "emoji": "🦁"
   },
   {
    "name": "Great Mosque of Samarra",
    "blurb": "Unique spiral minaret that is an icon of Islamic architecture.",
    "emoji": "🌀"
   }
  ],
  "tips": {
   "food": "Try 'Masgouf', Iraq's national dish of seasoned, grilled carp.",
   "culture": "Hospitality is paramount; declining tea might be seen as slightly impolite.",
   "transport": "Shared taxis or private drivers are the most reliable way to travel.",
   "safety": "Always consult up-to-date travel advisories and hire local guides."
  }
 },
 "IR": {
  "code": "IR",
  "region": "middle-east",
  "capital": "Tehran",
  "intro": "A land of breathtaking Islamic architecture, ancient Persian ruins, and legendary hospitality.",
  "bestSeason": "Mar–May & Sep–Oct",
  "currency": "Iranian Rial (IRR)",
  "language": "Persian",
  "timezone": "UTC+3:30",
  "plug": "Type C/F · 230V",
  "emergency": "110 police · 115 ambulance",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Persepolis",
    "blurb": "The ceremonial capital of the Achaemenid Empire's stunning stone ruins.",
    "emoji": "🏛️"
   },
   {
    "name": "Naqsh-e Jahan",
    "blurb": "One of the world's largest and most beautiful public squares.",
    "emoji": "🕌"
   },
   {
    "name": "Yazd Old City",
    "blurb": "Ancient mud-brick city famous for wind-catchers and Zoroastrian history.",
    "emoji": "🧱"
   },
   {
    "name": "Golestan Palace",
    "blurb": "Lush gardens and ornate buildings from the Qajar era in Tehran.",
    "emoji": "🌸"
   }
  ],
  "tips": {
   "food": "Dizi is a traditional mutton stew served in stone jars.",
   "culture": "Understand 'Taarof', a system of etiquette involving polite refusals and offers.",
   "transport": "Domestic flights and VIP buses are comfortable and very affordable.",
   "safety": "Foreign credit cards don't work; you must bring sufficient cash (USD/EUR)."
  }
 },
 "IS": {
  "code": "IS",
  "region": "europe",
  "capital": "Reykjavik",
  "intro": "The land of fire and ice offers dramatic volcanic landscapes, massive glaciers, and ethereal northern lights.",
  "bestSeason": "Jun–Aug & Sep–Mar",
  "currency": "Icelandic Króna (ISK)",
  "language": "Icelandic",
  "timezone": "UTC+0",
  "plug": "Type C/F · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 120,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Blue Lagoon",
    "blurb": "Geothermal spa set in a black lava field with milky-blue water.",
    "emoji": "🧖‍♀️"
   },
   {
    "name": "Gulfoss",
    "blurb": "A mighty 'Golden Waterfall' that drops into a deep canyon.",
    "emoji": "💦"
   },
   {
    "name": "Jökulsárlón",
    "blurb": "Glacial lagoon filled with floating icebergs drifting toward the sea.",
    "emoji": "🧊"
   },
   {
    "name": "Skógafoss",
    "blurb": "Magnificent waterfall with a massive spray often creating vivid rainbows.",
    "emoji": "🌈"
   }
  ],
  "tips": {
   "food": "Hot dogs (pylsur) are a popular and relatively cheap local snack.",
   "culture": "Respect the fragile nature; never walk on delicate mossy ground.",
   "transport": "Renting a 4x4 is essential for exploring the rugged Highlands.",
   "safety": "Weather changes instantly; check safetravel.is before any road trip."
  }
 },
 "IT": {
  "code": "IT",
  "region": "europe",
  "capital": "Rome",
  "intro": "An unparalleled open-air museum where ancient history, world-class art, and exquisite cuisine converge.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Italian",
  "timezone": "UTC+1",
  "plug": "Type C/F/L · 230V",
  "emergency": "112 emergency",
  "cost": {
   "budget": 80,
   "standard": 180,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "The Colosseum",
    "blurb": "Ancient Rome's iconic amphitheater and a marvel of engineering.",
    "emoji": "🏟️"
   },
   {
    "name": "Florence Duomo",
    "blurb": "Renaissance masterpiece with Brunelleschi's famous red-tiled brick dome.",
    "emoji": "🎨"
   },
   {
    "name": "Venice Canals",
    "blurb": "Romantic waterways navigated by traditional gondolas between historic palaces.",
    "emoji": "🛶"
   },
   {
    "name": "Amalfi Coast",
    "blurb": "Dramatic vertical cliffs dotted with colorful villages overlooking the sea.",
    "emoji": "🍋"
   }
  ],
  "tips": {
   "food": "Dinner typically starts late; menus change strictly by region.",
   "culture": "Don't order a cappuccino after 11 AM; it's considered purely breakfast.",
   "transport": "High-speed trains (Frecciarossa) are the best way to travel between cities.",
   "safety": "Be mindful of pickpockets in crowded tourist spots and on transit."
  }
 },
 "JM": {
  "code": "JM",
  "region": "americas",
  "capital": "Kingston",
  "intro": "A rhythmic island paradise of reggae beats, jerk-spiced cuisine, and misty Blue Mountains surrounded by crystal-clear Caribbean waters.",
  "bestSeason": "Dec–Apr",
  "currency": "Jamaican Dollar (JMD)",
  "language": "English, Patois",
  "timezone": "UTC-5",
  "plug": "Type A/B · 110V",
  "emergency": "119 police · 110 fire/ambulance",
  "cost": {
   "budget": 70,
   "standard": 180,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Dunn's River Falls",
    "blurb": "Terraced waterfalls cascading directly into the Caribbean Sea for climbing adventures.",
    "emoji": "🌊"
   },
   {
    "name": "Seven Mile Beach",
    "blurb": "Endless white sands and turquoise waters perfect for sunset strolls.",
    "emoji": "🏖️"
   },
   {
    "name": "Blue Mountains",
    "blurb": "Mist-covered peaks famous for world-class coffee and lush hiking trails.",
    "emoji": "⛰️"
   },
   {
    "name": "Bob Marley Museum",
    "blurb": "The former home and recording studio of the legendary reggae icon.",
    "emoji": "🎸"
   }
  ],
  "tips": {
   "food": "Must try jerk chicken and ackee with saltfish, the national dish.",
   "culture": "Respect the local 'ital' lifestyle and embrace the slow island pace.",
   "transport": "Route taxis are cheap but shared; private transfers are safer for tourists.",
   "safety": "Stick to tourist areas in Kingston and avoid walking alone at night."
  }
 },
 "JO": {
  "code": "JO",
  "region": "middle-east",
  "capital": "Amman",
  "intro": "An ancient kingdom where rose-red desert cities meet the buoyant Dead Sea and the hospitable traditions of Bedouin culture.",
  "bestSeason": "Mar–May & Sep–Nov",
  "currency": "Jordanian Dinar (JOD)",
  "language": "Arabic",
  "timezone": "UTC+3",
  "plug": "Type C/D/F/G/J · 230V",
  "emergency": "911",
  "cost": {
   "budget": 60,
   "standard": 140,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Petra",
    "blurb": "The Nabataean city carved into red sandstone cliffs, a world wonder.",
    "emoji": "🏛️"
   },
   {
    "name": "Wadi Rum",
    "blurb": "Mars-like desert landscapes best explored by 4x4 or camel trek.",
    "emoji": "🏜️"
   },
   {
    "name": "Dead Sea",
    "blurb": "Float effortlessly in the lowest, saltiest body of water on Earth.",
    "emoji": "💧"
   },
   {
    "name": "Jerash",
    "blurb": "Incredibly preserved Roman ruins including colonnaded streets and grand theaters.",
    "emoji": "🏺"
   }
  ],
  "tips": {
   "food": "Mansaf is the national dish; eat it with your right hand.",
   "culture": "Dress modestly, especially when visiting religious sites or rural areas.",
   "transport": "JETT buses connect major sites; consider hiring a driver for flexibility.",
   "safety": "Jordan is very safe; follow local advice near the northern border."
  }
 },
 "JP": {
  "code": "JP",
  "region": "asia",
  "capital": "Tokyo",
  "intro": "A seamless blend of neon-lit futurism and serene ancient temples, defined by impeccable hospitality and world-class culinary mastery.",
  "bestSeason": "Mar–May & Oct–Nov",
  "currency": "Japanese Yen (JPY)",
  "language": "Japanese",
  "timezone": "UTC+9",
  "plug": "Type A/B · 100V",
  "emergency": "110 police · 119 fire/ambulance",
  "cost": {
   "budget": 100,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Fushimi Inari Shrine",
    "blurb": "Thousands of vermillion torii gates winding up a sacred mountainside.",
    "emoji": "⛩️"
   },
   {
    "name": "Mount Fuji",
    "blurb": "Japan's iconic snow-capped peak, a pilgrimage site for hikers and artists.",
    "emoji": "🗻"
   },
   {
    "name": "Shibuya Crossing",
    "blurb": "The world's busiest intersection, a pulsating heart of modern Tokyo.",
    "emoji": "🚶"
   },
   {
    "name": "Kinkaku-ji",
    "blurb": "The stunning Golden Pavilion reflected in a tranquil Zen pond.",
    "emoji": "✨"
   }
  ],
  "tips": {
   "food": "Tipping is not practiced; saying 'Gochisosama' shows your appreciation instead.",
   "culture": "Keep noise levels low on public transport and follow etiquette rules.",
   "transport": "The JR Pass is excellent for high-speed Shinkansen travel between cities.",
   "safety": "One of the world's safest countries, even for solo night travelers."
  }
 },
 "KE": {
  "code": "KE",
  "region": "africa",
  "capital": "Nairobi",
  "intro": "The ultimate safari destination where the Great Migration thunders across the savannah beneath the watchful eye of Mount Kenya.",
  "bestSeason": "Jun–Oct & Jan–Feb",
  "currency": "Kenyan Shilling (KES)",
  "language": "Swahili, English",
  "timezone": "UTC+3",
  "plug": "Type G · 240V",
  "emergency": "999 / 112",
  "cost": {
   "budget": 50,
   "standard": 150,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Maasai Mara",
    "blurb": "Premier wildlife reserve hosting lions, cheetahs, and the vast wildebeest migration.",
    "emoji": "🦁"
   },
   {
    "name": "Amboseli National Park",
    "blurb": "Famous for large elephant herds against the backdrop of Kilimanjaro.",
    "emoji": "🐘"
   },
   {
    "name": "Diani Beach",
    "blurb": "Pristine white sands and swaying palms on the Indian Ocean coast.",
    "emoji": "🏝️"
   },
   {
    "name": "Giraffe Centre",
    "blurb": "Conservation center where guests can hand-feed endangered Rothschild giraffes.",
    "emoji": "🦒"
   }
  ],
  "tips": {
   "food": "Ugali and Nyama Choma (roasted meat) are quintessential Kenyan staples.",
   "culture": "Always ask permission before taking photos of local tribespeople.",
   "transport": "Matatus (minibuses) are vibrant but chaotic; use apps like Uber.",
   "safety": "Be cautious in Nairobi; avoid carrying large amounts of cash openly."
  }
 },
 "KG": {
  "code": "KG",
  "region": "asia",
  "capital": "Bishkek",
  "intro": "A rugged Central Asian gem defined by the celestial Tian Shan mountains, nomadic yurt stays, and alpine lakes.",
  "bestSeason": "Jun–Sep",
  "currency": "Kyrgyzstani Som (KGS)",
  "language": "Kyrgyz, Russian",
  "timezone": "UTC+6",
  "plug": "Type C/F · 220V",
  "emergency": "102 police · 103 medical",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Issyk-Kul Lake",
    "blurb": "The world's second-largest alpine lake, surrounded by snow-capped peaks.",
    "emoji": "💧"
   },
   {
    "name": "Ala Archa",
    "blurb": "Spectacular national park featuring glaciers and rugged hiking trails near Bishkek.",
    "emoji": "🏔️"
   },
   {
    "name": "Song-Kul",
    "blurb": "High-altitude lake perfect for experiencing traditional nomadic yurt hospitality.",
    "emoji": "⛺"
   },
   {
    "name": "Burana Tower",
    "blurb": "An ancient Silk Road minaret standing amidst a field of balbals.",
    "emoji": "🗼"
   }
  ],
  "tips": {
   "food": "Try Beshbarmak (meat and noodles) and fresh fermented mare’s milk.",
   "culture": "Hospitality is sacred; expect to be offered tea frequently by locals.",
   "transport": "Marshrutkas (minibuses) connect towns; 4x4s are necessary for mountain passes.",
   "safety": "Mountain weather changes rapidly; always carry gear for cold temperatures."
  }
 },
 "KH": {
  "code": "KH",
  "region": "asia",
  "capital": "Phnom Penh",
  "intro": "Home to the awe-inspiring Angkor Wat, Cambodia enchants with its resilient spirit, jungle-clad ruins, and Mekong River charm.",
  "bestSeason": "Nov–Feb",
  "currency": "Cambodian Riel (KHR) / USD",
  "language": "Khmer",
  "timezone": "UTC+7",
  "plug": "Type A/C/G · 230V",
  "emergency": "117 police · 119 fire · 118 ambulance",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Angkor Wat",
    "blurb": "The massive, iconic temple complex representing the pinnacle of Khmer architecture.",
    "emoji": "🏰"
   },
   {
    "name": "Ta Prohm",
    "blurb": "Atmospheric 'Tomb Raider' temple being reclaimed by massive jungle tree roots.",
    "emoji": "🌳"
   },
   {
    "name": "Koh Rong",
    "blurb": "Paradise island featuring bioluminescent plankton and white sandy beaches.",
    "emoji": "🏖️"
   },
   {
    "name": "Royal Palace",
    "blurb": "A glittering complex of buildings serving as the King's residence.",
    "emoji": "👑"
   }
  ],
  "tips": {
   "food": "Fish Amok, a creamy coconut curry, is the must-try national dish.",
   "culture": "Cover shoulders and knees when visiting temples; it is strictly required.",
   "transport": "Tuk-tuks are the best way to get around; use PassApp/Grab.",
   "safety": "Be mindful of bag snatching in Phnom Penh; keep valuables secure."
  }
 },
 "KI": {
  "code": "KI",
  "region": "oceania",
  "capital": "South Tarawa",
  "intro": "A remote Pacific nation of sprawling coral atolls offering world-class fishing and a front-row seat to climate change impacts.",
  "bestSeason": "May–Oct",
  "currency": "Australian Dollar (AUD)",
  "language": "Gilbertese, English",
  "timezone": "UTC+12, +13, +14",
  "plug": "Type I · 240V",
  "emergency": "999",
  "cost": {
   "budget": 80,
   "standard": 160,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Christmas Island",
    "blurb": "Massive atoll renowned for incredible birdwatching and fly-fishing opportunities.",
    "emoji": "🎣"
   },
   {
    "name": "Tarawa WWII Sites",
    "blurb": "Historical battleground featuring rusting tanks and coastal gun emplacements.",
    "emoji": "🛡️"
   },
   {
    "name": "Phoenix Islands",
    "blurb": "One of the world's largest protected marine wilderness areas.",
    "emoji": "🐠"
   },
   {
    "name": "Abaiang Atoll",
    "blurb": "A serene escape for experiencing traditional Kiribati village life.",
    "emoji": "🚣"
   }
  ],
  "tips": {
   "food": "Diet is centered on seafood, breadfruit, and coconuts; try te bwabwai.",
   "culture": "The 'Maneaba' (meeting house) is the center of social life.",
   "transport": "Flights between islands are infrequent; plan your logistics well in advance.",
   "safety": "Health facilities are limited; ensure you have comprehensive travel insurance."
  }
 },
 "KM": {
  "code": "KM",
  "region": "africa",
  "capital": "Moroni",
  "intro": "The 'Perfume Isles' of the Indian Ocean, blending volcanic landscapes with Arabic heritage and scents of ylang-ylang.",
  "bestSeason": "May–Oct",
  "currency": "Comorian Franc (KMF)",
  "language": "Comorian, Arabic, French",
  "timezone": "UTC+3",
  "plug": "Type C/E · 220V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Mount Karthala",
    "blurb": "An active volcano with one of the world's largest craters.",
    "emoji": "🌋"
   },
   {
    "name": "Chomoni Beach",
    "blurb": "White sand beach contrasted against black volcanic rocks and clear water.",
    "emoji": "📸"
   },
   {
    "name": "Mohéli Marine Park",
    "blurb": "Sanctuary for sea turtles, whales, and the rare Dugong.",
    "emoji": "🐢"
   },
   {
    "name": "Old Friday Mosque",
    "blurb": "Iconic Moroni landmark offering beautiful views of the harbor.",
    "emoji": "🕌"
   }
  ],
  "tips": {
   "food": "Lobster is affordable and delicious; try it with coconut-based sides.",
   "culture": "Local culture is conservative; dress modestly and avoid alcohol in public.",
   "transport": "Share-taxis are common, but inter-island travel relies on small planes/boats.",
   "safety": "Malaria is present; take precautions and use mosquito nets consistently."
  }
 },
 "KN": {
  "code": "KN",
  "region": "americas",
  "capital": "Basseterre",
  "intro": "A dual-island nation where lush rainforests, historic sugar plantations, and dormant volcanoes meet golden Caribbean shores.",
  "bestSeason": "Dec–Apr",
  "currency": "East Caribbean Dollar (XCD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type A/B/G · 230V",
  "emergency": "911",
  "cost": {
   "budget": 90,
   "standard": 220,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Brimstone Hill",
    "blurb": "A massive fortress and UNESCO site known as 'Gibraltar of West Indies'.",
    "emoji": "🏰"
   },
   {
    "name": "Mount Liamuiga",
    "blurb": "A challenging hike through rainforest to a spectacular volcanic crater.",
    "emoji": "🥾"
   },
   {
    "name": "Scenic Railway",
    "blurb": "Historical train tour circling St. Kitts through old sugar estates.",
    "emoji": "🚂"
   },
   {
    "name": "Pinney's Beach",
    "blurb": "Nevis' most famous beach, perfect for relaxation and sunset drinks.",
    "emoji": "🍹"
   }
  ],
  "tips": {
   "food": "Try goat water (a savory stew) and fresh spiny lobster.",
   "culture": "St. Kitts is lively, while Nevis is quieter and slower-paced.",
   "transport": "Ferries run frequently between islands; cars drive on the left.",
   "safety": "Islands are generally safe, but use hotel safes for valuables."
  }
 },
 "KP": {
  "code": "KP",
  "region": "asia",
  "capital": "Pyongyang",
  "intro": "The world's most reclusive nation, accessible only through strictly controlled state-sanctioned tours under constant supervision.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "North Korean Won (KPW)",
  "language": "Korean",
  "timezone": "UTC+9",
  "plug": "Type A/C · 220V",
  "emergency": "119",
  "cost": {
   "budget": 150,
   "standard": 250,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Mansudae Grand Monument",
    "blurb": "Colossal bronze statues of Kim Il Sung and Kim Jong Il.",
    "emoji": "🗿"
   },
   {
    "name": "The DMZ",
    "blurb": "The heavily fortified border zone separating North and South Korea.",
    "emoji": "🪖"
   },
   {
    "name": "Pyongyang Metro",
    "blurb": "Deepest subway systems in the world with ornate socialist architecture.",
    "emoji": "🚇"
   },
   {
    "name": "Juche Tower",
    "blurb": "A massive stone monument offering panoramic views of the capital.",
    "emoji": "🏙️"
   }
  ],
  "tips": {
   "food": "Cold noodles (Naengmyeon) are a famous local delicacy in Pyongyang.",
   "culture": "Strictly follow your guides; avoid criticizing the leadership or political system.",
   "transport": "Independent travel is illegal; you must stay with your official group.",
   "safety": "Photography is restricted; always ask your guide before taking pictures."
  }
 },
 "KR": {
  "code": "KR",
  "region": "asia",
  "capital": "Seoul",
  "intro": "A high-tech powerhouse where K-pop energy meets peaceful Buddhist temples and incredibly flavorful street food culture.",
  "bestSeason": "Apr–Jun & Sep–Nov",
  "currency": "South Korean Won (KRW)",
  "language": "Korean",
  "timezone": "UTC+9",
  "plug": "Type C/F · 220V",
  "emergency": "112 police · 119 fire/ambulance",
  "cost": {
   "budget": 70,
   "standard": 160,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Gyeongbokgung Palace",
    "blurb": "The grandest of Seoul's Five Grand Palaces, built in 1395.",
    "emoji": "🏯"
   },
   {
    "name": "Bukchon Hanok Village",
    "blurb": "Traditional village with centuries-old houses preserved in modern Seoul.",
    "emoji": "🏘️"
   },
   {
    "name": "Jeju Island",
    "blurb": "Volcanic island with stunning waterfalls, lava tubes, and beaches.",
    "emoji": "🌋"
   },
   {
    "name": "Haeundae Beach",
    "blurb": "Busan's popular urban beach vibrant with festivals and nightlife.",
    "emoji": "🌊"
   }
  ],
  "tips": {
   "food": "Self-service for water and side dishes is common in casual restaurants.",
   "culture": "Use two hands when giving or receiving items to show respect.",
   "transport": "T-Money cards work for all subways and buses nationwide.",
   "safety": "Extreme safety nationwide; emergency booths are common in cities."
  }
 },
 "KW": {
  "code": "KW",
  "region": "middle-east",
  "capital": "Kuwait City",
  "intro": "A wealthy Gulf state where modern skyscrapers overlook traditional dhow harbors and a deep-rooted merchant history.",
  "bestSeason": "Nov–Mar",
  "currency": "Kuwaiti Dinar (KWD)",
  "language": "Arabic, English",
  "timezone": "UTC+3",
  "plug": "Type G · 240V",
  "emergency": "112",
  "cost": {
   "budget": 80,
   "standard": 190,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Kuwait Towers",
    "blurb": "The iconic futuristic sphere-topped landmarks of the city skyline.",
    "emoji": "🗼"
   },
   {
    "name": "Souq Al-Mubarakiya",
    "blurb": "Traditional market for spices, dates, and authentic atmospheric shopping.",
    "emoji": "🛍️"
   },
   {
    "name": "Grand Mosque",
    "blurb": "Stunning Islamic architecture featuring a massive prayer hall and dome.",
    "emoji": "🕌"
   },
   {
    "name": "Sheikh Jaber Al-Ahmad Cultural Centre",
    "blurb": "An architectural masterpiece hosting theaters and performing arts venues.",
    "emoji": "🎭"
   }
  ],
  "tips": {
   "food": "Machboos (spiced rice with meat) is a must-try traditional dish.",
   "culture": "Kuwait is dry; alcohol is strictly forbidden and illegal to import.",
   "transport": "Public buses exist, but taxis or car rentals are more convenient.",
   "safety": "Very safe; observe local customs and dress conservatively in public."
  }
 },
 "KZ": {
  "code": "KZ",
  "region": "asia",
  "capital": "Astana",
  "intro": "Central Asia's giant offers surreal steppe landscapes, futuristic architecture, and ancient Silk Road history across its vast, rugged terrain.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Kazakhstani Tenge (KZT)",
  "language": "Kazakh, Russian",
  "timezone": "UTC+5",
  "plug": "Type C/F · 220V",
  "emergency": "101 fire · 102 police · 103 medical",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Charyn Canyon",
    "blurb": "Dramatic red sedimentary rock formations often compared to the Grand Canyon.",
    "emoji": "🏜️"
   },
   {
    "name": "Kaindy Lake",
    "blurb": "Sunken spruce trees rise from turquoise waters in this eerie alpine lake.",
    "emoji": "🌲"
   },
   {
    "name": "Bayterek Tower",
    "blurb": "Iconic golden sphere offering panoramic views of the modern capital city skyline.",
    "emoji": "🏙️"
   },
   {
    "name": "Medeu",
    "blurb": "The world's highest outdoor speed skating rink nestled in lush mountains.",
    "emoji": "⛸️"
   }
  ],
  "tips": {
   "food": "Try Beshbarmak, the traditional nomadic dish of boiled meat and noodles.",
   "culture": "Always remove your shoes when entering a local home.",
   "transport": "Internal flights are the fastest way to bridge Kazakhstan's massive distances.",
   "safety": "Be cautious in crowded markets and avoid unlicensed taxis at night."
  }
 },
 "LA": {
  "code": "LA",
  "region": "asia",
  "capital": "Vientiane",
  "intro": "Languid and spiritual, Laos invites you to discover misty mountains, saffron-robed monks, and the mighty Mekong River's rhythm.",
  "bestSeason": "Nov–Feb",
  "currency": "Lao Kip (LAK)",
  "language": "Lao",
  "timezone": "UTC+7",
  "plug": "Type A/B/C/E/F · 230V",
  "emergency": "190 police · 191 fire · 195 medical",
  "cost": {
   "budget": 25,
   "standard": 60,
   "luxury": 160
  },
  "attractions": [
   {
    "name": "Luang Prabang",
    "blurb": "A golden-templed UNESCO town famous for the daily morning alms giving.",
    "emoji": "🛕"
   },
   {
    "name": "Kuang Si Falls",
    "blurb": "Three-tiered waterfall with stunning milky blue pools perfect for swimming.",
    "emoji": "🌊"
   },
   {
    "name": "Plain of Jars",
    "blurb": "Mysterious archaeological site featuring thousands of prehistoric giant stone jars.",
    "emoji": "🏺"
   },
   {
    "name": "Vang Vieng",
    "blurb": "Karst mountain paradise ideal for tubing, hot air ballooning, and caving.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Eat sticky rice with your hands, traditionally served in bamboo baskets.",
   "culture": "Dress modestly by covering shoulders and knees when visiting sacred temples.",
   "transport": "Slow boats on the Mekong offer a peaceful, scenic travel experience.",
   "safety": "Stick to marked paths in rural areas due to unexploded ordnance."
  }
 },
 "LB": {
  "code": "LB",
  "region": "middle-east",
  "capital": "Beirut",
  "intro": "A Mediterranean jewel blending ancient Phoenician ruins with a vibrant, modern nightlife and world-renowned culinary heritage.",
  "bestSeason": "Apr–Jun & Sep–Nov",
  "currency": "Lebanese Pound (LBP)",
  "language": "Arabic, French",
  "timezone": "UTC+2",
  "plug": "Type A/B/C/D/G · 220V",
  "emergency": "112 police · 175 fire · 140 medical",
  "cost": {
   "budget": 40,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Baalbek",
    "blurb": "Colossal Roman temples that rank among the most preserved in existence.",
    "emoji": "🏛️"
   },
   {
    "name": "Jeita Grotto",
    "blurb": "Breathtaking interconnected limestone caves featuring a subterranean river boat ride.",
    "emoji": "🚣"
   },
   {
    "name": "Byblos",
    "blurb": "One of the oldest continuously inhabited cities with a charming harbor.",
    "emoji": "⚓"
   },
   {
    "name": "Beiteddine Palace",
    "blurb": "A masterpiece of 19th-century Lebanese architecture and intricate mosaic work.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Mezza involves many small plates; pace yourself for the grill courses.",
   "culture": "Hospitality is a point of pride; refusing food can be rude.",
   "transport": "Shared taxis called Service are the most common way to commute.",
   "safety": "Keep track of local news and avoid areas near border zones."
  }
 },
 "LC": {
  "code": "LC",
  "region": "americas",
  "capital": "Castries",
  "intro": "Dominated by the iconic Piton peaks, this Caribbean paradise boasts lush rainforests, sulfur springs, and volcanic black sand beaches.",
  "bestSeason": "Dec–Apr",
  "currency": "East Caribbean Dollar (XCD)",
  "language": "English, French Patois",
  "timezone": "UTC-4",
  "plug": "Type G · 230V",
  "emergency": "999 police · 911 fire/medical",
  "cost": {
   "budget": 80,
   "standard": 200,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "The Pitons",
    "blurb": "Twin volcanic spires rising dramatically from the sea, perfect for hiking.",
    "emoji": "⛰️"
   },
   {
    "name": "Sulphur Springs",
    "blurb": "The world's only drive-in volcano known for therapeutic mud baths.",
    "emoji": "🌋"
   },
   {
    "name": "Marigot Bay",
    "blurb": "A stunning, sheltered harbor surrounded by forested hills and luxury yachts.",
    "emoji": "⛵"
   },
   {
    "name": "Pigeon Island",
    "blurb": "Historic national park featuring military ruins and panoramic ocean views.",
    "emoji": "🏝️"
   }
  ],
  "tips": {
   "food": "Try the national dish: green figs and saltfish for breakfast.",
   "culture": "Locals are polite; always start a conversation with a pleasant greeting.",
   "transport": "Water taxis are the most scenic way to travel between coastal towns.",
   "safety": "Be cautious on winding mountain roads which can be very narrow."
  }
 },
 "LI": {
  "code": "LI",
  "region": "europe",
  "capital": "Vaduz",
  "intro": "Nestled in the Alps between Switzerland and Austria, this microstate offers fairytale castles and pristine mountain trails.",
  "bestSeason": "Jun–Aug & Dec–Mar",
  "currency": "Swiss Franc (CHF)",
  "language": "German",
  "timezone": "UTC+1",
  "plug": "Type J · 230V",
  "emergency": "117 police · 118 fire · 144 medical",
  "cost": {
   "budget": 100,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Vaduz Castle",
    "blurb": "Royal residence overlooking the capital from a high, forested hilltop.",
    "emoji": "🏰"
   },
   {
    "name": "Malbun",
    "blurb": "A family-friendly ski resort village surrounded by dramatic Alpine peaks.",
    "emoji": "⛷️"
   },
   {
    "name": "Kunstmuseum",
    "blurb": "State museum of modern art featuring an impressive international collection.",
    "emoji": "🖼️"
   },
   {
    "name": "Gutenberg Castle",
    "blurb": "High-medieval fortress located in the southern town of Balzers.",
    "emoji": "🛡️"
   }
  ],
  "tips": {
   "food": "Sample Käsknöpfle, a local pasta dish served with plenty of cheese.",
   "culture": "Respect the princely family's privacy; the main castle is not open.",
   "transport": "The prompt and efficient LIEmobil bus network covers the whole country.",
   "safety": "Crime is extremely low; standard precautions are more than sufficient."
  }
 },
 "LK": {
  "code": "LK",
  "region": "asia",
  "capital": "Colombo",
  "intro": "A teardrop-shaped island featuring ancient ruins, emerald tea plantations, and elephant-filled national parks along the Indian Ocean.",
  "bestSeason": "Dec–Mar & Apr–Sep",
  "currency": "Sri Lankan Rupee (LKR)",
  "language": "Sinhala, Tamil",
  "timezone": "UTC+5:30",
  "plug": "Type D/G · 230V",
  "emergency": "119 police · 110 fire/medical",
  "cost": {
   "budget": 30,
   "standard": 75,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Sigiriya",
    "blurb": "Ancient rock fortress topped with palace ruins and colorful frescoes.",
    "emoji": "🦁"
   },
   {
    "name": "Nine Arch Bridge",
    "blurb": "Iconic colonial-era railway bridge set in lush Highland tea fields.",
    "emoji": "🚂"
   },
   {
    "name": "Yala National Park",
    "blurb": "Prime territory for spotting leopards, elephants, and diverse bird species.",
    "emoji": "🐆"
   },
   {
    "name": "Galle Fort",
    "blurb": "Heritage walled city blending Dutch architecture with tropical coastal vibes.",
    "emoji": "🧱"
   }
  ],
  "tips": {
   "food": "Eating with your right hand is traditional and enhances the experience.",
   "culture": "Never turn your back to a Buddha statue for a photo.",
   "transport": "Take the scenic train from Kandy to Ella for unforgettable views.",
   "safety": "Check weather alerts for monsoons which vary by coast and month."
  }
 },
 "LR": {
  "code": "LR",
  "region": "africa",
  "capital": "Monrovia",
  "intro": "Africa's oldest republic offers sprawling surf beaches, dense tropical rainforests, and a resilient, welcoming spirit in West Africa.",
  "bestSeason": "Nov–Apr",
  "currency": "Liberian Dollar (LRD)",
  "language": "English",
  "timezone": "UTC+0",
  "plug": "Type A/B/C/E/F · 120V/220V",
  "emergency": "911",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Sapo National Park",
    "blurb": "Pristine primary rainforest home to pygmy hippos and chimpanzees.",
    "emoji": "🐒"
   },
   {
    "name": "Robertsport",
    "blurb": "Premier West African surf destination with incredible breaks and beaches.",
    "emoji": "🏄"
   },
   {
    "name": "Providence Island",
    "blurb": "Historical site where the first freed American slaves landed in 1822.",
    "emoji": "🌳"
   },
   {
    "name": "Ducor Hotel Ruins",
    "blurb": "Eerie, abandoned luxury hotel offering the best panoramic views of Monrovia.",
    "emoji": "🏨"
   }
  ],
  "tips": {
   "food": "Dumboy and palm butter are essential local staples to try.",
   "culture": "Greetings are important; the Liberian snap-shake is a common friendly gesture.",
   "transport": "Navigating the city is easiest by 'pen-pen' (motorbike) or yellow taxi.",
   "safety": "Avoid walking alone at night and keep valuables out of sight."
  }
 },
 "LS": {
  "code": "LS",
  "region": "africa",
  "capital": "Maseru",
  "intro": "Known as the Kingdom in the Sky, this landlocked nation is defined by its high-altitude peaks and traditional Basotho culture.",
  "bestSeason": "Oct–Apr",
  "currency": "Lesotho Loti (LSL)",
  "language": "Sesotho, English",
  "timezone": "UTC+2",
  "plug": "Type M · 220V",
  "emergency": "123 police · 121 medical",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Maletsunyane Falls",
    "blurb": "One of Africa's highest single-drop waterfalls near Semonkong village.",
    "emoji": "💦"
   },
   {
    "name": "Katse Dam",
    "blurb": "Engineering marvel and Africa's second largest double-curvature arch dam.",
    "emoji": "🏗️"
   },
   {
    "name": "Thaba Bosiu",
    "blurb": "Sacred flat-topped mountain and the birthplace of the Basotho nation.",
    "emoji": "⛰️"
   },
   {
    "name": "Afriski",
    "blurb": "High altitude mountain resort offering skiing in winter and biking in summer.",
    "emoji": "❄️"
   }
  ],
  "tips": {
   "food": "Try Papa, a maize porridge, usually served with spinach and stew.",
   "culture": "The Basotho hat (Mokorotlo) is the national symbol and pride.",
   "transport": "Pony trekking is a traditional and practical way to navigate mountains.",
   "safety": "Dress for extreme temperature changes, even during the summer months."
  }
 },
 "LT": {
  "code": "LT",
  "region": "europe",
  "capital": "Vilnius",
  "intro": "A Baltic gem featuring a Baroque capital, haunting historical sites, and the shifting sand dunes of the Curonian Spit.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "Lithuanian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 260
  },
  "attractions": [
   {
    "name": "Hill of Crosses",
    "blurb": "Profoundly moving pilgrimage site with over 100,000 crosses.",
    "emoji": "✝️"
   },
   {
    "name": "Trakai Island Castle",
    "blurb": "Stunning 14th-century red-brick castle situated in the middle of a lake.",
    "emoji": "🏰"
   },
   {
    "name": "Užupis",
    "blurb": "Bohemian district in Vilnius that declared itself an independent artistic republic.",
    "emoji": "🎨"
   },
   {
    "name": "Curonian Spit",
    "blurb": "Massive migrating sand dunes separating the lagoon from the sea.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Cepelinai, potato dumplings shaped like zeppelins, are the national dish.",
   "culture": "Lithuanians are proud of their ancient language; learn a few words.",
   "transport": "The intercity train system is affordable, clean, and very reliable.",
   "safety": "Generally very safe, just watch for pickpockets in crowded tourist spots."
  }
 },
 "LU": {
  "code": "LU",
  "region": "europe",
  "capital": "Luxembourg City",
  "intro": "Tiny but powerful, this Grand Duchy offers fairytale gorges, medieval fortifications, and sophisticated cosmopolitan charm.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "Luxembourgish, French, German",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "113 police · 112 fire/medical",
  "cost": {
   "budget": 80,
   "standard": 180,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Bock Casemates",
    "blurb": "Enormous network of underground tunnels within the city's ancient fortress.",
    "emoji": "🕳️"
   },
   {
    "name": "Vianden Castle",
    "blurb": "One of Europe's most magnificent Romanesque-Gothic palaces located in the north.",
    "emoji": "🏰"
   },
   {
    "name": "Mullerthal Trail",
    "blurb": "Known as 'Little Switzerland' for its rocky terrain and lush forests.",
    "emoji": "🥾"
   },
   {
    "name": "Grund",
    "blurb": "Picturesque lower valley district famous for riverside walks and nightlife.",
    "emoji": "🏡"
   }
  ],
  "tips": {
   "food": "Try Judd mat Gaardebounen, smoked pork collar with broad beans.",
   "culture": "Luxembourg is multilingual; switching between languages is common and expected.",
   "transport": "Public transport is completely free for everyone throughout the entire country.",
   "safety": "One of the safest countries globally; walking at night is safe."
  }
 },
 "LV": {
  "code": "LV",
  "region": "europe",
  "capital": "Riga",
  "intro": "A land of sprawling forests, wild Baltic beaches, and a capital city renowned for its stunning Art Nouveau architecture.",
  "bestSeason": "Jun–Aug",
  "currency": "Euro (EUR)",
  "language": "Latvian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 45,
   "standard": 100,
   "luxury": 240
  },
  "attractions": [
   {
    "name": "Riga Old Town",
    "blurb": "UNESCO-listed heart of the city filled with cobblestone streets and steeples.",
    "emoji": "⛪"
   },
   {
    "name": "Rundāle Palace",
    "blurb": "Baroque and Rococo masterpiece with manicured French-style rose gardens.",
    "emoji": "💐"
   },
   {
    "name": "Gauja National Park",
    "blurb": "The 'Latvian Switzerland' offering sandstone cliffs, caves, and hiking trails.",
    "emoji": "🌿"
   },
   {
    "name": "Jūrmala",
    "blurb": "Resort town famous for quartz sand beaches and colorful wooden houses.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Sample black balsam, a traditional herbal liqueur, but drink it slowly.",
   "culture": "Midsummer (Jāņi) is the most important festival with bonfire traditions.",
   "transport": "Frequent buses and trains connect Riga to all major regional towns.",
   "safety": "Be alert for overcharging in tourist-centric bars in Riga's Old Town."
  }
 },
 "LY": {
  "code": "LY",
  "region": "africa",
  "capital": "Tripoli",
  "intro": "Home to incredible Roman ruins and vast Saharan dunes, Libya is a destination for the intrepid historical explorer.",
  "bestSeason": "Oct–Apr",
  "currency": "Libyan Dinar (LYD)",
  "language": "Arabic",
  "timezone": "UTC+2",
  "plug": "Type C/D/L · 127V/230V",
  "emergency": "1515",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Leptis Magna",
    "blurb": "One of the finest and most complete Roman cities in existence.",
    "emoji": "🏛️"
   },
   {
    "name": "Cyrene",
    "blurb": "Ancient Greek colony ruins overlooking the lush green Mediterranean hills.",
    "emoji": "🏺"
   },
   {
    "name": "Ghadames",
    "blurb": "The 'Pearl of the Desert' featuring unique whitewashed mud-brick architecture.",
    "emoji": "🏘️"
   },
   {
    "name": "Akakus Mountains",
    "blurb": "Spectacular desert landscapes featuring thousands of prehistoric rock art carvings.",
    "emoji": "🏜️"
   }
  ],
  "tips": {
   "food": "Libyan couscous is spicier than its neighbors' and often contains lamb.",
   "culture": "Islam is central to life; always dress conservatively in public spaces.",
   "transport": "Travel usually requires a local guide and private 4x4 for safety.",
   "safety": "Check current travel advisories due to ongoing political instability and conflict."
  }
 },
 "MA": {
  "code": "MA",
  "region": "africa",
  "capital": "Rabat",
  "intro": "A vibrant tapestry of bustling souks, Sahara dunes, and ancient medinas where traditions meet the cooling Atlantic breeze.",
  "bestSeason": "Mar–May & Sep–Nov",
  "currency": "Moroccan Dirham (MAD)",
  "language": "Arabic, Berber, French",
  "timezone": "UTC+1",
  "plug": "Type C/E · 220V",
  "emergency": "190 police · 150 ambulance",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Jemaa el-Fnaa",
    "blurb": "Marrakech's legendary square filled with musicians, storytellers, and street food stalls.",
    "emoji": "🐍"
   },
   {
    "name": "Chefchaouen",
    "blurb": "The enchanting Blue City nestled within the rugged Rif Mountains.",
    "emoji": "💙"
   },
   {
    "name": "Sahara Desert",
    "blurb": "Ride camels across golden dunes and sleep under vast starlit skies.",
    "emoji": "🐪"
   },
   {
    "name": "Hassan II Mosque",
    "blurb": "Massive Casablanca landmark featuring a minaret overlooking the crashing Atlantic ocean.",
    "emoji": "🕌"
   }
  ],
  "tips": {
   "food": "Must try slow-cooked tagines and sweet mint tea rituals.",
   "culture": "Dress modestly and always ask before photographing locals.",
   "transport": "Use Petit Taxis for city trips and trains for long distances.",
   "safety": "Be wary of unofficial guides in busy tourist areas."
  }
 },
 "MC": {
  "code": "MC",
  "region": "europe",
  "capital": "Monaco",
  "intro": "The world's second-smallest nation offers unparalleled glamour, high-stakes casinos, and a prestigious yacht-lined harbor.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "French",
  "timezone": "UTC+1",
  "plug": "Type C/E/F · 230V",
  "emergency": "17 police · 18 fire/ambulance",
  "cost": {
   "budget": 150,
   "standard": 350,
   "luxury": 900
  },
  "attractions": [
   {
    "name": "Monte Carlo Casino",
    "blurb": "Iconic Belle Époque building famous for high-stakes gambling and luxury cars.",
    "emoji": "🎲"
   },
   {
    "name": "Prince's Palace",
    "blurb": "Watch the changing of the guard at this historic hilltop residence.",
    "emoji": "👑"
   },
   {
    "name": "Oceanographic Museum",
    "blurb": "Substantial aquarium built into a cliffside overlooking the Mediterranean Sea.",
    "emoji": "🐠"
   },
   {
    "name": "Larvotto Beach",
    "blurb": "The glamourous man-made pebble beach with trendy seaside restaurants.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Barbagiuan, a fried chard and ricotta pastry, is the national snack.",
   "culture": "Professional attire is expected when visiting casinos and fine restaurants.",
   "transport": "The principality is walkable, but public elevators save steep climbs.",
   "safety": "One of the safest places globally with very high surveillance."
  }
 },
 "MD": {
  "code": "MD",
  "region": "europe",
  "capital": "Chișinău",
  "intro": "Europe’s hidden gem boasts world-class underground wine cellars, rolling green hills, and quiet, rural charm.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Moldovan Leu (MDL)",
  "language": "Romanian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 35,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Mileștii Mici",
    "blurb": "The world's largest wine cellar with over 200 kilometers of tunnels.",
    "emoji": "🍷"
   },
   {
    "name": "Orheiul Vechi",
    "blurb": "Ancient cave monastery carved into limestone cliffs above a river.",
    "emoji": "⛪"
   },
   {
    "name": "Cricova Winery",
    "blurb": "Subterranean wine city featuring tasting rooms used by Russian astronauts.",
    "emoji": "🍇"
   },
   {
    "name": "Stephen the Great Park",
    "blurb": "The oldest park in Chișinău, perfect for a peaceful afternoon stroll.",
    "emoji": "🌳"
   }
  ],
  "tips": {
   "food": "Try Mămăligă with sour cream and Placintă, a traditional stuffed flatbread.",
   "culture": "Expect warm hospitality; guests are often welcomed with wine.",
   "transport": "Marshrutkas (minibuses) are the primary way to reach smaller villages.",
   "safety": "Generally safe, though avoid political demonstrations in the capital city."
  }
 },
 "ME": {
  "code": "ME",
  "region": "europe",
  "capital": "Podgorica",
  "intro": "Where dramatic mountains plunge into the Adriatic, offering medieval walled towns and breathtaking glacial lakes.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "Montenegrin",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Kotor Old Town",
    "blurb": "UNESCO-listed medieval maze set at the foot of dramatic mountains.",
    "emoji": "🏰"
   },
   {
    "name": "Durmitor National Park",
    "blurb": "Stunning alpine landscape featuring deep canyons and turquoise glacial lakes.",
    "emoji": "🏔️"
   },
   {
    "name": "Sveti Stefan",
    "blurb": "Iconic luxury island resort connected to the shore by a walkway.",
    "emoji": "🏝️"
   },
   {
    "name": "Ostrog Monastery",
    "blurb": "Vertical monastery built into a sheer cliff face high above ground.",
    "emoji": "🕯️"
   }
  ],
  "tips": {
   "food": "Sample Njegusi prosciutto and fresh seafood along the coast.",
   "culture": "Montenegrins are proud of their history; respect local customs.",
   "transport": "Renting a car is the best way to see the mountains.",
   "safety": "Roads are winding and narrow; drive cautiously in the interior."
  }
 },
 "MG": {
  "code": "MG",
  "region": "africa",
  "capital": "Antananarivo",
  "intro": "An ecological wonderland home to unique lemurs, towering baobabs, and diverse landscapes found nowhere else on Earth.",
  "bestSeason": "Apr–Oct",
  "currency": "Malagasy Ariary (MGA)",
  "language": "Malagasy, French",
  "timezone": "UTC+3",
  "plug": "Type C/D/E/J · 220V",
  "emergency": "117 police · 118 fire · 124 ambulance",
  "cost": {
   "budget": 30,
   "standard": 80,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Avenue of the Baobabs",
    "blurb": "Group of ancient, towering trees creating a surreal landscape at sunset.",
    "emoji": "🌳"
   },
   {
    "name": "Tsingy de Bemaraha",
    "blurb": "Striking limestone needle formations offering adventurous hiking across suspension bridges.",
    "emoji": "🧗"
   },
   {
    "name": "Isalo National Park",
    "blurb": "Jurassic-era sandstone canyons with natural pools and diverse lemur species.",
    "emoji": "🐒"
   },
   {
    "name": "Nosy Be",
    "blurb": "Fragrant 'Perfume Island' known for Ylang-Ylang, diving, and pristine beaches.",
    "emoji": "🏝️"
   }
  ],
  "tips": {
   "food": "Romazava, a meat and herb stew, is the national dish.",
   "culture": "Respect 'fady' (local taboos), which vary significantly between different regions.",
   "transport": "Internal flights are expensive but save days of bumpy road travel.",
   "safety": "Be cautious in the capital at night; travel with guides."
  }
 },
 "MH": {
  "code": "MH",
  "region": "oceania",
  "capital": "Majuro",
  "intro": "Low-lying coral atolls offering world-class diving and a serene escape in the remote central Pacific.",
  "bestSeason": "Jan–Apr",
  "currency": "US Dollar (USD)",
  "language": "Marshallese, English",
  "timezone": "UTC+12",
  "plug": "Type A/B · 120V",
  "emergency": "911",
  "cost": {
   "budget": 70,
   "standard": 150,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Arno Atoll",
    "blurb": "Lush coral atoll famous for its 'Longar' love school and fishing.",
    "emoji": "🛶"
   },
   {
    "name": "Bikini Atoll",
    "blurb": "UNESCO site known for nuclear history and spectacular deep-sea shipwrecks.",
    "emoji": "⚓"
   },
   {
    "name": "Laura Village",
    "blurb": "Pacific island life at its slowest on Majuro's calm western tip.",
    "emoji": "🥥"
   },
   {
    "name": "Kalalin Pass",
    "blurb": "An incredible diving spot featuring vibrant corals and diverse shark species.",
    "emoji": "🤿"
   }
  ],
  "tips": {
   "food": "Enjoy fresh coconut, breadfruit, and locally caught tuna or snapper.",
   "culture": "The Marshallese value modesty; swimwear should be kept for beaches.",
   "transport": "Boats and small planes are essential for inter-atoll travel.",
   "safety": "Sun protection is critical due to intense proximity to the equator."
  }
 },
 "MK": {
  "code": "MK",
  "region": "europe",
  "capital": "Skopje",
  "intro": "A Balkan treasure where Ottoman history, Byzantine churches, and the stunning Lake Ohrid await adventurous travelers.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Macedonian Denar (MKD)",
  "language": "Macedonian, Albanian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 35,
   "standard": 75,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Lake Ohrid",
    "blurb": "One of Europe's oldest and deepest lakes, surrounded by historic churches.",
    "emoji": "💧"
   },
   {
    "name": "Old Bazaar, Skopje",
    "blurb": "Historic trade center with winding alleys, mosques, and traditional artisan shops.",
    "emoji": "🏺"
   },
   {
    "name": "Matka Canyon",
    "blurb": "Stunning natural gorge offering boat trips to deep limestone caves.",
    "emoji": "🛶"
   },
   {
    "name": "Saint Naum Monastery",
    "blurb": "Beautiful 10th-century monastery located right on the Albanian border.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Tavče Gravče, a bean stew served in clay, is delicious.",
   "culture": "Coffee culture is huge; locals spend hours chatting in cafes.",
   "transport": "Buses are the main way to travel between Macedonian cities.",
   "safety": "Generally very safe; pickpocketing is rare even in the capital."
  }
 },
 "ML": {
  "code": "ML",
  "region": "africa",
  "capital": "Bamako",
  "intro": "The heart of West African music and history, featuring iconic mud-brick architecture and the majestic Niger River.",
  "bestSeason": "Nov–Jan",
  "currency": "West African CFA Franc (XOF)",
  "language": "French, Bambara",
  "timezone": "UTC+0",
  "plug": "Type C/E · 220V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Great Mosque of Djenné",
    "blurb": "The largest sun-dried mud brick building in the entire world.",
    "emoji": "🕌"
   },
   {
    "name": "Timbuktu",
    "blurb": "Legendary ancient crossroads of Saharan trade and Islamic scholarship.",
    "emoji": "📜"
   },
   {
    "name": "Dogon Country",
    "blurb": "Spectacular Bandiagra Escarpment with traditional cliff-side villages and unique culture.",
    "emoji": "👺"
   },
   {
    "name": "Bamako National Museum",
    "blurb": "Houses significant ethnographic collections and traditional West African textiles.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Try Tigadeguena, a rich peanut sauce stew served with rice.",
   "culture": "Malians are extremely sociable; greetings are elaborate and very important.",
   "transport": "Pintads (shared taxis) and riverboats are common modes of transport.",
   "safety": "Check current travel advisories due to regional instability and conflict."
  }
 },
 "MM": {
  "code": "MM",
  "region": "asia",
  "capital": "Naypyidaw",
  "intro": "A spiritual landscape of thousands of golden pagodas, misty mountains, and the unique stilt-villages of Inle Lake.",
  "bestSeason": "Nov–Feb",
  "currency": "Myanmar Kyat (MMK)",
  "language": "Burmese",
  "timezone": "UTC+6:30",
  "plug": "Type C/D/F/G · 230V",
  "emergency": "199 police · 191 fire · 192 ambulance",
  "cost": {
   "budget": 30,
   "standard": 65,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Bagan",
    "blurb": "Ancient plains covered with thousands of brick pagodas and temples.",
    "emoji": "🎈"
   },
   {
    "name": "Shwedagon Pagoda",
    "blurb": "Yangon's massive golden stupa, the most sacred site in Myanmar.",
    "emoji": "✨"
   },
   {
    "name": "Inle Lake",
    "blurb": "Famous for floating gardens and fishermen who row with one leg.",
    "emoji": "🛶"
   },
   {
    "name": "Golden Rock",
    "blurb": "Gravity-defying gilded boulder perched precariously on a mountain cliff.",
    "emoji": "🟡"
   }
  ],
  "tips": {
   "food": "Mohinga, a savory fish noodle soup, is the favorite breakfast.",
   "culture": "Remove shoes and socks before entering any temple or home.",
   "transport": "Buses are surprisingly modern, but trains are slow and bumpy.",
   "safety": "Review the current political situation before planning any travel here."
  }
 },
 "MN": {
  "code": "MN",
  "region": "asia",
  "capital": "Ulaanbaatar",
  "intro": "The land of the eternal blue sky offers vast steppes, nomadic hospitality, and the wild Gobi Desert.",
  "bestSeason": "Jun–Aug",
  "currency": "Mongolian Tögrög (MNT)",
  "language": "Mongolian",
  "timezone": "UTC+7 to +8",
  "plug": "Type C/E · 230V",
  "emergency": "102 police · 101 fire · 103 ambulance",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Gorkhi-Terelj",
    "blurb": "National park near the capital known for alpine scenery and hiking.",
    "emoji": "⛰️"
   },
   {
    "name": "Gobi Desert",
    "blurb": "Enormous desert featuring singing dunes and important dinosaur fossil sites.",
    "emoji": "🦖"
   },
   {
    "name": "Khuvsgul Lake",
    "blurb": "Known as the 'Blue Pearl,' a massive pristine freshwater lake near Siberia.",
    "emoji": "🌊"
   },
   {
    "name": "Genghis Khan Statue",
    "blurb": "Colossal stainless steel statue of the conqueror atop a visitor center.",
    "emoji": "🐎"
   }
  ],
  "tips": {
   "food": "Try Buuz (steamed dumplings) and airag (fermented mare's milk).",
   "culture": "If staying in a ger, avoid stepping on the threshold doorstep.",
   "transport": "4WD vehicles with experienced drivers are essential for the countryside.",
   "safety": "Winters are extremely cold; ensure you have appropriate high-quality gear."
  }
 },
 "MO": {
  "code": "MO",
  "region": "asia",
  "capital": "Macau",
  "intro": "A unique blend of Portuguese heritage and glittering mega-casinos, known as the 'Las Vegas of Asia.'",
  "bestSeason": "Oct–Dec",
  "currency": "Macanese Pataca (MOP)",
  "language": "Chinese, Portuguese",
  "timezone": "UTC+8",
  "plug": "Type D/G · 230V",
  "emergency": "999",
  "cost": {
   "budget": 70,
   "standard": 180,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Ruins of St. Paul's",
    "blurb": "Iconic 17th-century stone facade of a former Catholic cathedral.",
    "emoji": "⛪"
   },
   {
    "name": "Senado Square",
    "blurb": "Paved with wave-patterned tiles, reflecting Macau's early Portuguese influence.",
    "emoji": "🚶"
   },
   {
    "name": "Macau Tower",
    "blurb": "Panoramic city views and the world's highest commercial bungy jump.",
    "emoji": "🗼"
   },
   {
    "name": "Cotai Strip",
    "blurb": "Home to massive, luxurious integrated resorts and world-class gambling.",
    "emoji": "🎰"
   }
  ],
  "tips": {
   "food": "Don't miss the famous Lord Stow’s Portuguese egg tarts.",
   "culture": "Cantonese is the daily language; Portuguese remains on street signs.",
   "transport": "Free shuttle buses from casinos connect main ports and hotels.",
   "safety": "Extremely safe; standard urban precautions against pickpockets are enough."
  }
 },
 "MR": {
  "code": "MR",
  "region": "africa",
  "capital": "Nouakchott",
  "intro": "A bridge between the Maghreb and Sub-Saharan Africa, where desert caravans meet the Atlantic's rich fishing waters.",
  "bestSeason": "Nov–Mar",
  "currency": "Mauritanian Ouguiya (MRU)",
  "language": "Arabic, French",
  "timezone": "UTC+0",
  "plug": "Type C/F · 220V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 35,
   "standard": 85,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Banc d'Arguin",
    "blurb": "UNESCO coastal park vital for millions of migrating winter birds.",
    "emoji": "🐦"
   },
   {
    "name": "Chinguetti",
    "blurb": "Ancient medieval trading center and holy city of the Sahara.",
    "emoji": "🏜️"
   },
   {
    "name": "Port de Pêche",
    "blurb": "Lively beach in Nouakchott where hundreds of colorful pirogues land.",
    "emoji": "🛶"
   },
   {
    "name": "Iron Ore Train",
    "blurb": "One of the world's longest trains, crossing the harsh desert.",
    "emoji": "🚂"
   }
  ],
  "tips": {
   "food": "Thieboudienne (fish and rice) is a popular coastal staple meal.",
   "culture": "Mauritania is a conservative Islamic republic; dress very modestly.",
   "transport": "Bush taxis are the primary long-distance transport between towns.",
   "safety": "Travel in the desert is restricted; always use registered guides."
  }
 },
 "MT": {
  "code": "MT",
  "region": "europe",
  "capital": "Valletta",
  "intro": "A sun-drenched Mediterranean archipelago where prehistoric temples meet crystal-clear waters and honey-colored limestone fortresses.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Maltese, English",
  "timezone": "UTC+1",
  "plug": "Type G · 230V",
  "emergency": "112",
  "cost": {
   "budget": 70,
   "standard": 150,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Blue Lagoon",
    "blurb": "Azure waters perfect for swimming between Comino and Cominotto islets.",
    "emoji": "🏝️"
   },
   {
    "name": "Mdina",
    "blurb": "Medieval 'Silent City' offering narrow alleys and panoramic island views.",
    "emoji": "🏰"
   },
   {
    "name": "Ħal Saflieni Hypogeum",
    "blurb": "Remarkable underground prehistoric burial site carved into living rock.",
    "emoji": "💀"
   },
   {
    "name": "St. John's Co-Cathedral",
    "blurb": "Baroque masterpiece featuring intricate gold leaf and Caravaggio paintings.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Try a pastizz, a flaky pastry filled with ricotta or peas.",
   "culture": "Cover shoulders and knees when entering Catholic churches.",
   "transport": "Buses are the main transport; get a Tallinja card for savings.",
   "safety": "The sea currents can be strong; swim only in designated areas."
  }
 },
 "MU": {
  "code": "MU",
  "region": "africa",
  "capital": "Port Louis",
  "intro": "A volcanic island nation in the Indian Ocean famous for sapphire waters, powder-white beaches, and diverse fusion cuisine.",
  "bestSeason": "May–Dec",
  "currency": "Mauritian Rupee (MUR)",
  "language": "English, French, Creole",
  "timezone": "UTC+4",
  "plug": "Type C/G · 230V",
  "emergency": "999",
  "cost": {
   "budget": 60,
   "standard": 160,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Le Morne Brabant",
    "blurb": "Rugged mountain and UNESCO site symbolizing freedom and resistance.",
    "emoji": "⛰️"
   },
   {
    "name": "Seven Coloured Earths",
    "blurb": "Geological phenomenon of dunes showing seven distinct colors of sand.",
    "emoji": "🌈"
   },
   {
    "name": "Pamplemousses Garden",
    "blurb": "Botanical garden famous for giant water lilies and exotic spices.",
    "emoji": "🌿"
   },
   {
    "name": "Grand Bassin",
    "blurb": "Sacred crater lake and pilgrimage site for the Hindu community.",
    "emoji": "🛕"
   }
  ],
  "tips": {
   "food": "Don't miss dholl puri, the island’s favorite street food wrap.",
   "culture": "Remove shoes when entering temples or private homes.",
   "transport": "Renting a car is the best way to explore remote corners.",
   "safety": "Be cautious of sea urchins when swimming in rocky areas."
  }
 },
 "MV": {
  "code": "MV",
  "region": "asia",
  "capital": "Malé",
  "intro": "A tropical paradise of over a thousand coral islands offering ultimate luxury, white sands, and vibrant marine life.",
  "bestSeason": "Nov–Apr",
  "currency": "Maldivian Rufiyaa (MVR)",
  "language": "Dhivehi",
  "timezone": "UTC+5",
  "plug": "Type G · 230V",
  "emergency": "119 police · 118 fire · 102 ambulance",
  "cost": {
   "budget": 100,
   "standard": 350,
   "luxury": 1200
  },
  "attractions": [
   {
    "name": "Hanifaru Bay",
    "blurb": "UNESCO biosphere reserve known for massive manta ray gatherings.",
    "emoji": "🐟"
   },
   {
    "name": "Vaadhoo Island",
    "blurb": "Beach famous for bioluminescent 'Sea of Stars' at night.",
    "emoji": "✨"
   },
   {
    "name": "Malé Fish Market",
    "blurb": "The soul of the capital, showcasing the daily fresh catch.",
    "emoji": "🎣"
   },
   {
    "name": "Maafushi",
    "blurb": "Popular local island offering a balance of culture and beaches.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Sample Mas huni, a traditional breakfast of tuna and coconut.",
   "culture": "Alcohol is prohibited on local islands, only available in resorts.",
   "transport": "Speedboats and seaplanes are the primary ways to move between islands.",
   "safety": "Use high-SPF reef-safe sunscreen to protect yourself and the coral."
  }
 },
 "MW": {
  "code": "MW",
  "region": "africa",
  "capital": "Lilongwe",
  "intro": "The Warm Heart of Africa captivates visitors with its massive lake, lush mountains, and exceptionally friendly people.",
  "bestSeason": "May–Oct",
  "currency": "Malawian Kwacha (MWK)",
  "language": "Chichewa, English",
  "timezone": "UTC+2",
  "plug": "Type G · 230V",
  "emergency": "997 police · 999 fire/ambulance",
  "cost": {
   "budget": 35,
   "standard": 90,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Lake Malawi",
    "blurb": "An inland sea with golden sands and colorful cichlid fish.",
    "emoji": "🛶"
   },
   {
    "name": "Mount Mulanje",
    "blurb": "Massive granite inselberg offering world-class hiking and tea estate views.",
    "emoji": "🥾"
   },
   {
    "name": "Liwonde National Park",
    "blurb": "Prime wildlife viewing spot for elephants, hippos, and rare cheetahs.",
    "emoji": "🐘"
   },
   {
    "name": "Nyika Plateau",
    "blurb": "High-altitude grassland perfect for trekking and spotting leopards.",
    "emoji": "🐆"
   }
  ],
  "tips": {
   "food": "Nsima is the staple cornmeal porridge served with savory stews.",
   "culture": "Greeting people properly is essential to Malawian social etiquette.",
   "transport": "Minibuses are cheap but crowded; private taxis are more comfortable.",
   "safety": "Take malaria prophylaxis and use mosquito nets every night."
  }
 },
 "MX": {
  "code": "MX",
  "region": "americas",
  "capital": "Mexico City",
  "intro": "A vibrant kaleidoscope of ancient ruins, colonial cities, world-class cuisine, and stunning coastlines across two oceans.",
  "bestSeason": "Dec–Apr",
  "currency": "Mexican Peso (MXN)",
  "language": "Spanish",
  "timezone": "UTC-5 to -8",
  "plug": "Type A/B · 127V",
  "emergency": "911",
  "cost": {
   "budget": 50,
   "standard": 130,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Chichén Itzá",
    "blurb": "Iconic Mayan pyramid and one of the New Seven Wonders.",
    "emoji": "📐"
   },
   {
    "name": "Tulum",
    "blurb": "Ancient cliffside ruins overlooking the turquoise Caribbean Sea.",
    "emoji": "🌊"
   },
   {
    "name": "Teotihuacán",
    "blurb": "Massive archaeological complex featuring the Sun and Moon pyramids.",
    "emoji": "☀️"
   },
   {
    "name": "Copper Canyon",
    "blurb": "A group of six massive canyons deeper than the Grand Canyon.",
    "emoji": "🌵"
   }
  ],
  "tips": {
   "food": "Street tacos are delicious; look for stalls with the longest lines.",
   "culture": "Tipping (propina) of 10-15% is expected in most restaurants.",
   "transport": "ADO buses are an excellent, comfortable way to travel between cities.",
   "safety": "Stick to toll roads (cuotas) and avoid driving at night."
  }
 },
 "MY": {
  "code": "MY",
  "region": "asia",
  "capital": "Kuala Lumpur",
  "intro": "A diverse melting pot where futuristic skyscrapers tower over ancient rainforests and bustling multi-ethnic street markets.",
  "bestSeason": "Dec–Apr & Jun–Aug",
  "currency": "Malaysian Ringgit (MYR)",
  "language": "Malay, English, Chinese",
  "timezone": "UTC+8",
  "plug": "Type G · 240V",
  "emergency": "999",
  "cost": {
   "budget": 40,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Petronas Towers",
    "blurb": "Architectural marvels and the world's tallest twin towers.",
    "emoji": "🏢"
   },
   {
    "name": "Batu Caves",
    "blurb": "Massive limestone hill with shrines and a giant gold statue.",
    "emoji": "🐒"
   },
   {
    "name": "Mount Kinabalu",
    "blurb": "Highest peak in Southeast Asia, located in scenic Sabah, Borneo.",
    "emoji": "⛰️"
   },
   {
    "name": "George Town",
    "blurb": "UNESCO heritage site famous for vibrant street art and food.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Taste 'Nasi Lemak', the national dish of fragrant coconut rice.",
   "culture": "Always use your right hand for eating or giving items.",
   "transport": "Use the 'Grab' app for convenient and affordable city travel.",
   "safety": "Be mindful of bag snatchers in crowded tourist areas."
  }
 },
 "MZ": {
  "code": "MZ",
  "region": "africa",
  "capital": "Maputo",
  "intro": "An unexplored jewel of East Africa boasting 2,500 kilometers of pristine coastline and a rhythmic Afro-Portuguese culture.",
  "bestSeason": "May–Nov",
  "currency": "Mozambican Metical (MZN)",
  "language": "Portuguese",
  "timezone": "UTC+2",
  "plug": "Type C/F/M · 220V",
  "emergency": "119 police · 198 fire · 117 ambulance",
  "cost": {
   "budget": 45,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Bazaruto Archipelago",
    "blurb": "Marine park with towering sand dunes and incredible diving reefs.",
    "emoji": "🛥️"
   },
   {
    "name": "Island of Mozambique",
    "blurb": "Historical fortified city reflecting a unique blend of cultural influences.",
    "emoji": "🏛️"
   },
   {
    "name": "Gorongosa National Park",
    "blurb": "Rejuvenated wilderness area with diverse wildlife and bird species.",
    "emoji": "🦁"
   },
   {
    "name": "Tofo Beach",
    "blurb": "World-renowned spot for swimming with whale sharks and manta rays.",
    "emoji": "🐋"
   }
  ],
  "tips": {
   "food": "Indulge in grilled peri-peri prawns, a local coastal specialty.",
   "culture": "Learn a few basic Portuguese phrases to navigate daily life.",
   "transport": "Chapas (minibuses) are the common but often overcrowded local transport.",
   "safety": "Carry your passport at all times, as police checks are frequent."
  }
 },
 "NA": {
  "code": "NA",
  "region": "africa",
  "capital": "Windhoek",
  "intro": "A land of hauntingly beautiful desert landscapes, towering red dunes, and unique wildlife adapted to the arid terrain.",
  "bestSeason": "Jun–Oct",
  "currency": "Namibian Dollar (NAD)",
  "language": "English, Afrikaans, German",
  "timezone": "UTC+2",
  "plug": "Type D/M · 220V",
  "emergency": "10111",
  "cost": {
   "budget": 60,
   "standard": 150,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Sossusvlei",
    "blurb": "Immense red sand dunes and the stark, white salt pan Deadvlei.",
    "emoji": "🏜️"
   },
   {
    "name": "Etosha National Park",
    "blurb": "A massive salt pan surrounded by abundant savanna wildlife.",
    "emoji": "🦓"
   },
   {
    "name": "Skeleton Coast",
    "blurb": "Eerie coastline where desert dunes meet the Atlantic and shipwrecks.",
    "emoji": "⚓"
   },
   {
    "name": "Fish River Canyon",
    "blurb": "One of the largest canyons in the world, perfect for hiking.",
    "emoji": "🧗"
   }
  ],
  "tips": {
   "food": "Try game meat like oryx or springbok at local restaurants.",
   "culture": "Ask for permission before taking photos of local indigenous people.",
   "transport": "A 4x4 vehicle is highly recommended for exploring gravel roads.",
   "safety": "Always carry plenty of water and spare tires when driving remote."
  }
 },
 "NE": {
  "code": "NE",
  "region": "africa",
  "capital": "Niamey",
  "intro": "A vast Saharan nation where ancient caravan routes meet the Great Niger River and nomadic traditions endure.",
  "bestSeason": "Dec–Feb",
  "currency": "West African CFA franc (XOF)",
  "language": "French, Hausa, Zarma",
  "timezone": "UTC+1",
  "plug": "Type A/B/C/D/E/F · 220V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 30,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Agadez Mosque",
    "blurb": "Historic mud-brick skyscraper marking an ancient Saharan crossroads.",
    "emoji": "🕌"
   },
   {
    "name": "W National Park",
    "blurb": "Large transborder park hosting elephants, lions, and diverse birds.",
    "emoji": "🐘"
   },
   {
    "name": "Kouré Giraffes",
    "blurb": "One of the last herds of West African giraffes in the wild.",
    "emoji": "🦒"
   },
   {
    "name": "Aïr Mountains",
    "blurb": "Starkly beautiful volcanic range home to Tuareg nomadic culture.",
    "emoji": "🌋"
   }
  ],
  "tips": {
   "food": "Millet is the staple grain, often served as a thick porridge.",
   "culture": "Dress very modestly and respect Islamic customs in all regions.",
   "transport": "Expect long, dusty journeys; travel by bush taxi is the norm.",
   "safety": "Check current government travel advisories due to regional instability."
  }
 },
 "NG": {
  "code": "NG",
  "region": "africa",
  "capital": "Abuja",
  "intro": "The Giant of Africa pulsates with energy, legendary nightlife, diverse cultures, and a rapidly growing creative scene.",
  "bestSeason": "Nov–Jan",
  "currency": "Nigerian Naira (NGN)",
  "language": "English, Hausa, Yoruba, Igbo",
  "timezone": "UTC+1",
  "plug": "Type D/G · 240V",
  "emergency": "112",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Zuma Rock",
    "blurb": "A massive monolithic igneous intrusion outside the capital city.",
    "emoji": "🗿"
   },
   {
    "name": "Lekki Conservation Centre",
    "blurb": "Nature reserve in Lagos featuring Africa’s longest canopy walkway.",
    "emoji": "🌉"
   },
   {
    "name": "Osun-Osogbo Sacred Grove",
    "blurb": "UNESCO-listed sacred forest honoring the Yoruba goddess of fertility.",
    "emoji": "🌳"
   },
   {
    "name": "Nike Art Gallery",
    "blurb": "Four-story cultural hub showcasing thousands of contemporary Nigerian artworks.",
    "emoji": "🖼️"
   }
  ],
  "tips": {
   "food": "Don't leave without trying authentic Nigerian Jollof rice.",
   "culture": "Respect for elders is a cornerstone of Nigerian social life.",
   "transport": "Traffic in Lagos can be extreme; plan your movements carefully.",
   "safety": "Use reputable car-hailing apps rather than hailing random taxis."
  }
 },
 "NI": {
  "code": "NI",
  "region": "americas",
  "capital": "Managua",
  "intro": "The land of lakes and volcanoes offers colonial charm, world-class surfing, and lush untamed rainforests.",
  "bestSeason": "Dec–Apr",
  "currency": "Nicaraguan Córdoba (NIO)",
  "language": "Spanish",
  "timezone": "UTC-6",
  "plug": "Type A/B · 120V",
  "emergency": "118 police · 115 fire · 128 ambulance",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Granada",
    "blurb": "Colorful colonial city known for its architecture and lakeside setting.",
    "emoji": "⛪"
   },
   {
    "name": "Ometepe Island",
    "blurb": "Twin-volcano island in Lake Nicaragua perfect for hiking and kayaking.",
    "emoji": "🌋"
   },
   {
    "name": "Cerro Negro",
    "blurb": "Active volcano where travelers can slide down ash-covered slopes.",
    "emoji": "🏂"
   },
   {
    "name": "Corn Islands",
    "blurb": "Caribbean gems offering turquoise water and a relaxed Creole vibe.",
    "emoji": "🥥"
   }
  ],
  "tips": {
   "food": "Gallo Pinto (beans and rice) is served with almost every meal.",
   "culture": "Nicaraguans are proud; avoid political discussions during your stay.",
   "transport": "Chicken buses are cheap and vibrant but can be very slow.",
   "safety": "Be cautious in Managua at night; use radio-dispatched taxis."
  }
 },
 "NL": {
  "code": "NL",
  "region": "europe",
  "capital": "Amsterdam",
  "intro": "A charming landscape of iconic windmills, seasonal tulip fields, historic canals, and a progressive, bike-friendly culture.",
  "bestSeason": "Apr–May & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Dutch",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 90,
   "standard": 200,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Rijksmuseum",
    "blurb": "National museum showcasing Dutch masterpieces including Rembrandt and Vermeer.",
    "emoji": "🎨"
   },
   {
    "name": "Keukenhof Gardens",
    "blurb": "Worlds largest flower garden, spectacular during the spring tulip bloom.",
    "emoji": "🌷"
   },
   {
    "name": "Kinderdijk",
    "blurb": "UNESCO site featuring 19 historic 18th-century windmills in scenic wetlands.",
    "emoji": "🌬️"
   },
   {
    "name": "Anne Frank House",
    "blurb": "Moving historical site where the famous diarist hid during WWII.",
    "emoji": "📕"
   }
  ],
  "tips": {
   "food": "Try 'haring' with onions or fresh warm 'stroopwafels'.",
   "culture": "Directness is valued here; don't mistake it for being rude.",
   "transport": "Rent a bike, but always lock it securely and watch traffic.",
   "safety": "Beware of bike lanes; stay on the sidewalk when walking."
  }
 },
 "NO": {
  "code": "NO",
  "region": "europe",
  "capital": "Oslo",
  "intro": "A majestic Nordic kingdom where dramatic fjords, midnight sun, and the dancing aurora borealis create an outdoor enthusiast's paradise.",
  "bestSeason": "Jun–Aug & Dec–Mar",
  "currency": "Norwegian Krone (NOK)",
  "language": "Norwegian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112 police · 110 fire · 113 medical",
  "cost": {
   "budget": 120,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Geirangerfjord",
    "blurb": "Deep blue UNESCO-protected fjord surrounded by majestic snow-capped peaks and waterfalls.",
    "emoji": "🏔️"
   },
   {
    "name": "Lofoten Islands",
    "blurb": "Dramatic archipelago known for fishing villages, surfing, and northern lights displays.",
    "emoji": "🛶"
   },
   {
    "name": "Preikestolen",
    "blurb": "The iconic Pulpit Rock offering a dizzying vertical drop above Lysefjorden.",
    "emoji": "⛰️"
   },
   {
    "name": "Vigeland Park",
    "blurb": "World's largest sculpture park made by a single artist in Oslo.",
    "emoji": "🗿"
   }
  ],
  "tips": {
   "food": "Try brunost brown cheese and fresh seafood at local markets.",
   "culture": "Respect the 'Right to Roam' but always leave no trace.",
   "transport": "The rail network is scenic but booking early saves significant money.",
   "safety": "Weather changes rapidly in mountains; always carry proper waterproof gear."
  }
 },
 "NP": {
  "code": "NP",
  "region": "asia",
  "capital": "Kathmandu",
  "intro": "The roof of the world, offering spiritual temples and the planet's highest peaks for ultimate trekking adventures.",
  "bestSeason": "Oct–Nov & Mar–May",
  "currency": "Nepalese Rupee (NPR)",
  "language": "Nepali",
  "timezone": "UTC+5:45",
  "plug": "Type C/D/M · 230V",
  "emergency": "100 police · 101 fire · 102 ambulance",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Everest Base Camp",
    "blurb": "The legendary trekking destination sitting at the foot of Earth's highest mountain.",
    "emoji": "🧗"
   },
   {
    "name": "Boudhanath Stupa",
    "blurb": "Massive spherical stupa serving as a focal point for Tibetan Buddhism.",
    "emoji": "☸️"
   },
   {
    "name": "Chitwan National Park",
    "blurb": "Subtropical jungles home to one-horned rhinos and elusive Bengal tigers.",
    "emoji": "🦏"
   },
   {
    "name": "Phewa Lake",
    "blurb": "Picturesque lake in Pokhara reflecting the snow-capped Annapurna mountain range.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Dal Bhat is the staple meal; it provides sustained energy for trekking.",
   "culture": "Always walk clockwise around stupas and mani stones out of respect.",
   "transport": "Domestic flights are convenient but prone to weather-related delays and cancellations.",
   "safety": "Acclimatize slowly to prevent altitude sickness when trekking in high regions."
  }
 },
 "NR": {
  "code": "NR",
  "region": "oceania",
  "capital": "Yaren (de facto)",
  "intro": "A tiny, remote island nation in the central Pacific known for its unique phosphate cliffs and aviation history.",
  "bestSeason": "May–Oct",
  "currency": "Australian Dollar (AUD)",
  "language": "Nauruan, English",
  "timezone": "UTC+12",
  "plug": "Type I · 240V",
  "emergency": "110 police · 112 medical",
  "cost": {
   "budget": 80,
   "standard": 160,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Anibare Bay",
    "blurb": "The island's best beach with white sands and coral reef pinnacles.",
    "emoji": "🏖️"
   },
   {
    "name": "Command Ridge",
    "blurb": "Highest point featuring WWII relics and panoramic views of the island.",
    "emoji": "🔭"
   },
   {
    "name": "Buada Lagoon",
    "blurb": "A landlocked, brackish freshwater lagoon surrounded by lush tropical vegetation.",
    "emoji": "🌴"
   },
   {
    "name": "Central Plateau",
    "blurb": "Moon-like landscape formed by decades of intensive phosphate mining operations.",
    "emoji": "🌑"
   }
  ],
  "tips": {
   "food": "Fresh fish is a staple; try Chinese cuisine which is common.",
   "culture": "Nauru is conservative; dress modestly outside of beach areas.",
   "transport": "Renting a car or motorbike is the only practical way around.",
   "safety": "Sun protection is vital as the tropical sun is extremely intense."
  }
 },
 "NZ": {
  "code": "NZ",
  "region": "oceania",
  "capital": "Wellington",
  "intro": "A breathtaking island nation of cinematic landscapes, geothermal wonders, and rich Maori heritage at the edge of the world.",
  "bestSeason": "Dec–Feb & Jun–Aug",
  "currency": "New Zealand Dollar (NZD)",
  "language": "English, Maori",
  "timezone": "UTC+12 to +13",
  "plug": "Type I · 230V",
  "emergency": "111 all services",
  "cost": {
   "budget": 100,
   "standard": 220,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Milford Sound",
    "blurb": "Stunning fiord featuring Mitre Peak, rainforests, and towering cascading waterfalls.",
    "emoji": "🚢"
   },
   {
    "name": "Hobbiton Movie Set",
    "blurb": "The enchanting Shire from Middle-earth located in the rolling hills of Waikato.",
    "emoji": "🏡"
   },
   {
    "name": "Rotorua",
    "blurb": "Geothermal wonderland filled with bubbling mud pools and explosive natural fountains.",
    "emoji": "🌋"
   },
   {
    "name": "Franz Josef Glacier",
    "blurb": "Ancient river of ice descending from the Southern Alps into rainforest.",
    "emoji": "❄️"
   }
  ],
  "tips": {
   "food": "Don't miss a Hangi meal or fresh green-lipped mussels.",
   "culture": "Learn a few basic Maori greetings like 'Kia Ora' for locals.",
   "transport": "Campervans are the most popular and flexible way to explore both islands.",
   "safety": "Be strict with biosecurity; declare all food and outdoor gear on arrival."
  }
 },
 "OM": {
  "code": "OM",
  "region": "middle-east",
  "capital": "Muscat",
  "intro": "An Arabian gem where ancient forts, vast desert dunes, and a turquoise coastline preserve traditional Gulf charm.",
  "bestSeason": "Oct–Apr",
  "currency": "Omani Rial (OMR)",
  "language": "Arabic, English",
  "timezone": "UTC+4",
  "plug": "Type G · 230V",
  "emergency": "9999 all services",
  "cost": {
   "budget": 70,
   "standard": 180,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Sultan Qaboos Mosque",
    "blurb": "Architectural masterpiece featuring a massive Persian carpet and Swarovski chandelier.",
    "emoji": "🕌"
   },
   {
    "name": "Wahiba Sands",
    "blurb": "Endless longitudinal dunes perfect for glamping under the desert stars.",
    "emoji": "🏜️"
   },
   {
    "name": "Wadi Shab",
    "blurb": "Emerald pools and hidden caves accessible through a stunning canyon hike.",
    "emoji": "🏊"
   },
   {
    "name": "Nizwa Fort",
    "blurb": "17th-century castle known for its enormous drum tower and traditional souq.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Try Shuwa, slow-cooked lamb marinated in spices and buried in sand.",
   "culture": "Dress modestly in public; shoulders and knees should be covered.",
   "transport": "Renting a 4WD is essential for exploring mountains and desert wadis.",
   "safety": "Avoid hiking in wadis if there is any forecast of rain."
  }
 },
 "PA": {
  "code": "PA",
  "region": "americas",
  "capital": "Panama City",
  "intro": "The bridge between two oceans, blending ultra-modern skyscrapers with lush rainforests and incredible engineering feats.",
  "bestSeason": "Dec–Apr",
  "currency": "Balboa / US Dollar (USD)",
  "language": "Spanish",
  "timezone": "UTC-5",
  "plug": "Type A/B · 120V",
  "emergency": "911 all services",
  "cost": {
   "budget": 50,
   "standard": 130,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Panama Canal",
    "blurb": "The 'Eighth Wonder of the World' connecting the Atlantic and Pacific.",
    "emoji": "🚢"
   },
   {
    "name": "Casco Viejo",
    "blurb": "Charming colonial district with cobblestone streets and vibrant rooftop bars.",
    "emoji": "🏛️"
   },
   {
    "name": "San Blas Islands",
    "blurb": "Pristine Caribbean archipelago governed by the indigenous Guna Yala people.",
    "emoji": "🏝️"
   },
   {
    "name": "Boquete",
    "blurb": "Highland town famous for coffee plantations and the Volcan Baru hike.",
    "emoji": "☕"
   }
  ],
  "tips": {
   "food": "Sancocho is the national chicken soup; try it for authentic flavor.",
   "culture": "Panama is quite informal, but dress up for nice restaurants in the city.",
   "transport": "The Metro in Panama City is efficient and very affordable to use.",
   "safety": "Stick to tourist areas in the city; avoid the El Chorrillo neighborhood."
  }
 },
 "PE": {
  "code": "PE",
  "region": "americas",
  "capital": "Lima",
  "intro": "A land of ancient Incan mysteries, vibrant Andean textiles, and some of the world's most celebrated culinary innovations.",
  "bestSeason": "May–Oct",
  "currency": "Sol (PEN)",
  "language": "Spanish, Quechua",
  "timezone": "UTC-5",
  "plug": "Type A/C · 220V",
  "emergency": "105 police · 116 fire · 117 medical",
  "cost": {
   "budget": 40,
   "standard": 100,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Machu Picchu",
    "blurb": "The legendary Incan citadel perched high in the Andes Mountains.",
    "emoji": "⛰️"
   },
   {
    "name": "Sacred Valley",
    "blurb": "Heartland of the Inca Empire dotted with ruins and traditional markets.",
    "emoji": "🌽"
   },
   {
    "name": "Huacachina",
    "blurb": "A desert oasis surrounded by massive sand dunes for bugging and boarding.",
    "emoji": "🌵"
   },
   {
    "name": "Colca Canyon",
    "blurb": "One of the world's deepest canyons and home to giant condors.",
    "emoji": "🦅"
   }
  ],
  "tips": {
   "food": "Ceviche and Lomo Saltado are must-try dishes in the culinary capital.",
   "culture": "Always ask permission before taking photos of locals in traditional dress.",
   "transport": "Luxury buses are excellent for long distances between major cities.",
   "safety": "Be cautious with altitude; drink coca tea and rest upon arriving in Cusco."
  }
 },
 "PG": {
  "code": "PG",
  "region": "oceania",
  "capital": "Port Moresby",
  "intro": "One of the most culturally diverse places on Earth, offering rugged mountains and untouched underwater ecosystems for intrepid explorers.",
  "bestSeason": "May–Oct",
  "currency": "Kina (PGK)",
  "language": "Tok Pisin, Hiri Motu, English",
  "timezone": "UTC+10",
  "plug": "Type I · 240V",
  "emergency": "111 all services",
  "cost": {
   "budget": 90,
   "standard": 200,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Kokoda Track",
    "blurb": "Historic 96-kilometer trail through rugged, mountainous jungle and rainforest.",
    "emoji": "🥾"
   },
   {
    "name": "Tufi",
    "blurb": "Stunning 'fjords' created by ancient volcanoes, offering world-class diving.",
    "emoji": "🤿"
   },
   {
    "name": "Sepik River",
    "blurb": "The longest river in PNG, famous for its unique spirit houses.",
    "emoji": "🛶"
   },
   {
    "name": "Mt. Wilhelm",
    "blurb": "The highest peak in the country, offering challenging climbs and vistas.",
    "emoji": "🧗"
   }
  ],
  "tips": {
   "food": "Mumu is a traditional feast cooked in an earth oven.",
   "culture": "Tribal culture is complex; always travel with a reputable local guide.",
   "transport": "Air travel is the only way to reach most parts of the country.",
   "safety": "Avoid walking alone at night in Port Moresby; stay in secure hotels."
  }
 },
 "PH": {
  "code": "PH",
  "region": "asia",
  "capital": "Manila",
  "intro": "An archipelago of 7,000+ islands famed for powder-white beaches, emerald rice terraces, and incredibly friendly locals.",
  "bestSeason": "Dec–Feb",
  "currency": "Philippine Peso (PHP)",
  "language": "Filipino, English",
  "timezone": "UTC+8",
  "plug": "Type A/B/C · 220V",
  "emergency": "911 all services",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "El Nido",
    "blurb": "Breathtaking limestone karsts and turquoise lagoons in the Palawan province.",
    "emoji": "🛶"
   },
   {
    "name": "Banaue Rice Terraces",
    "blurb": "Ancient 'Stairs to Heaven' carved into the mountains by hand.",
    "emoji": "🌾"
   },
   {
    "name": "Chocolate Hills",
    "blurb": "Over 1,200 perfectly symmetrical brown hills in the heart of Bohol.",
    "emoji": "🍫"
   },
   {
    "name": "Boracay",
    "blurb": "World-famous island known for its incredibly fine, powdery White Beach.",
    "emoji": "🏖️"
   }
  ],
  "tips": {
   "food": "Try Adobo and the sweet shaved-ice dessert called Halo-Halo.",
   "culture": "Filipinos are polite; using 'po' and 'opo' shows great respect.",
   "transport": "Jeepneys are iconic and cheap for short trips in cities.",
   "safety": "Check weather reports daily during typhoon season from June to November."
  }
 },
 "PK": {
  "code": "PK",
  "region": "asia",
  "capital": "Islamabad",
  "intro": "A land of unparalleled mountain scenery, ancient silk road history, and legendary hospitality in every valley.",
  "bestSeason": "May–Oct (North) & Nov–Mar (South)",
  "currency": "Pakistani Rupee (PKR)",
  "language": "Urdu, English",
  "timezone": "UTC+5",
  "plug": "Type C/D/G/M · 230V",
  "emergency": "15 police · 16 fire · 1122 ambulance",
  "cost": {
   "budget": 25,
   "standard": 60,
   "luxury": 150
  },
  "attractions": [
   {
    "name": "Hunza Valley",
    "blurb": "Fairytale valley with terraced orchards and peaks over 7,000 meters.",
    "emoji": "🍑"
   },
   {
    "name": "Badshahi Mosque",
    "blurb": "Grand Mughal-era mosque in Lahore known for its red sandstone architecture.",
    "emoji": "🕌"
   },
   {
    "name": "K2 Base Camp",
    "blurb": "Epic trek to the foot of the world's second-highest mountain.",
    "emoji": "🏔️"
   },
   {
    "name": "Fairy Meadows",
    "blurb": "Lush green plateau offering the best views of Nanga Parbat.",
    "emoji": "🧚"
   }
  ],
  "tips": {
   "food": "Don't miss a traditional Karahi or spicy Biryani in Lahore.",
   "culture": "Dress conservatively and accept hospitality; it is central to local life.",
   "transport": "The Karakoram Highway is one of the world's most scenic drives.",
   "safety": "Check current government travel advisories for specific provincial regions."
  }
 },
 "PL": {
  "code": "PL",
  "region": "europe",
  "capital": "Warsaw",
  "intro": "A resilient nation blending medieval Old Towns, somber history, and a modern, vibrant cultural scene.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Polish Złoty (PLN)",
  "language": "Polish",
  "timezone": "UTC+1",
  "plug": "Type C/E · 230V",
  "emergency": "112 all services",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Kraków Old Town",
    "blurb": "UNESCO site with Europe's largest medieval market square and Wawel Castle.",
    "emoji": "🏰"
   },
   {
    "name": "Auschwitz-Birkenau",
    "blurb": "Important memorial and museum at the site of the former camp.",
    "emoji": "🕯️"
   },
   {
    "name": "Wieliczka Salt Mine",
    "blurb": "Subterranean world of chapels and statues carved entirely from salt.",
    "emoji": "🧂"
   },
   {
    "name": "Tatra Mountains",
    "blurb": "Alpine range on the border with Slovakia, perfect for hiking.",
    "emoji": "🏔️"
   }
  ],
  "tips": {
   "food": "Pierogi (dumplings) are a must; try different sweet and savory fillings.",
   "culture": "Punctuality is appreciated; always say 'Dzień dobry' when entering shops.",
   "transport": "Trains (PKP Intercity) are reliable and connect all major cities well.",
   "safety": "Poland is generally very safe; just watch for pickpockets in crowds."
  }
 },
 "PS": {
  "code": "PS",
  "region": "middle-east",
  "capital": "Ramallah (de facto) / East Jerusalem",
  "intro": "A land of profound religious significance, ancient olive groves, and deeply rooted traditions amidst a complex landscape.",
  "bestSeason": "Mar–May & Oct–Nov",
  "currency": "Israeli Shekel (ILS) / Jordanian Dinar (JOD)",
  "language": "Arabic",
  "timezone": "UTC+2",
  "plug": "Type C/H · 230V",
  "emergency": "100 police · 101 medical · 102 fire",
  "cost": {
   "budget": 45,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Old City of Jerusalem",
    "blurb": "Sacred sites including the Dome of the Rock and Church of Sepulchre.",
    "emoji": "🕌"
   },
   {
    "name": "Church of the Nativity",
    "blurb": "Major Christian pilgrimage site in Bethlehem built over Jesus' birthplace.",
    "emoji": "⛪"
   },
   {
    "name": "Jericho",
    "blurb": "One of the oldest continuously inhabited cities in the world.",
    "emoji": "🌴"
   },
   {
    "name": "Mar Saba Monastery",
    "blurb": "Ancient Greek Orthodox monastery built into a cliff in the desert.",
    "emoji": "🧗"
   }
  ],
  "tips": {
   "food": "Fresh falafel, hummus, and Maqluba are culinary highlights not to miss.",
   "culture": "Modest dress is required for visiting all religious and rural sites.",
   "transport": "Shared taxis known as 'servis' are the most common way to travel.",
   "safety": "Monitor local news closely and check for checkpoint closures before traveling."
  }
 },
 "PT": {
  "code": "PT",
  "region": "europe",
  "capital": "Lisbon",
  "intro": "A sun-drenched coastal gem where melancholic fado music echoes through historic cobblestone streets and golden Atlantic beaches await discovery.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Portuguese",
  "timezone": "UTC+0",
  "plug": "Type F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 55,
   "standard": 130,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Belém Tower",
    "blurb": "Iconic limestone fortification guarding the mouth of the Tagus River.",
    "emoji": "🏰"
   },
   {
    "name": "Pena Palace",
    "blurb": "A vivid, romanticist castle perched atop the misty Sintra mountains.",
    "emoji": "🎨"
   },
   {
    "name": "Ribeira District",
    "blurb": "Porto's riverside heart featuring colorful facades and world-class wine cellars.",
    "emoji": "🍷"
   },
   {
    "name": "Benagil Cave",
    "blurb": "A stunning seaside cavern accessible only by boat or kayak.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Don't miss Pastéis de Nata, the country's iconic custard tart.",
   "culture": "Locals dine late; most restaurants open for dinner after 7:30 PM.",
   "transport": "The historic yellow trams in Lisbon are charming but often crowded.",
   "safety": "Keep an eye on belongings in busy tourist spots like Baixa."
  }
 },
 "PW": {
  "code": "PW",
  "region": "oceania",
  "capital": "Ngerulmud",
  "intro": "An untouched Pacific paradise famous for its limestone islands, vibrant coral reefs, and the surreal experience of swimming with jellyfish.",
  "bestSeason": "Dec–Apr",
  "currency": "US Dollar (USD)",
  "language": "Palauan, English",
  "timezone": "UTC+9",
  "plug": "Type A/B · 120V",
  "emergency": "911",
  "cost": {
   "budget": 120,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Jellyfish Lake",
    "blurb": "Snorkel with millions of harmless, golden jellyfish in a marine lake.",
    "emoji": "🪼"
   },
   {
    "name": "Rock Islands",
    "blurb": "Emerald limestone formations surrounded by crystal-clear turquoise lagoons.",
    "emoji": "🏝️"
   },
   {
    "name": "Blue Corner",
    "blurb": "A world-renowned dive site teeming with sharks and schools of fish.",
    "emoji": "🤿"
   },
   {
    "name": "Ngardmau Falls",
    "blurb": "The tallest waterfall in Micronesia, accessible via a lush jungle trek.",
    "emoji": "🌊"
   }
  ],
  "tips": {
   "food": "Try locally caught seafood and the traditional fruit bat soup.",
   "culture": "Visitors must sign the 'Palau Pledge' stamped in their passports.",
   "transport": "Renting a car is the most reliable way to explore Babeldaob.",
   "safety": "Wear reef-safe sunscreen to protect the delicate marine ecosystems."
  }
 },
 "PY": {
  "code": "PY",
  "region": "americas",
  "capital": "Asunción",
  "intro": "The 'Heart of South America' offers an authentic and off-the-beaten-path experience through its colonial history and vast wilderness.",
  "bestSeason": "May–Sep",
  "currency": "Guarani (PYG)",
  "language": "Spanish, Guaraní",
  "timezone": "UTC-4",
  "plug": "Type C · 220V",
  "emergency": "911",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Itaipu Dam",
    "blurb": "One of the world's largest hydroelectric power plants and engineering marvels.",
    "emoji": "⚡"
   },
   {
    "name": "Jesuit Missions",
    "blurb": "Well-preserved 17th-century ruins showcasing a unique blend of cultures.",
    "emoji": "⛪"
   },
   {
    "name": "The Pantanal",
    "blurb": "Expansive tropical wetlands perfect for spotting diverse South American wildlife.",
    "emoji": "🐆"
   },
   {
    "name": "Panteón de los Héroes",
    "blurb": "A solemn architectural landmark honoring the nation's fallen historical figures.",
    "emoji": "🏛️"
   }
  ],
  "tips": {
   "food": "Sharing Tereré, an iced herbal tea, is a vital social ritual.",
   "culture": "Learning a few words in Guaraní will earn you great respect.",
   "transport": "Buses are the main way to travel between major towns.",
   "safety": "Stick to well-lit areas in Asunción during the evening hours."
  }
 },
 "QA": {
  "code": "QA",
  "region": "middle-east",
  "capital": "Doha",
  "intro": "Where futuristic skyscrapers meet ancient desert traditions, offering luxury shopping, stunning architecture, and warm Arabian hospitality.",
  "bestSeason": "Nov–Mar",
  "currency": "Qatari Riyal (QAR)",
  "language": "Arabic, English",
  "timezone": "UTC+3",
  "plug": "Type G · 240V",
  "emergency": "999",
  "cost": {
   "budget": 80,
   "standard": 200,
   "luxury": 550
  },
  "attractions": [
   {
    "name": "Museum of Islamic Art",
    "blurb": "I.M. Pei-designed masterpiece housing centuries of precious Islamic artifacts.",
    "emoji": "🖼️"
   },
   {
    "name": "Souq Waqif",
    "blurb": "Traditional market filled with spices, textiles, and falconry displays.",
    "emoji": "🐪"
   },
   {
    "name": "The Pearl-Qatar",
    "blurb": "An artificial island featuring Mediterranean-style yacht-lined boardwalks and villas.",
    "emoji": "🛥️"
   },
   {
    "name": "Khor Al Adaid",
    "blurb": "The 'Inland Sea' where towering sand dunes meet the ocean.",
    "emoji": "🏜️"
   }
  ],
  "tips": {
   "food": "Try Machboos, a fragrant spiced rice dish with meat.",
   "culture": "Dress modestly in public areas, covering shoulders and knees.",
   "transport": "The Doha Metro is clean, fast, and very cost-effective.",
   "safety": "Qatar is consistently ranked as one of the safest countries globally."
  }
 },
 "RO": {
  "code": "RO",
  "region": "europe",
  "capital": "Bucharest",
  "intro": "A land of breathtaking Carpathian peaks, medieval Saxon towns, and the legend-infused castles of misty Transylvania.",
  "bestSeason": "May–Jun & Sep–Oct",
  "currency": "Romanian Leu (RON)",
  "language": "Romanian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 45,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Bran Castle",
    "blurb": "The dramatic hilltop fortress famously associated with the Dracula legend.",
    "emoji": "🧛"
   },
   {
    "name": "Peleș Castle",
    "blurb": "Neo-Renaissance masterpiece nestled in the mountains near Sinaia.",
    "emoji": "🏰"
   },
   {
    "name": "Transfăgărășan",
    "blurb": "A winding mountain road offering some of Europe's most spectacular views.",
    "emoji": "🛣️"
   },
   {
    "name": "Danube Delta",
    "blurb": "A UNESCO biosphere reserve teeming with rare birds and wildlife.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Sample Sarmale—cabbage rolls stuffed with meat and rice.",
   "culture": "Romanians are very hospitable; small gifts are appreciated when visiting homes.",
   "transport": "Trains are scenic for long distances but can be quite slow.",
   "safety": "Be cautious of pickpockets in crowded Bucharest transit hubs."
  }
 },
 "RS": {
  "code": "RS",
  "region": "europe",
  "capital": "Belgrade",
  "intro": "Dynamic Belgrade meets tranquil monasteries and rugged nature in this spirited Balkan crossroads of history and nightlife.",
  "bestSeason": "May–Sep",
  "currency": "Serbian Dinar (RSD)",
  "language": "Serbian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "192 police · 193 fire · 194 med",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Belgrade Fortress",
    "blurb": "Historic citadel overlooking the confluence of the Sava and Danube.",
    "emoji": "🧱"
   },
   {
    "name": "Church of Saint Sava",
    "blurb": "One of the largest Orthodox church buildings in the world.",
    "emoji": "⛪"
   },
   {
    "name": "Uvac Canyon",
    "blurb": "Spectacular river meanders known for griffon vulture sightings.",
    "emoji": "🦅"
   },
   {
    "name": "Studenica Monastery",
    "blurb": "UNESCO-listed site featuring exceptional 13th-century Byzantine frescoes.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Try Ćevapi, grilled minced meat sausages, with flatbread and onions.",
   "culture": "Coffee culture is huge; expect long, leisurely sessions at cafes.",
   "transport": "Intercity buses are generally more reliable and frequent than trains.",
   "safety": "Avoid discussing sensitive 1990s political history with strangers."
  }
 },
 "RU": {
  "code": "RU",
  "region": "europe",
  "capital": "Moscow",
  "intro": "The world's largest nation spans eleven time zones, featuring imperial palaces, the Trans-Siberian railway, and deep literary traditions.",
  "bestSeason": "Jun–Aug",
  "currency": "Russian Ruble (RUB)",
  "language": "Russian",
  "timezone": "UTC+2 to +12",
  "plug": "Type C/F · 220V",
  "emergency": "112",
  "cost": {
   "budget": 45,
   "standard": 110,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Red Square",
    "blurb": "The historic heart of Moscow, flanked by the Kremlin and GUM.",
    "emoji": "🚩"
   },
   {
    "name": "Hermitage Museum",
    "blurb": "A massive St. Petersburg art treasury spanning multiple imperial buildings.",
    "emoji": "🖼️"
   },
   {
    "name": "Lake Baikal",
    "blurb": "The world's deepest freshwater lake, stunning in both summer and winter.",
    "emoji": "❄️"
   },
   {
    "name": "St. Basil's Cathedral",
    "blurb": "Iconic, colorful onion domes dominating the Moscow skyline.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Borscht and pelmeni are staples; try them with sour cream.",
   "culture": "Always take your shoes off when entering someone's home.",
   "transport": "The Moscow Metro is an art gallery and efficient transit system.",
   "safety": "Always carry your passport and visa registration documents with you."
  }
 },
 "RW": {
  "code": "RW",
  "region": "africa",
  "capital": "Kigali",
  "intro": "The 'Land of a Thousand Hills' is a clean, green, and inspiring destination famous for its rare mountain gorillas.",
  "bestSeason": "Jun–Sep",
  "currency": "Rwandan Franc (RWF)",
  "language": "Kinyarwanda, French, English",
  "timezone": "UTC+2",
  "plug": "Type C/J · 230V",
  "emergency": "112",
  "cost": {
   "budget": 50,
   "standard": 150,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Volcanoes National Park",
    "blurb": "Prime location for life-changing encounters with wild mountain gorillas.",
    "emoji": "🦍"
   },
   {
    "name": "Kigali Genocide Memorial",
    "blurb": "A moving tribute and educational center honoring the nation's past.",
    "emoji": "🕯️"
   },
   {
    "name": "Nyungwe Forest",
    "blurb": "Ancient rainforest offering canopy walks and chimpanzee trekking.",
    "emoji": "🌿"
   },
   {
    "name": "Lake Kivu",
    "blurb": "One of Africa's Great Lakes, perfect for relaxation and kayaking.",
    "emoji": "⛵"
   }
  ],
  "tips": {
   "food": "Try Brochettes (grilled meat skewers) found at almost every local bar.",
   "culture": "Plastic bags are banned; don't bring them into the country.",
   "transport": "Moto-taxis are the fastest way to get around Kigali.",
   "safety": "Rwanda is one of the safest and cleanest countries in Africa."
  }
 },
 "SA": {
  "code": "SA",
  "region": "middle-east",
  "capital": "Riyadh",
  "intro": "A rapidly transforming kingdom opening its doors to show off hidden Nabataean cities and spectacular desert landscapes.",
  "bestSeason": "Nov–Feb",
  "currency": "Saudi Riyal (SAR)",
  "language": "Arabic",
  "timezone": "UTC+3",
  "plug": "Type G · 230V",
  "emergency": "911",
  "cost": {
   "budget": 90,
   "standard": 220,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Hegra (Al-Ula)",
    "blurb": "Stunning Nabataean tombs carved into desert rocks, similar to Petra.",
    "emoji": "🏛️"
   },
   {
    "name": "Edge of the World",
    "blurb": "Dramatic cliffs providing endless views across the rocky desert floor.",
    "emoji": "🏜️"
   },
   {
    "name": "Al-Balad",
    "blurb": "The historic heart of Jeddah with traditional coral-stone architecture.",
    "emoji": "🏠"
   },
   {
    "name": "Kingdom Centre",
    "blurb": "Iconic skyscraper in Riyadh with a high-altitude Sky Bridge.",
    "emoji": "🏙️"
   }
  ],
  "tips": {
   "food": "Kabsa, a spicy rice and meat dish, is the national favorite.",
   "culture": "Respect local prayer times when shops and restaurants may briefly close.",
   "transport": "The new high-speed train connects Mecca, Medina, and Jeddah efficiently.",
   "safety": "Follow local laws strictly; public behavior is regulated by social codes."
  }
 },
 "SB": {
  "code": "SB",
  "region": "oceania",
  "capital": "Honiara",
  "intro": "A spectacular archipelago for adventurers, offering world-class diving among WWII wrecks and pristine coral reefs.",
  "bestSeason": "May–Oct",
  "currency": "Solomon Islands Dollar (SBD)",
  "language": "English, Pijin",
  "timezone": "UTC+11",
  "plug": "Type G · 240V",
  "emergency": "999",
  "cost": {
   "budget": 70,
   "standard": 160,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Iron Bottom Sound",
    "blurb": "Famous site of numerous WWII shipwrecks and plane wrecks.",
    "emoji": "🚢"
   },
   {
    "name": "Marovo Lagoon",
    "blurb": "The world's largest saltwater lagoon, dotted with hundreds of islets.",
    "emoji": "🏝️"
   },
   {
    "name": "Kennedy Island",
    "blurb": "The small island where JFK was stranded during World War II.",
    "emoji": "🇺🇸"
   },
   {
    "name": "Tenaru Falls",
    "blurb": "A spectacular 60-meter waterfall reached via a scenic river hike.",
    "emoji": "💦"
   }
  ],
  "tips": {
   "food": "Cassava and sweet potatoes are staples served with fresh fish.",
   "culture": "Custom (Kastom) is very important; always ask before taking photos.",
   "transport": "Inter-island travel is primarily done by small planes or boats.",
   "safety": "Malaria is present; take appropriate medical precautions before visiting."
  }
 },
 "SC": {
  "code": "SC",
  "region": "africa",
  "capital": "Victoria",
  "intro": "An idyllic archipelago of 115 islands featuring granite boulders, turquoise waters, and some of the world's best beaches.",
  "bestSeason": "Apr–May & Oct–Nov",
  "currency": "Seychellois Rupee (SCR)",
  "language": "Creole, English, French",
  "timezone": "UTC+4",
  "plug": "Type G · 240V",
  "emergency": "999",
  "cost": {
   "budget": 150,
   "standard": 350,
   "luxury": 900
  },
  "attractions": [
   {
    "name": "Anse Source d'Argent",
    "blurb": "Breathtaking beach famous for its unique pink sand and granite boulders.",
    "emoji": "📸"
   },
   {
    "name": "Vallée de Mai",
    "blurb": "UNESCO-listed prehistoric forest, home to the rare Coco de Mer.",
    "emoji": "🥥"
   },
   {
    "name": "Aldabra Atoll",
    "blurb": "Remote wildlife haven hosting the world's largest population of giant tortoises.",
    "emoji": "🐢"
   },
   {
    "name": "Beau Vallon",
    "blurb": "A popular, vibrant bay on Mahé ideal for swimming and watersports.",
    "emoji": "🏊"
   }
  ],
  "tips": {
   "food": "Try grilled fish seasoned with chili, ginger, and garlic.",
   "culture": "The pace is slow; embrace 'island time' and stay relaxed.",
   "transport": "Ferries are the main way to travel between Mahé, Praslin, and La Digue.",
   "safety": "Be wary of strong currents when swimming at unguarded beaches."
  }
 },
 "SD": {
  "code": "SD",
  "region": "africa",
  "capital": "Khartoum",
  "intro": "A land of ancient archaeological wonders, featuring more pyramids than Egypt and the merging points of the mighty Nile.",
  "bestSeason": "Nov–Feb",
  "currency": "Sudanese Pound (SDG)",
  "language": "Arabic, English",
  "timezone": "UTC+2",
  "plug": "Type C/D · 230V",
  "emergency": "999",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Meroë Pyramids",
    "blurb": "Dozens of ancient, steep-sided pyramids rise from the desert sands.",
    "emoji": "📐"
   },
   {
    "name": "Jebel Barkal",
    "blurb": "A sacred sandstone mountain housing ancient temples and ruins.",
    "emoji": "⛰️"
   },
   {
    "name": "Blue and White Nile",
    "blurb": "The dramatic confluence where the two great rivers finally meet.",
    "emoji": "🌊"
   },
   {
    "name": "Sanganeb Marine Park",
    "blurb": "Pristine Red Sea coral reefs and a historic offshore lighthouse.",
    "emoji": "🐚"
   }
  ],
  "tips": {
   "food": "Ful Medames (mashed fava beans) is a hearty, common breakfast dish.",
   "culture": "Hospitality is extreme; locals often invite travelers for tea or meals.",
   "transport": "Travel between cities is mostly via long-distance buses or minibuses.",
   "safety": "Check current travel advisories due to ongoing political and civil instability."
  }
 },
 "SE": {
  "code": "SE",
  "region": "europe",
  "capital": "Stockholm",
  "intro": "A bastion of Scandinavian style where pristine archipelagos, medieval towns, and the magical Aurora Borealis define the landscape.",
  "bestSeason": "Jun–Aug & Dec–Feb",
  "currency": "Swedish Krona (SEK)",
  "language": "Swedish",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 90,
   "standard": 190,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Vasa Museum",
    "blurb": "A stunningly preserved 17th-century warship housed in a massive museum.",
    "emoji": "⚓"
   },
   {
    "name": "Gamla Stan",
    "blurb": "Stockholm's vibrant old town filled with colorful buildings and cobblestones.",
    "emoji": "🏰"
   },
   {
    "name": "ICEHOTEL",
    "blurb": "World-famous hotel rebuilt every winter entirely from river ice and snow.",
    "emoji": "❄️"
   },
   {
    "name": "Abisko National Park",
    "blurb": "One of the best places on Earth to witness the Northern Lights.",
    "emoji": "🌌"
   }
  ],
  "tips": {
   "food": "Embrace 'Fika' with coffee and a cinnamon bun daily.",
   "culture": "Respect 'Lagom', the Swedish philosophy of 'just the right amount'.",
   "transport": "The efficient SJ trains connect major cities comfortably and quickly.",
   "safety": "Sweden is exceptionally safe, but always watch out for cyclists."
  }
 },
 "SG": {
  "code": "SG",
  "region": "asia",
  "capital": "Singapore",
  "intro": "A futuristic city-state where soaring supertrees and colonial architecture meet world-class dining in a lush tropical garden setting.",
  "bestSeason": "Feb–Apr",
  "currency": "Singapore Dollar (SGD)",
  "language": "English, Mandarin, Malay",
  "timezone": "UTC+8",
  "plug": "Type G · 230V",
  "emergency": "999 police · 995 fire/EMS",
  "cost": {
   "budget": 80,
   "standard": 200,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Gardens by the Bay",
    "blurb": "Mesmerizing vertical gardens and massive climate-controlled flower domes.",
    "emoji": "🌳"
   },
   {
    "name": "Marina Bay Sands",
    "blurb": "Iconic resort featuring the world's largest rooftop infinity pool.",
    "emoji": "🏨"
   },
   {
    "name": "Sentosa Island",
    "blurb": "Island resort with theme parks, beaches, and luxury golf courses.",
    "emoji": "🎡"
   },
   {
    "name": "Jewel Changi",
    "blurb": "Stunning airport complex featuring a massive indoor waterfall.",
    "emoji": "✈️"
   }
  ],
  "tips": {
   "food": "Visit hawker centers for cheap, Michelin-star quality street food.",
   "culture": "Strict laws ensure cleanliness; avoid chewing gum or littering.",
   "transport": "The MRT is incredibly clean, fast, and covers the entire city.",
   "safety": "Singapore is one of the safest cities in the world."
  }
 },
 "SI": {
  "code": "SI",
  "region": "europe",
  "capital": "Ljubljana",
  "intro": "Europe’s hidden green gem, offering alpine peaks, turquoise rivers, and a fairy-tale lake within a single hour's drive.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "Slovenian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "112",
  "cost": {
   "budget": 65,
   "standard": 130,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Lake Bled",
    "blurb": "Picturesque emerald lake featuring a church on a tiny central island.",
    "emoji": "⛵"
   },
   {
    "name": "Postojna Cave",
    "blurb": "Subterranean world of karst formations explored via an underground train.",
    "emoji": "🦇"
   },
   {
    "name": "Piran",
    "blurb": "Atmospheric Venetian-style town on the narrow Adriatic coastline.",
    "emoji": "🏘️"
   },
   {
    "name": "Vršič Pass",
    "blurb": "High mountain road with 50 hairpin turns and breathtaking views.",
    "emoji": "🏔️"
   }
  ],
  "tips": {
   "food": "Try Bled Cream Cake, a local puff pastry layers and custard.",
   "culture": "Slovenians love the outdoors; pack hiking gear for every trip.",
   "transport": "Renting a car is the best way to see the countryside.",
   "safety": "The country is peaceful and very safe even at night."
  }
 },
 "SK": {
  "code": "SK",
  "region": "europe",
  "capital": "Bratislava",
  "intro": "A land of rugged mountains and the highest density of castles per capita in the world.",
  "bestSeason": "May–Sep & Dec",
  "currency": "Euro (EUR)",
  "language": "Slovak",
  "timezone": "UTC+1",
  "plug": "Type E · 230V",
  "emergency": "112",
  "cost": {
   "budget": 60,
   "standard": 120,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Spiš Castle",
    "blurb": "One of Central Europe's largest castle ruins and a UNESCO site.",
    "emoji": "🏰"
   },
   {
    "name": "High Tatras",
    "blurb": "Majestic mountain range perfect for hiking and winter skiing.",
    "emoji": "🏔️"
   },
   {
    "name": "Bratislava Old Town",
    "blurb": "Charming pedestrian zone with quirky statues and lively cafes.",
    "emoji": "🌆"
   },
   {
    "name": "Dobšiná Ice Cave",
    "blurb": "Magnificent ice formations in one of the world's deepest caves.",
    "emoji": "❄️"
   }
  ],
  "tips": {
   "food": "Eat Bryndzové halušky, potato dumplings with sheep cheese and bacon.",
   "culture": "Greeting with 'Dobrý deň' is expected when entering shops.",
   "transport": "Trains are reliable and free for students and seniors from EU.",
   "safety": "Stick to lit areas in cities; mountainous terrain requires caution."
  }
 },
 "SL": {
  "code": "SL",
  "region": "africa",
  "capital": "Freetown",
  "intro": "A West African treasure boasting palm-fringed white beaches, lush rainforests, and a powerful history of resilience.",
  "bestSeason": "Nov–Apr",
  "currency": "Leone (SLE)",
  "language": "English, Krio",
  "timezone": "UTC+0",
  "plug": "Type G · 230V",
  "emergency": "999",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Bunce Island",
    "blurb": "Historic site of a massive 18th-century British slave trading castle.",
    "emoji": "⛓️"
   },
   {
    "name": "River Number Two Beach",
    "blurb": "Stunning pure-white sand beach where mountains meet the Atlantic Ocean.",
    "emoji": "🏖️"
   },
   {
    "name": "Tiwai Island",
    "blurb": "Rainforest wildlife sanctuary home to rare pygmy hippos and monkeys.",
    "emoji": "🐒"
   },
   {
    "name": "Tacugama Sanctuary",
    "blurb": "World-renowned rescue center for orphaned and confiscated chimpanzees.",
    "emoji": "🦍"
   }
  ],
  "tips": {
   "food": "Planted-based stews like potato leaf or cassava leaf are staples.",
   "culture": "Always ask permission before taking photos of local people.",
   "transport": "Poda-podas (minibuses) are the common way to travel between towns.",
   "safety": "Travel in daylight and keep valuables out of sight."
  }
 },
 "SM": {
  "code": "SM",
  "region": "europe",
  "capital": "San Marino",
  "intro": "The world's oldest republic, perched atop Mount Titano, offering sweeping Italian vistas and medieval fortifications.",
  "bestSeason": "Apr–Jun & Sep",
  "currency": "Euro (EUR)",
  "language": "Italian",
  "timezone": "UTC+1",
  "plug": "Type C/F/L · 230V",
  "emergency": "112",
  "cost": {
   "budget": 75,
   "standard": 150,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Guaita Tower",
    "blurb": "The oldest and most famous of the three peaks' fortresses.",
    "emoji": "🏰"
   },
   {
    "name": "Mount Titano",
    "blurb": "Highest point in San Marino offering incredible views of Italy.",
    "emoji": "⛰️"
   },
   {
    "name": "Palazzo Pubblico",
    "blurb": "Official town hall and government building with beautiful architecture.",
    "emoji": "🏛️"
   },
   {
    "name": "Cesta Tower",
    "blurb": "Second tower housing a museum of ancient weapons and armor.",
    "emoji": "⚔️"
   }
  ],
  "tips": {
   "food": "Try 'Torta Tre Monti', a delicious local wafer layer cake.",
   "culture": "Don't call citizens 'Italian'; they are very proud Sammarinese.",
   "transport": "The cable car from Borgo Maggiore offers the best views.",
   "safety": "Crime is virtually non-existent in this microstate."
  }
 },
 "SN": {
  "code": "SN",
  "region": "africa",
  "capital": "Dakar",
  "intro": "A vibrant hub of Teranga hospitality, renowned for its soulful music, colorful markets, and Pink Lake.",
  "bestSeason": "Nov–May",
  "currency": "West African CFA Franc (XOF)",
  "language": "French, Wolof",
  "timezone": "UTC+0",
  "plug": "Type C/D/E/K · 230V",
  "emergency": "17 police · 18 fire",
  "cost": {
   "budget": 45,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Gorée Island",
    "blurb": "Emotional memorial to the Atlantic slave trade with colorful colonial houses.",
    "emoji": "🛳️"
   },
   {
    "name": "Lake Retba",
    "blurb": "A vivid pink lake caused by high salt content and algae.",
    "emoji": "🌸"
   },
   {
    "name": "African Renaissance Monument",
    "blurb": "The tallest statue in Africa, towering over the city of Dakar.",
    "emoji": "🗽"
   },
   {
    "name": "Bandia Reserve",
    "blurb": "Wild animal sanctuary home to rhinos, giraffes, and zebras.",
    "emoji": "🦒"
   }
  ],
  "tips": {
   "food": "Taste Thieboudienne, the national dish of fish and rice.",
   "culture": "Teranga means hospitality; locals are exceptionally welcoming to guests.",
   "transport": "Taxis are plentiful in Dakar; negotiate the fare before starting.",
   "safety": "Beware of pickpockets in crowded markets like Marché Sandaga."
  }
 },
 "SO": {
  "code": "SO",
  "region": "africa",
  "capital": "Mogadishu",
  "intro": "A nation with the longest coastline in Africa, featuring ancient coral stone ruins and pristine white beaches.",
  "bestSeason": "Dec–Feb",
  "currency": "Somali Shilling (SOS)",
  "language": "Somali, Arabic",
  "timezone": "UTC+3",
  "plug": "Type C/G · 240V",
  "emergency": "888 police · 999 fire",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Laas Geel",
    "blurb": "Incredible prehistoric Neolithic rock art located in Somaliland.",
    "emoji": "🎨"
   },
   {
    "name": "Lido Beach",
    "blurb": "Popluar beach in Mogadishu reflecting the city's reviving social life.",
    "emoji": "🏖️"
   },
   {
    "name": "Berbera",
    "blurb": "Historic port town with Ottoman architectural influences and beaches.",
    "emoji": "⚓"
   },
   {
    "name": "Mogadishu Cathedral",
    "blurb": "Remnants of Italian colonial architecture in the heart of the city.",
    "emoji": "⛪"
   }
  ],
  "tips": {
   "food": "Enjoy 'Sabaayad' flatbread and spiced camel meat for breakfast.",
   "culture": "Dress very conservatively and respect Islamic customs at all times.",
   "transport": "Travel generally requires private security or organized tour escorts.",
   "safety": "Check travel advisories; many regions remain volatile for visitors."
  }
 },
 "SR": {
  "code": "SR",
  "region": "americas",
  "capital": "Paramaribo",
  "intro": "A multicultural South American secret covered in dense Amazonian rainforest and colonial Dutch architecture.",
  "bestSeason": "Feb–Apr & Aug–Nov",
  "currency": "Surinamese Dollar (SRD)",
  "language": "Dutch, Sranan Tongo",
  "timezone": "UTC-3",
  "plug": "Type A/B/C/F · 127V/220V",
  "emergency": "115",
  "cost": {
   "budget": 45,
   "standard": 95,
   "luxury": 260
  },
  "attractions": [
   {
    "name": "Historic Inner City",
    "blurb": "Unique UNESCO-listed wooden Dutch colonial buildings and cathedrals.",
    "emoji": "🪵"
   },
   {
    "name": "Central Suriname Reserve",
    "blurb": "Massive rainforest area with monkeys, jaguars, and granite monoliths.",
    "emoji": "🐆"
   },
   {
    "name": "Galibi Nature Reserve",
    "blurb": "Crucial nesting site for giant leatherback and green sea turtles.",
    "emoji": "🐢"
   },
   {
    "name": "Fort Zeelandia",
    "blurb": "17th-century fortress on the river that shaped the nation’s history.",
    "emoji": "🛡️"
   }
  ],
  "tips": {
   "food": "Try Pom, a unique Jewish-Surinamese oven dish with taro root.",
   "culture": "The country is a melting pot of Indian, Javanese, and African.",
   "transport": "Small boats (korjaals) are essential for reaching interior villages.",
   "safety": "Avoid walking alone in Paramaribo after dark; use taxis."
  }
 },
 "SS": {
  "code": "SS",
  "region": "africa",
  "capital": "Juba",
  "intro": "The world's youngest nation, home to the vast Sudd wetlands and magnificent wildlife migrations.",
  "bestSeason": "Nov–Jan",
  "currency": "South Sudanese Pound (SSP)",
  "language": "English, Arabic",
  "timezone": "UTC+2",
  "plug": "Type C/D/G · 230V",
  "emergency": "999",
  "cost": {
   "budget": 50,
   "standard": 110,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Boma National Park",
    "blurb": "Host to one of the largest mammal migrations on the planet.",
    "emoji": "🦌"
   },
   {
    "name": "Nimule National Park",
    "blurb": "Scenic park where the White Nile creates dramatic rapids.",
    "emoji": "🌊"
   },
   {
    "name": "The Sudd",
    "blurb": "One of the largest freshwater wetlands in the world.",
    "emoji": "🛶"
   },
   {
    "name": "Juba Market",
    "blurb": "Bustling center of trade and daily life in the capital.",
    "emoji": "🧺"
   }
  ],
  "tips": {
   "food": "Traditional meals often center around sorghum or maize 'Asida'.",
   "culture": "Hospitality is deeply rooted; many people are eager to share stories.",
   "transport": "Roads are poor; domestic flights are the most reliable travel.",
   "safety": "Extreme caution is required; consult your embassy before visiting."
  }
 },
 "ST": {
  "code": "ST",
  "region": "africa",
  "capital": "São Tomé",
  "intro": "An emerald island paradise of volcanic peaks, cocoa plantations, and some of the world's rarest birds.",
  "bestSeason": "Jun–Sep",
  "currency": "Dobra (STN)",
  "language": "Portuguese",
  "timezone": "UTC+0",
  "plug": "Type C/F · 220V",
  "emergency": "112",
  "cost": {
   "budget": 55,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Cao Grande Peak",
    "blurb": "A dramatic needle-shaped volcanic plug rising above the rainforest.",
    "emoji": "⛰️"
   },
   {
    "name": "Lagoa Azul",
    "blurb": "Sparkling blue lagoon perfect for snorkeling and seeing baobab trees.",
    "emoji": "🏝️"
   },
   {
    "name": "Roça Agostinho Neto",
    "blurb": "Grand, historic cocoa plantation showing the islands' colonial past.",
    "emoji": "🍫"
   },
   {
    "name": "Banana Beach",
    "blurb": "Iconic crescent-shaped beach famous for its beauty and tranquility.",
    "emoji": "🍌"
   }
  ],
  "tips": {
   "food": "Don't miss the local chocolate, considered some of the world's best.",
   "culture": "The pace of life is 'Leve Leve' (slowly, slowly).",
   "transport": "Yellow taxis are common; motorbikes are preferred for remote areas.",
   "safety": "Generally very safe, but beware of strong Atlantic currents."
  }
 },
 "SV": {
  "code": "SV",
  "region": "americas",
  "capital": "San Salvador",
  "intro": "The land of volcanoes and world-class surf, packing immense natural beauty into Central America’s smallest nation.",
  "bestSeason": "Nov–Apr",
  "currency": "US Dollar / Bitcoin",
  "language": "Spanish",
  "timezone": "UTC-6",
  "plug": "Type A/B · 115V",
  "emergency": "911",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 210
  },
  "attractions": [
   {
    "name": "Santa Ana Volcano",
    "blurb": "Hike to the turquoise sulfur crater lake at the summit.",
    "emoji": "🌋"
   },
   {
    "name": "El Tunco",
    "blurb": "Famous black sand beach known for its legendary surf breaks.",
    "emoji": "🏄"
   },
   {
    "name": "Joya de Cerén",
    "blurb": "The 'Pompeii of the Americas', a preserved Mayan farming village.",
    "emoji": "🏺"
   },
   {
    "name": "Ruta de las Flores",
    "blurb": "Scenic route through colorful colonial towns and coffee plantations.",
    "emoji": "🌸"
   }
  ],
  "tips": {
   "food": "Eat Pupusas daily—thick corn tortillas stuffed with cheese and beans.",
   "culture": "People are warm and hard-working; a polite 'Buenos días' goes far.",
   "transport": "Chicken buses are cheap but 'Uber' is safer in the capital.",
   "safety": "Security has improved significantly, but avoid remote areas at night."
  }
 },
 "SY": {
  "code": "SY",
  "region": "middle-east",
  "capital": "Damascus",
  "intro": "One of Earth's oldest civilizations, Syria offers layers of history from Roman ruins to legendary souks and ancient desert citadels.",
  "bestSeason": "Mar–May & Sep–Nov",
  "currency": "Syrian Pound (SYP)",
  "language": "Arabic",
  "timezone": "UTC+3",
  "plug": "Type C/E/L · 220V",
  "emergency": "110 Police · 113 Fire · 110 Medical",
  "cost": {
   "budget": 25,
   "standard": 60,
   "luxury": 150
  },
  "attractions": [
   {
    "name": "Old City of Damascus",
    "blurb": "Wander the ancient Umayyad Mosque and bustling spice markets of the capital.",
    "emoji": "🕌"
   },
   {
    "name": "Palmyra",
    "blurb": "Marvel at the majestic remains of a once-mighty Roman caravan city.",
    "emoji": "🏛️"
   },
   {
    "name": "Krak des Chevaliers",
    "blurb": "Explore one of the world's most impressive preserved medieval Crusader castles.",
    "emoji": "🏰"
   },
   {
    "name": "Citadel of Aleppo",
    "blurb": "Visit the imposing fortification overlooking a city steeped in Silk Road history.",
    "emoji": "🛡️"
   }
  ],
  "tips": {
   "food": "Sample authentic kibbeh and muhammara from traditional Levantine eateries.",
   "culture": "Respect local customs by dressing modestly and asking before taking photos.",
   "transport": "Share taxis and minibuses are the primary means for intercity travel.",
   "safety": "Check current government travel advisories due to ongoing security concerns."
  }
 },
 "SZ": {
  "code": "SZ",
  "region": "africa",
  "capital": "Mbabane",
  "intro": "The Kingdom of Eswatini captivates visitors with rich royal traditions, stunning mountain landscapes, and exceptional wildlife encounters.",
  "bestSeason": "May–Sep",
  "currency": "Swazi Lilangeni (SZL)",
  "language": "Swati, English",
  "timezone": "UTC+2",
  "plug": "Type M · 230V",
  "emergency": "999 Police · 933 Fire · 977 Ambulance",
  "cost": {
   "budget": 40,
   "standard": 90,
   "luxury": 220
  },
  "attractions": [
   {
    "name": "Hlane Royal National Park",
    "blurb": "Spot white rhinos and lions in the kingdom's largest protected area.",
    "emoji": "🦏"
   },
   {
    "name": "Mlilwane Wildlife Sanctuary",
    "blurb": "Enjoy hiking or mountain biking among zebras in a peaceful valley.",
    "emoji": "🦓"
   },
   {
    "name": "Mantenga Cultural Village",
    "blurb": "Experience traditional Swazi dancing and see authentic beehive-style huts.",
    "emoji": "💃"
   },
   {
    "name": "Ngwenya Glass",
    "blurb": "Watch skilled artisans create beautiful glassware from 100% recycled materials.",
    "emoji": "🍷"
   }
  ],
  "tips": {
   "food": "Try Sishwala, a thick porridge often served with meat or vegetables.",
   "culture": "Respect the monarchy and attend festivals like Umhlanga if timing aligns.",
   "transport": "Renting a car is the best way to explore remote parks safely.",
   "safety": "Be cautious driving at night due to livestock on the roads."
  }
 },
 "TD": {
  "code": "TD",
  "region": "africa",
  "capital": "N'Djamena",
  "intro": "A land of raw Saharan beauty, Chad features dramatic desert peaks, ancient rock art, and the life-giving waters of Lake Chad.",
  "bestSeason": "Nov–Feb",
  "currency": "Central African CFA Franc (XAF)",
  "language": "French, Arabic",
  "timezone": "UTC+1",
  "plug": "Type C/D/E/F · 220V",
  "emergency": "17 Police · 18 Fire · 2251-2366 Ambulance",
  "cost": {
   "budget": 50,
   "standard": 130,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Tibesti Mountains",
    "blurb": "Trek through spectacular volcanic peaks rising from the Sahara Desert.",
    "emoji": "🌋"
   },
   {
    "name": "Ennedi Massif",
    "blurb": "Discover incredible natural sandstone arches and prehistoric cave paintings.",
    "emoji": "🎨"
   },
   {
    "name": "Zakouma National Park",
    "blurb": "Observe diverse wildlife thriving in one of Africa's conservation success stories.",
    "emoji": "🐘"
   },
   {
    "name": "Lake Chad",
    "blurb": "Visit the shrinking remains of a historically massive freshwater lake.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Expect meals based on millet, sorghum, and grilled goat or fish.",
   "culture": "Photography requires a permit; always seek permission before filming people.",
   "transport": "Serious travel requires a sturdy 4x4 and a professional local guide.",
   "safety": "Avoid border regions and monitor political stability before planning your trip."
  }
 },
 "TG": {
  "code": "TG",
  "region": "africa",
  "capital": "Lomé",
  "intro": "Togo blends palm-fringed Atlantic beaches with hilly interior forests and the mysterious traditions of West African voodoo culture.",
  "bestSeason": "Nov–Feb",
  "currency": "West African CFA Franc (XOF)",
  "language": "French, Ewe, Kabye",
  "timezone": "UTC+0",
  "plug": "Type C · 220V",
  "emergency": "117 Police · 118 Fire · 8202 Ambulance",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Akodessewa Fetish Market",
    "blurb": "Explore the world's largest voodoo market for spiritual curiosities and remedies.",
    "emoji": "💀"
   },
   {
    "name": "Koutammakou",
    "blurb": "See the iconic mud tower-houses of the Batammariba people in Tamberma.",
    "emoji": "🛖"
   },
   {
    "name": "Lake Togo",
    "blurb": "Take a pirogue to Agbodrafo for a peaceful day on the water.",
    "emoji": "⛵"
   },
   {
    "name": "Fazao-Malfakassa Park",
    "blurb": "Hike through Togo's largest national park featuring diverse forest ecosystems.",
    "emoji": "🌳"
   }
  ],
  "tips": {
   "food": "Try 'Fufu' with spicy peanut sauce, a staple of Togolese cuisine.",
   "culture": "Standard greetings are important; take time to acknowledge everyone socially.",
   "transport": "Moto-taxis (zemidjans) are the fastest way to navigate Lomé's traffic.",
   "safety": "Keep valuables hidden and avoid walking alone on beaches at night."
  }
 },
 "TH": {
  "code": "TH",
  "region": "asia",
  "capital": "Bangkok",
  "intro": "The Land of Smiles offers everything from glittering temples and chaotic markets to turquoise bays and world-renowned street food.",
  "bestSeason": "Nov–Feb",
  "currency": "Thai Baht (THB)",
  "language": "Thai",
  "timezone": "UTC+7",
  "plug": "Type A/B/C/O · 220V",
  "emergency": "191 Police · 199 Fire · 1669 Ambulance",
  "cost": {
   "budget": 35,
   "standard": 90,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Grand Palace",
    "blurb": "Admire the intricate architecture and the sacred Emerald Buddha in Bangkok.",
    "emoji": "👑"
   },
   {
    "name": "Phi Phi Islands",
    "blurb": "Swim in crystal-clear waters surrounded by dramatic limestone karst cliffs.",
    "emoji": "🏝️"
   },
   {
    "name": "Wat Phra That Doi Suthep",
    "blurb": "Visit this golden temple for panoramic views over Chiang Mai city.",
    "emoji": "📍"
   },
   {
    "name": "Railay Beach",
    "blurb": "Accessible only by boat, this paradise is ideal for rock climbing.",
    "emoji": "🧗"
   }
  ],
  "tips": {
   "food": "Don't fear street food; look for vendors with high local turnover.",
   "culture": "Always cover shoulders and knees when entering Buddhist temples.",
   "transport": "Use apps like Grab or official metered taxis; avoid unmetered tuk-tuks.",
   "safety": "Drink only bottled water and be wary of common tourist scams."
  }
 },
 "TJ": {
  "code": "TJ",
  "region": "asia",
  "capital": "Dushanbe",
  "intro": "Tajikistan is a rugged mountaineer's dream, defined by the soaring Pamir Highway and ancient Silk Road Silk hospitality.",
  "bestSeason": "Jun–Sep",
  "currency": "Tajikistani Somoni (TJS)",
  "language": "Tajik, Russian",
  "timezone": "UTC+5",
  "plug": "Type C/F · 220V",
  "emergency": "102 Police · 101 Fire · 103 Ambulance",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 160
  },
  "attractions": [
   {
    "name": "Pamir Highway",
    "blurb": "Drive one of the world's highest and most scenic mountain roads.",
    "emoji": "🏔️"
   },
   {
    "name": "Iskanderkul Lake",
    "blurb": "Relax by a turquoise alpine lake named after Alexander the Great.",
    "emoji": "💧"
   },
   {
    "name": "Fann Mountains",
    "blurb": "Trek through breathtaking high-altitude landscapes and clear glacial lakes.",
    "emoji": "🥾"
   },
   {
    "name": "Hissar Fortress",
    "blurb": "Explore a reconstructed 18th-century fort just outside the capital.",
    "emoji": "🧱"
   }
  ],
  "tips": {
   "food": "Try 'Qurutob', Tajikistan’s national dish made with bread and yogurt.",
   "culture": "Remove shoes when entering a home; bread is considered sacred here.",
   "transport": "Shared SUVs are the standard for navigating the rough mountain passes.",
   "safety": "Carry your passport at all times for frequent police checkpoints."
  }
 },
 "TL": {
  "code": "TL",
  "region": "asia",
  "capital": "Dili",
  "intro": "One of the world's youngest nations, Timor-Leste rewards intrepid travelers with pristine coral reefs and misty mountain coffee plantations.",
  "bestSeason": "May–Oct",
  "currency": "US Dollar (USD)",
  "language": "Tetum, Portuguese",
  "timezone": "UTC+9",
  "plug": "Type C/E/F/I · 220V",
  "emergency": "112 Police · 115 Fire · 110 Ambulance",
  "cost": {
   "budget": 40,
   "standard": 100,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Atauro Island",
    "blurb": "Dive in waters featuring some of the highest biodiversity on Earth.",
    "emoji": "🤿"
   },
   {
    "name": "Cristo Rei of Dili",
    "blurb": "Climb 500 steps to this iconic statue for beautiful coastal views.",
    "emoji": "🗽"
   },
   {
    "name": "Mount Ramelau",
    "blurb": "Hike the highest peak for a sunrise view over the island.",
    "emoji": "🌄"
   },
   {
    "name": "Jaco Island",
    "blurb": "Visit this uninhabited sacred island for pure white sands and spirits.",
    "emoji": "🐚"
   }
  ],
  "tips": {
   "food": "Enjoy fresh grilled fish and locally grown organic coffee.",
   "culture": "Be respectful of 'Lulik' (sacred) sites which are culturally sensitive.",
   "transport": "Microlets (minibuses) are cheap in Dili; 4x4s needed for mountains.",
   "safety": "Check for local crocodile warnings before swimming in remote coastal areas."
  }
 },
 "TM": {
  "code": "TM",
  "region": "asia",
  "capital": "Ashgabat",
  "intro": "Turkmenistan is a land of fascinating contrasts, from Ashgabat’s white marble architecture to the fiery 'Door to Hell' crater.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Turkmen Manat (TMT)",
  "language": "Turkmen, Russian",
  "timezone": "UTC+5",
  "plug": "Type C/F · 220V",
  "emergency": "02 Police · 01 Fire · 03 Ambulance",
  "cost": {
   "budget": 60,
   "standard": 150,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Darvaza Gas Crater",
    "blurb": "Camp overnight beside a giant desert pit that has burned since 1971.",
    "emoji": "🔥"
   },
   {
    "name": "Ancient Merv",
    "blurb": "Explore the ruins of one of the Silk Road's greatest cities.",
    "emoji": "🏜️"
   },
   {
    "name": "Independence Square",
    "blurb": "Marvel at the lavish marble monuments and fountains of Ashgabat.",
    "emoji": "🏛️"
   },
   {
    "name": "Yangykala Canyon",
    "blurb": "Witness spectacular pink and orange rock formations in the desert.",
    "emoji": "📸"
   }
  ],
  "tips": {
   "food": "Taste 'Plov' and try the golden melons famed across Central Asia.",
   "culture": "Strict photography rules apply; never photograph government buildings or police.",
   "transport": "Independent travel is restricted; you generally need a guide and permit.",
   "safety": "Registration with the state migration service is mandatory upon arrival."
  }
 },
 "TN": {
  "code": "TN",
  "region": "africa",
  "capital": "Tunis",
  "intro": "Tunisia invites you to explore grand Roman amphitheaters, Mediterranean beaches, and the golden dunes of the Sahara Desert.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Tunisian Dinar (TND)",
  "language": "Arabic, French",
  "timezone": "UTC+1",
  "plug": "Type C/E · 230V",
  "emergency": "197 Police · 198 Fire · 190 Ambulance",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "El Djem Amphitheatre",
    "blurb": "Stand in the center of one of the world's largest Roman colosseums.",
    "emoji": "🏟️"
   },
   {
    "name": "Sidi Bou Said",
    "blurb": "Walk through charming blue-and-white streets overlooking the Gulf of Tunis.",
    "emoji": "🏘️"
   },
   {
    "name": "Carthage",
    "blurb": "Visit the UNESCO-listed remains of the powerful ancient Punic empire.",
    "emoji": "🏺"
   },
   {
    "name": "Matmata",
    "blurb": "See unique troglodyte cave dwellings used in the Star Wars films.",
    "emoji": "🛸"
   }
  ],
  "tips": {
   "food": "Don't miss 'Brik', a crispy pastry with egg, or spicy Harissa.",
   "culture": "Bargaining is expected in the souks; start at half the price.",
   "transport": "Louages (shared taxis) are the fastest way to travel between cities.",
   "safety": "Stay alert in crowded tourist areas to avoid petty pickpocketing."
  }
 },
 "TO": {
  "code": "TO",
  "region": "oceania",
  "capital": "Nukuʻalofa",
  "intro": "The 'Friendly Islands' of Tonga offer a true Polynesian escape where you can swim with whales and enjoy untouched coral reefs.",
  "bestSeason": "May–Oct",
  "currency": "Tongan Paʻanga (TOP)",
  "language": "Tongan, English",
  "timezone": "UTC+13",
  "plug": "Type I · 240V",
  "emergency": "922 Police · 999 Fire · 933 Ambulance",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "Vava'u Islands",
    "blurb": "Take a boat tour to swim with migrating humpback whales.",
    "emoji": "🐋"
   },
   {
    "name": "Ha'amonga 'a Maui",
    "blurb": "Observe a massive 13th-century stone trilithon known as the Pacific's Stonehenge.",
    "emoji": "🗿"
   },
   {
    "name": "Mapu'a 'a Vaea",
    "blurb": "Watch spectacular blowholes shoot seawater high into the air.",
    "emoji": "🌊"
   },
   {
    "name": "Pangaimotu",
    "blurb": "Enjoy a day trip for snorkeling and a famous shipwreck beach.",
    "emoji": "🏝️"
   }
  ],
  "tips": {
   "food": "Attend a traditional 'Umu' (earth oven) feast for authentic flavors.",
   "culture": "Sunday is a day of rest; most businesses close and activities stop.",
   "transport": "Inter-island ferries are available, but domestic flights are much faster.",
   "safety": "Take care when swimming in the ocean due to strong currents."
  }
 },
 "TR": {
  "code": "TR",
  "region": "asia",
  "capital": "Ankara",
  "intro": "Turkey is a bridge between continents, where vibrant bazaars, Byzantine mosaics, and otherworldly landscapes create an unforgettable adventure.",
  "bestSeason": "Apr–May & Sep–Oct",
  "currency": "Turkish Lira (TRY)",
  "language": "Turkish",
  "timezone": "UTC+3",
  "plug": "Type C/F · 230V",
  "emergency": "112 (All services)",
  "cost": {
   "budget": 45,
   "standard": 100,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Hagia Sophia",
    "blurb": "Witness the architectural grandeur of this iconic Istanbul monument.",
    "emoji": "🕌"
   },
   {
    "name": "Cappadocia",
    "blurb": "Fly over fairy chimneys and cave dwellings in a hot air balloon.",
    "emoji": "🎈"
   },
   {
    "name": "Ephesus",
    "blurb": "Walk the marble streets of one of the best-preserved Greco-Roman cities.",
    "emoji": "🏛️"
   },
   {
    "name": "Pamukkale",
    "blurb": "Bathe in the thermal waters of these stunning white travertine terraces.",
    "emoji": "🛁"
   }
  ],
  "tips": {
   "food": "Savor diverse kebabs and end your meal with authentic Turkish delight.",
   "culture": "Expect to drink plenty of tea; it is a sign of hospitality.",
   "transport": "A modern bus network connects the entire country with high comfort.",
   "safety": "Exercise caution in crowded squares and be wary of overly friendly strangers."
  }
 },
 "TT": {
  "code": "TT",
  "region": "americas",
  "capital": "Port of Spain",
  "intro": "Trinidad and Tobago serve up a rhythmic blend of Caribbean carnival spirit, lush rainforests, and world-class bird watching.",
  "bestSeason": "Jan–May",
  "currency": "Trinidad and Tobago Dollar (TTD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type A/B · 115V",
  "emergency": "999 Police · 990 Fire · 811 Ambulance",
  "cost": {
   "budget": 60,
   "standard": 150,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Pigeon Point",
    "blurb": "Relax at Tobago's most famous beach with its iconic thatched jetty.",
    "emoji": "🏖️"
   },
   {
    "name": "Asa Wright Nature Centre",
    "blurb": "Spot exotic birds in a world-renowned tropical rainforest sanctuary.",
    "emoji": "🦜"
   },
   {
    "name": "Maracas Bay",
    "blurb": "Visit for the scenic drive and the famous 'Bake and Shark'.",
    "emoji": "🦈"
   },
   {
    "name": "Nylon Pool",
    "blurb": "Swim in a shallow, crystal-clear sandbar in the middle of the sea.",
    "emoji": "🏊"
   }
  ],
  "tips": {
   "food": "Try 'Doubles', a popular street food made of chickpeas and flatbread.",
   "culture": "Carnival in February is a massive, colorful, and high-energy celebration.",
   "transport": "Renting a car is ideal for exploring both islands at your pace.",
   "safety": "Stick to tourist areas in Port of Spain at night for safety."
  }
 },
 "TV": {
  "code": "TV",
  "region": "oceania",
  "capital": "Funafuti",
  "intro": "One of the world's smallest nations, Tuvalu offers a remote Polynesian paradise defined by turquoise lagoons and secluded coral atolls.",
  "bestSeason": "May–Oct",
  "currency": "Australian Dollar (AUD)",
  "language": "Tuvaluan, English",
  "timezone": "UTC+12",
  "plug": "Type I · 220V",
  "emergency": "911",
  "cost": {
   "budget": 60,
   "standard": 130,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Funafuti Conservation Area",
    "blurb": "A pristine marine sanctuary perfect for snorkeling among diverse tropical fish.",
    "emoji": "🤿"
   },
   {
    "name": "Nanumanga Caves",
    "blurb": "Submerged fire caves steeped in local legend and ancient geological history.",
    "emoji": "🕳️"
   },
   {
    "name": "Fongafale Islet",
    "blurb": "The main hub where you can experience local life and history.",
    "emoji": "🏝️"
   },
   {
    "name": "Tuvalu Women's Handicraft Centre",
    "blurb": "Authentic venue for buying traditional woven fans, mats, and shell jewelry.",
    "emoji": "🛍️"
   }
  ],
  "tips": {
   "food": "Try coconut-based dishes and fresh seafood caught daily in the lagoon.",
   "culture": "Dress modestly and always remove your shoes before entering a maneapa.",
   "transport": "Motorbikes are the primary way to get around the main islet.",
   "safety": "Be aware of limited medical facilities; travel insurance is highly recommended."
  }
 },
 "TW": {
  "code": "TW",
  "region": "asia",
  "capital": "Taipei",
  "intro": "Taiwan is a vibrant island fusion of bustling night markets, soaring skyscrapers, and lush mountain landscapes steeped in tradition.",
  "bestSeason": "Oct–Dec",
  "currency": "New Taiwan Dollar (TWD)",
  "language": "Mandarin Chinese",
  "timezone": "UTC+8",
  "plug": "Type A/B · 110V",
  "emergency": "110 police · 119 fire/ambulance",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Taipei 101",
    "blurb": "The iconic bamboo-shaped skyscraper offering panoramic views of the capital city.",
    "emoji": "🏙️"
   },
   {
    "name": "Taroko Gorge",
    "blurb": "Spectacular marble canyons, waterfalls, and tunnels carved through rugged mountains.",
    "emoji": "⛰️"
   },
   {
    "name": "Shilin Night Market",
    "blurb": "A street food paradise featuring oyster omelets and famous stinky tofu.",
    "emoji": "🍢"
   },
   {
    "name": "Sun Moon Lake",
    "blurb": "Serene alpine lake perfect for cycling and misty boat tours.",
    "emoji": "🛶"
   }
  ],
  "tips": {
   "food": "Don't miss the diverse street food; night markets are essential experiences.",
   "culture": "Tipping is not expected, but polite service is highly valued everywhere.",
   "transport": "The EasyCard works for almost all public transport and convenience stores.",
   "safety": "Taiwan is exceptionally safe, though stay alert for scooters on sidewalks."
  }
 },
 "TZ": {
  "code": "TZ",
  "region": "africa",
  "capital": "Dodoma",
  "intro": "East Africa’s soul where the massive Serengeti migrations meet the spice-scented white sands of Zanzibar's exotic coastline.",
  "bestSeason": "Jun–Oct",
  "currency": "Tanzanian Shilling (TZS)",
  "language": "Swahili, English",
  "timezone": "UTC+3",
  "plug": "Type G · 230V",
  "emergency": "112",
  "cost": {
   "budget": 45,
   "standard": 150,
   "luxury": 500
  },
  "attractions": [
   {
    "name": "Serengeti National Park",
    "blurb": "Witness the Great Migration and world-class wildlife safaris on vast plains.",
    "emoji": "🦁"
   },
   {
    "name": "Mount Kilimanjaro",
    "blurb": "The Roof of Africa, providing a challenging trek to its snowy summit.",
    "emoji": "🏔️"
   },
   {
    "name": "Ngorongoro Crater",
    "blurb": "A breathtaking volcanic caldera teeming with dense populations of African wildlife.",
    "emoji": "🦏"
   },
   {
    "name": "Stone Town",
    "blurb": "Winding alleys and historical architecture in the heart of Zanzibar’s capital.",
    "emoji": "🕌"
   }
  ],
  "tips": {
   "food": "Try Zanzibar's 'Urojo' soup and fresh grilled seafood at Forodhani Gardens.",
   "culture": "Always ask permission before taking photos of people or private property.",
   "transport": "Domestic flights are the fastest way to travel between parks and islands.",
   "safety": "Use registered taxis and avoid walking alone after dark in cities."
  }
 },
 "UA": {
  "code": "UA",
  "region": "europe",
  "capital": "Kyiv",
  "intro": "A resilient land of golden-domed cathedrals, vast sunflower fields, and a deep history currently facing significant modern challenges.",
  "bestSeason": "May–Jun & Sep",
  "currency": "Ukrainian Hryvnia (UAH)",
  "language": "Ukrainian",
  "timezone": "UTC+2",
  "plug": "Type C/F · 230V",
  "emergency": "101 fire · 102 police · 103 medical",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Saint Sophia Cathedral",
    "blurb": "A stunning 11th-century Byzantine monument featuring intricate mosaics and frescoes.",
    "emoji": "⛪"
   },
   {
    "name": "Lviv Old Town",
    "blurb": "UNESCO-listed historic center famous for its coffee culture and architecture.",
    "emoji": "☕"
   },
   {
    "name": "Kyiv Pechersk Lavra",
    "blurb": "Majestic monastery complex with underground caves and golden-topped churches.",
    "emoji": "🕍"
   },
   {
    "name": "Carpathian Mountains",
    "blurb": "Lush evergreen peaks offering scenic hiking and traditional Hutsul culture.",
    "emoji": "🌲"
   }
  ],
  "tips": {
   "food": "Borscht and Varenyky are staples you must sample in local eateries.",
   "culture": "Learning a few basic Ukrainian phrases is very much appreciated by locals.",
   "transport": "The Kyiv Metro is fast, deep, often beautiful, and very affordable.",
   "safety": "Check current government travel advisories due to ongoing conflict before visiting."
  }
 },
 "UG": {
  "code": "UG",
  "region": "africa",
  "capital": "Kampala",
  "intro": "The Pearl of Africa invites travelers to trek with mountain gorillas through mist-shrouded rainforests and explore diverse wildlife reserves.",
  "bestSeason": "Jun–Aug & Dec–Feb",
  "currency": "Ugandan Shilling (UGX)",
  "language": "English, Swahili, Luganda",
  "timezone": "UTC+3",
  "plug": "Type G · 240V",
  "emergency": "999",
  "cost": {
   "budget": 40,
   "standard": 120,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Bwindi Impenetrable Forest",
    "blurb": "The premier spot for life-changing encounters with endangered mountain gorillas.",
    "emoji": "🦍"
   },
   {
    "name": "Murchison Falls",
    "blurb": "The Nile squeezing through a narrow gorge creates a thundering waterfall.",
    "emoji": "🌊"
   },
   {
    "name": "Queen Elizabeth National Park",
    "blurb": "Famous for tree-climbing lions and boat safaris on the Kazinga Channel.",
    "emoji": "🦁"
   },
   {
    "name": "Source of the Nile",
    "blurb": "Jinja provides the scenic starting point of the world's longest river.",
    "emoji": "🚣"
   }
  ],
  "tips": {
   "food": "Try 'Rolex', a popular street food wrap consisting of eggs and chapati.",
   "culture": "Dress conservatively, especially when visiting rural areas or religious sites.",
   "transport": "Boda-bodas are quick but risky; use ride-sharing apps like SafeBoda.",
   "safety": "Keep valuables hidden and be cautious in crowded markets or bus parks."
  }
 },
 "US": {
  "code": "US",
  "region": "americas",
  "capital": "Washington, D.C.",
  "intro": "A vast tapestry of iconic cities, diverse national parks, and cinematic landscapes stretching from the Atlantic to the Pacific.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "US Dollar (USD)",
  "language": "English, Spanish",
  "timezone": "UTC-5 to -10",
  "plug": "Type A/B · 120V",
  "emergency": "911",
  "cost": {
   "budget": 100,
   "standard": 250,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Grand Canyon",
    "blurb": "Scale the immense, colorful rock layers of this world-famous geological marvel.",
    "emoji": "🏜️"
   },
   {
    "name": "New York City",
    "blurb": "The global hub for culture, theater, and non-stop commercial energy.",
    "emoji": "🗽"
   },
   {
    "name": "Yellowstone",
    "blurb": "Volcanic wonderland filled with geysers, hot springs, and abundant American wildlife.",
    "emoji": "🌋"
   },
   {
    "name": "Golden Gate Bridge",
    "blurb": "San Francisco's architectural masterpiece soaring over the foggy Pacific entrance.",
    "emoji": "🌉"
   }
  ],
  "tips": {
   "food": "Portion sizes are large and tipping 18-22% is expected in restaurants.",
   "culture": "Americans value personal space; a friendly 'hello' to strangers is common.",
   "transport": "Renting a car is essential for exploring anywhere outside major cities.",
   "safety": "Emergency services are excellent, but healthcare is extremely expensive without insurance."
  }
 },
 "UY": {
  "code": "UY",
  "region": "americas",
  "capital": "Montevideo",
  "intro": "South America’s hidden gem offers sophisticated coastal charm, historic colonial towns, and a relaxed, progressive atmosphere for every traveler.",
  "bestSeason": "Dec–Mar",
  "currency": "Uruguayan Peso (UYU)",
  "language": "Spanish",
  "timezone": "UTC-3",
  "plug": "Type C/L · 230V",
  "emergency": "911",
  "cost": {
   "budget": 60,
   "standard": 140,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Colonia del Sacramento",
    "blurb": "Charming UNESCO town with cobblestone streets and Portuguese colonial architecture.",
    "emoji": "🏘️"
   },
   {
    "name": "Punta del Este",
    "blurb": "Glamorous beach resort known for vibrant nightlife and upscale coastal living.",
    "emoji": "🏖️"
   },
   {
    "name": "Mercado del Puerto",
    "blurb": "Montevideo’s bustling market offering the world's best grilled 'asado' meats.",
    "emoji": "🥩"
   },
   {
    "name": "Cabo Polonio",
    "blurb": "Off-grid rustic village surrounded by sand dunes and a sea lion colony.",
    "emoji": "🌅"
   }
  ],
  "tips": {
   "food": "Carry your own thermos if you want to drink mate like locals.",
   "culture": "Uruguay is very liberal; respect the relaxed 'tranquilo' pace of life.",
   "transport": "Buses are high quality and the main way to travel between cities.",
   "safety": "Montevideo is generally safe, but stay alert in the Old City at night."
  }
 },
 "UZ": {
  "code": "UZ",
  "region": "asia",
  "capital": "Tashkent",
  "intro": "The heart of the Silk Road, Uzbekistan dazzles with turquoise-tiled mosques and ancient desert ruins that echo with merchant history.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Uzbekistani Som (UZS)",
  "language": "Uzbek, Russian",
  "timezone": "UTC+5",
  "plug": "Type C/F · 220V",
  "emergency": "101 fire · 102 police · 103 medical",
  "cost": {
   "budget": 35,
   "standard": 80,
   "luxury": 200
  },
  "attractions": [
   {
    "name": "Registan Square",
    "blurb": "Samarkand’s breathtaking complex of three ornate, blue-tiled Islamic madrasahs.",
    "emoji": "🕌"
   },
   {
    "name": "Itchan Kala",
    "blurb": "Khiva’s walled inner city, an open-air museum of ancient desert architecture.",
    "emoji": "🧱"
   },
   {
    "name": "Bukhara Old City",
    "blurb": "Historic center featuring thousands of years of Silk Road heritage and trade.",
    "emoji": "🕍"
   },
   {
    "name": "Shah-i-Zinda",
    "blurb": "A stunning necropolis featuring a corridor of sparkling turquoise mausoleums.",
    "emoji": "🔷"
   }
  ],
  "tips": {
   "food": "Plov is the national dish; every region has its own unique recipe.",
   "culture": "Always accept tea with both hands as a sign of respect.",
   "transport": "The high-speed Afrosiyob train connects Tashkent, Samarkand, and Bukhara efficiently.",
   "safety": "Uzbekistan is very safe, though registration slips from hotels are legally required."
  }
 },
 "VA": {
  "code": "VA",
  "region": "europe",
  "capital": "Vatican City",
  "intro": "The world's smallest sovereign state is a spiritual enclave containing an unparalleled collection of Renaissance art and religious history.",
  "bestSeason": "Apr–Jun & Sep–Oct",
  "currency": "Euro (EUR)",
  "language": "Italian, Latin",
  "timezone": "UTC+1",
  "plug": "Type C/F/L · 230V",
  "emergency": "112 (Italy)",
  "cost": {
   "budget": 70,
   "standard": 150,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "St. Peter's Basilica",
    "blurb": "The pinnacle of Renaissance architecture and one of Earth's holiest sites.",
    "emoji": "⛪"
   },
   {
    "name": "Sistine Chapel",
    "blurb": "Michelangelo’s legendary ceiling frescoes located within the Apostolic Palace.",
    "emoji": "🎨"
   },
   {
    "name": "Vatican Museums",
    "blurb": "Enormous galleries housing centuries of papal art, sculptures, and history.",
    "emoji": "🏛️"
   },
   {
    "name": "Vatican Gardens",
    "blurb": "Lush, private urban gardens and parks covering half of the territory.",
    "emoji": "🌳"
   }
  ],
  "tips": {
   "food": "Eat in the surrounding Prati neighborhood for better value than tourist cafes.",
   "culture": "Strict dress codes apply: no bare shoulders or knees for any gender.",
   "transport": "Walking is the only way to explore this tiny city-state.",
   "safety": "Watch for pickpockets in the dense crowds within St. Peter's Square."
  }
 },
 "VC": {
  "code": "VC",
  "region": "americas",
  "capital": "Kingstown",
  "intro": "An emerald archipelago of 32 islands offering lush volcanic peaks, yacht-filled bays, and a true escape from modern life.",
  "bestSeason": "Dec–May",
  "currency": "East Caribbean Dollar (XCD)",
  "language": "English",
  "timezone": "UTC-4",
  "plug": "Type G/A/B · 230V",
  "emergency": "999",
  "cost": {
   "budget": 90,
   "standard": 220,
   "luxury": 600
  },
  "attractions": [
   {
    "name": "Tobago Cays",
    "blurb": "A marine park with five uninhabited islands and crystal-clear snorkeling waters.",
    "emoji": "🐢"
   },
   {
    "name": "La Soufrière Volcano",
    "blurb": "A magnificent active volcano offering a challenging trek and panoramic views.",
    "emoji": "🌋"
   },
   {
    "name": "Bequia",
    "blurb": "The quintessential Caribbean island known for its seafaring heritage and beaches.",
    "emoji": "⛵"
   },
   {
    "name": "Mustique",
    "blurb": "Exclusive private island playground for the world's elite and famous figures.",
    "emoji": "🥂"
   }
  ],
  "tips": {
   "food": "Try the national dish: roasted breadfruit and fried jackfish.",
   "culture": "The pace is slow; embrace 'island time' without frustration or rush.",
   "transport": "Inexpensive local vans (minibuses) are great for getting around St. Vincent.",
   "safety": "Be cautious when hiking; always hire a local guide for volcano trails."
  }
 },
 "VE": {
  "code": "VE",
  "region": "americas",
  "capital": "Caracas",
  "intro": "Home to the world's tallest waterfall and diverse ecosystems, this nation possesses immense natural beauty despite its political complexity.",
  "bestSeason": "Dec–Apr",
  "currency": "Venezuelan Bolívar (VES)",
  "language": "Spanish",
  "timezone": "UTC-4",
  "plug": "Type A/B · 120V",
  "emergency": "911",
  "cost": {
   "budget": 40,
   "standard": 100,
   "luxury": 300
  },
  "attractions": [
   {
    "name": "Angel Falls",
    "blurb": "The world’s highest uninterrupted waterfall, plunging deep within the jungle.",
    "emoji": "🌊"
   },
   {
    "name": "Los Roques",
    "blurb": "A stunning archipelago archipelago protecting vibrant coral reefs and turquoise lagoons.",
    "emoji": "🏝️"
   },
   {
    "name": "Mount Roraima",
    "blurb": "The ancient, flat-top 'tepui' mountain that inspired 'The Lost World'.",
    "emoji": "⛰️"
   },
   {
    "name": "Morrocoy National Park",
    "blurb": "Coastal mangroves and islets offering pristine white sand and clear water.",
    "emoji": "🚤"
   }
  ],
  "tips": {
   "food": "Sample Arepas, a cornmeal cake stuffed with various delicious fillings.",
   "culture": "Venezuelans are exceptionally warm and social despite current economic hardships.",
   "transport": "Internal travel usually requires domestic flights or private transfers for safety.",
   "safety": "Strictly follow travel advisories and prioritize organized tours for all excursions."
  }
 },
 "VN": {
  "code": "VN",
  "region": "asia",
  "capital": "Hanoi",
  "intro": "A sensory feast of jade waters, emerald rice paddies, and chaotic cities that pulse with energy and culinary magic.",
  "bestSeason": "Nov–Apr",
  "currency": "Vietnamese Dong (VND)",
  "language": "Vietnamese",
  "timezone": "UTC+7",
  "plug": "Type A/C/G · 220V",
  "emergency": "113 police · 114 fire · 115 ambulance",
  "cost": {
   "budget": 30,
   "standard": 75,
   "luxury": 250
  },
  "attractions": [
   {
    "name": "Ha Long Bay",
    "blurb": "Thousands of towering limestone karsts rising from calm, emerald sea waters.",
    "emoji": "🚢"
   },
   {
    "name": "Hoi An Ancient Town",
    "blurb": "Lantern-lit historic port city with remarkably preserved timber-frame buildings.",
    "emoji": "🏮"
   },
   {
    "name": "Ho Chi Minh City",
    "blurb": "The buzzing southern metropolis full of colonial history and modern malls.",
    "emoji": "🛵"
   },
   {
    "name": "Sapa Rice Terraces",
    "blurb": "Spectacular stepped green fields carved into the Hoang Lien Son mountains.",
    "emoji": "🌾"
   }
  ],
  "tips": {
   "food": "Eat street food like Pho and Banh Mi where locals congregate.",
   "culture": "Always remove shoes when entering homes and some traditional shops.",
   "transport": "To cross the street, walk slowly and steadily; scooters will avoid you.",
   "safety": "Keep your phone and bags secure in cities to prevent drive-by snatching."
  }
 },
 "VU": {
  "code": "VU",
  "region": "oceania",
  "capital": "Port Vila",
  "intro": "Vibrant Vanuatu offers ancient tribal traditions, active volcanoes, and world-class scuba diving among 83 lush tropical islands.",
  "bestSeason": "May–Oct",
  "currency": "Vanuatu Vatu (VUV)",
  "language": "Bislama, English, French",
  "timezone": "UTC+11",
  "plug": "Type G · 220-240V",
  "emergency": "112 police · 112 ambulance",
  "cost": {
   "budget": 70,
   "standard": 160,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Mount Yasur",
    "blurb": "One of the world's most accessible active volcanoes on Tanna Island.",
    "emoji": "🌋"
   },
   {
    "name": "Champagne Beach",
    "blurb": "Pristine white sands and turquoise waters shaped like a crescent moon.",
    "emoji": "🏖️"
   },
   {
    "name": "SS President Coolidge",
    "blurb": "Massive WWII shipwreck that is a premier destination for recreational divers.",
    "emoji": "🚢"
   },
   {
    "name": "Mele Cascades",
    "blurb": "Stunning terraced waterfalls ending in a natural swimming pool near Vila.",
    "emoji": "🌊"
   }
  ],
  "tips": {
   "food": "Try laplap, the national dish made from pounded roots and coconut cream.",
   "culture": "Respect local custom (kastom) by asking permission before entering village land.",
   "transport": "Shared minivans with a 'B' on the license plate are affordable transport.",
   "safety": "Be cautious of strong currents when swimming in unguarded coastal areas."
  }
 },
 "WS": {
  "code": "WS",
  "region": "oceania",
  "capital": "Apia",
  "intro": "The heart of Polynesia, Samoa enchants visitors with its thunderous waterfalls, deep blue swimming holes, and timeless Fa'a Samoa traditions.",
  "bestSeason": "May–Oct",
  "currency": "Samoan Tala (WST)",
  "language": "Samoan, English",
  "timezone": "UTC+13",
  "plug": "Type I · 230V",
  "emergency": "995 police · 996 fire · 994 ambulance",
  "cost": {
   "budget": 60,
   "standard": 130,
   "luxury": 280
  },
  "attractions": [
   {
    "name": "To Sua Ocean Trench",
    "blurb": "A magical 30-meter deep natural swimming hole surrounded by lush gardens.",
    "emoji": "🕳️"
   },
   {
    "name": "Lalomanu Beach",
    "blurb": "Award-winning beach offering iconic views and traditional beachfront fale stays.",
    "emoji": "🏝️"
   },
   {
    "name": "Alofaaga Blowholes",
    "blurb": "Powerful volcanic tubes that blast seawater hundreds of feet skyward.",
    "emoji": "🐳"
   },
   {
    "name": "Robert Louis Stevenson Museum",
    "blurb": "The beautiful former home of the famous Scottish author in Vailima.",
    "emoji": "🏠"
   }
  ],
  "tips": {
   "food": "Savor an umu feast, where food is cooked in an earth oven.",
   "culture": "Dress modestly when walking through villages and avoid walking during evening prayer.",
   "transport": "Colorful, wooden-seated buses are a slow but culturally rich way to travel.",
   "safety": "Stray dogs can be aggressive; carry a stick or stone to deter them."
  }
 },
 "XK": {
  "code": "XK",
  "region": "europe",
  "capital": "Pristina",
  "intro": "Europe’s youngest country beckons with rugged Balkan peaks, Ottoman-era architecture, and some of the continent’s trendiest coffee culture.",
  "bestSeason": "May–Sep",
  "currency": "Euro (EUR)",
  "language": "Albanian, Serbian",
  "timezone": "UTC+1",
  "plug": "Type C/F · 230V",
  "emergency": "192 police · 193 fire · 194 ambulance",
  "cost": {
   "budget": 35,
   "standard": 75,
   "luxury": 160
  },
  "attractions": [
   {
    "name": "Prizren Old Town",
    "blurb": "Picturesque historical city with stone bridges and Ottoman mosques.",
    "emoji": "🕌"
   },
   {
    "name": "Rugova Canyon",
    "blurb": "Dramatic 25km long gorge offering hiking, climbing, and stunning river views.",
    "emoji": "⛰️"
   },
   {
    "name": "Visoki Dečani Monastery",
    "blurb": "Medieval Serbian Orthodox monastery featuring breathtaking 14th-century frescoes.",
    "emoji": "⛪"
   },
   {
    "name": "Newborn Monument",
    "blurb": "Iconic typographic sculpture in Pristina celebrating the country's independence.",
    "emoji": "🎨"
   }
  ],
  "tips": {
   "food": "Order a macchiato; Kosovo is rumored to have the best in Europe.",
   "culture": "Hospitality is sacred here; do not be surprised by invitations to tea.",
   "transport": "Buses are the main way to travel between cities and are cheap.",
   "safety": "Stick to marked paths in rural areas due to residual unexploded ordnance."
  }
 },
 "YE": {
  "code": "YE",
  "region": "middle-east",
  "capital": "Sana'a",
  "intro": "A land of ancient 'skyscrapers' and unique biodiversity, Yemen holds incredible cultural depth despite current travel restrictions.",
  "bestSeason": "Oct–Mar",
  "currency": "Yemeni Rial (YER)",
  "language": "Arabic",
  "timezone": "UTC+3",
  "plug": "Type A/D/G · 230V",
  "emergency": "191 police · 197 fire · 191 ambulance",
  "cost": {
   "budget": 30,
   "standard": 70,
   "luxury": 180
  },
  "attractions": [
   {
    "name": "Old City of Sana'a",
    "blurb": "UNESCO site famous for unique multi-story baked brick tower houses.",
    "emoji": "🏢"
   },
   {
    "name": "Socotra Island",
    "blurb": "Alien-like landscape home to the iconic Dragon's Blood trees.",
    "emoji": "🌳"
   },
   {
    "name": "Shibam",
    "blurb": "The 'Manhattan of the Desert' featuring 16th-century mud-brick high-rises.",
    "emoji": "🏙️"
   },
   {
    "name": "Dar al-Hajar",
    "blurb": "The legendary 'Rock Palace' perched atop a massive natural rock pinnacle.",
    "emoji": "🏰"
   }
  ],
  "tips": {
   "food": "Try Saltah, a bubbling meat stew served with flatbread.",
   "culture": "Social life often revolves around Qat chewing; understand the local social norms.",
   "transport": "Travel is extremely restricted; official permits and local guides are mandatory.",
   "safety": "Check government advisories; many regions are currently unsafe due to conflict."
  }
 },
 "ZA": {
  "code": "ZA",
  "region": "africa",
  "capital": "Pretoria",
  "intro": "South Africa offers a spectacular mix of wildlife safaris, world-class vineyards, and the dramatic coastline of the Cape.",
  "bestSeason": "May–Sep",
  "currency": "South African Rand (ZAR)",
  "language": "Zulu, Xhosa, Afrikaans, English",
  "timezone": "UTC+2",
  "plug": "Type D/M/N · 230V",
  "emergency": "10111 police · 10177 ambulance",
  "cost": {
   "budget": 50,
   "standard": 120,
   "luxury": 350
  },
  "attractions": [
   {
    "name": "Kruger National Park",
    "blurb": "One of Africa's largest game reserves for Big Five sightings.",
    "emoji": "🦁"
   },
   {
    "name": "Table Mountain",
    "blurb": "Flat-topped peak overlooking Cape Town, accessible by cableway or hiking.",
    "emoji": "⛰️"
   },
   {
    "name": "Cape Winelands",
    "blurb": "Stunning valleys producing world-renowned wines near Stellenbosch and Franschhoek.",
    "emoji": "🍷"
   },
   {
    "name": "Robben Island",
    "blurb": "Historic prison site where Nelson Mandela was held for 18 years.",
    "emoji": "⛓️"
   }
  ],
  "tips": {
   "food": "Don't miss a 'braai', the quintessential South African outdoor barbecue experience.",
   "culture": "Tipping 10-15% is standard practice in restaurants and for 'car guards'.",
   "transport": "Uber is widely available and safe in major cities like Cape Town.",
   "safety": "Be vigilant in urban areas; avoid walking alone at night in cities."
  }
 },
 "ZM": {
  "code": "ZM",
  "region": "africa",
  "capital": "Lusaka",
  "intro": "Zambia is the birthplace of the walking safari, boasting raw wilderness and the thunderous majesty of Victoria Falls.",
  "bestSeason": "May–Oct",
  "currency": "Zambian Kwacha (ZMW)",
  "language": "English, Bemba, Nyanja",
  "timezone": "UTC+2",
  "plug": "Type C/G · 230V",
  "emergency": "991 police · 993 fire · 992 ambulance",
  "cost": {
   "budget": 45,
   "standard": 140,
   "luxury": 450
  },
  "attractions": [
   {
    "name": "Victoria Falls",
    "blurb": "The world's largest sheet of falling water, locally called Mosi-oa-Tunya.",
    "emoji": "🌊"
   },
   {
    "name": "South Luangwa NP",
    "blurb": "Wildlife paradise famous for its leopard population and walking safaris.",
    "emoji": "🐆"
   },
   {
    "name": "Lower Zambezi NP",
    "blurb": "Remote park offering unique canoe safaris along the mighty Zambezi River.",
    "emoji": "🛶"
   },
   {
    "name": "Devil's Pool",
    "blurb": "Intrepid natural infinity pool right on the edge of Victoria Falls.",
    "emoji": "🏊"
   }
  ],
  "tips": {
   "food": "Nshima, a thick maize porridge, is the staple served with relish.",
   "culture": "Always use your right hand when shaking hands or giving items.",
   "transport": "Internal flights are the fastest way to reach remote safari lodges.",
   "safety": "Take malaria prophylaxis and use mosquito nets in all safari areas."
  }
 },
 "ZW": {
  "code": "ZW",
  "region": "africa",
  "capital": "Harare",
  "intro": "From ancient stone ruins to the spray of the Zambezi, Zimbabwe offers incredible heritage and some of Africa's best guides.",
  "bestSeason": "May–Oct",
  "currency": "US Dollar (USD)",
  "language": "English, Shona, Ndebele",
  "timezone": "UTC+2",
  "plug": "Type G · 240V",
  "emergency": "995 police · 993 fire · 994 ambulance",
  "cost": {
   "budget": 50,
   "standard": 130,
   "luxury": 400
  },
  "attractions": [
   {
    "name": "Great Zimbabwe",
    "blurb": "Massive medieval stone ruins of an ancient African sub-Saharan city.",
    "emoji": "🧱"
   },
   {
    "name": "Hwange National Park",
    "blurb": "Zimbabwe's largest park, famous for its massive herds of elephants.",
    "emoji": "🐘"
   },
   {
    "name": "Mana Pools",
    "blurb": "UNESCO wilderness area known for its floodplains and remarkable biodiversity.",
    "emoji": "🌳"
   },
   {
    "name": "Matobo Hills",
    "blurb": "Granite domes and ancient rock art with high rhino concentrations.",
    "emoji": "🦏"
   }
  ],
  "tips": {
   "food": "Sample 'biltong' (dried meat) as a popular and portable travel snack.",
   "culture": "Ask before taking photos of people or government buildings to avoid trouble.",
   "transport": "Self-driving is possible but requires a 4x4 for most national parks.",
   "safety": "Carry extra cash in USD as ATMs can be unreliable or empty."
  }
 }
};

export function getCountryProfile(code: string, name: string): CountryProfile {
  const p = COUNTRY_PROFILES[code];
  if (p) return p;
  return {
    code,
    region: "asia",
    capital: "\u2014",
    intro: `${name} awaits \u2014 check entry rules and plan your trip with Asvior.`,
    bestSeason: "Varies by region",
    currency: "Local currency",
    language: "Local language",
    timezone: "\u2014",
    plug: "Check before travel",
    emergency: "112 (most regions)",
    cost: { budget: 40, standard: 100, luxury: 250 },
    attractions: [
      { name: "Capital highlights", blurb: "Historic center, markets, and museums.", emoji: "\ud83c\udfdb\ufe0f" },
      { name: "Natural wonders", blurb: "Landscapes and national parks.", emoji: "\ud83c\udfde\ufe0f" },
      { name: "Local cuisine", blurb: "Taste the signature national dishes.", emoji: "\ud83c\udf7d\ufe0f" },
      { name: "Cultural sites", blurb: "Traditions, festivals, and heritage.", emoji: "\ud83c\udfad" },
    ],
    tips: {
      food: "Try local specialties at busy, well-reviewed spots.",
      culture: "Learn a few local greetings \u2014 it goes a long way.",
      transport: "Use official taxis or licensed ride apps.",
      safety: "Keep documents secure and register with your embassy for long stays.",
    },
  };
}
