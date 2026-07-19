import { Activity } from "../types/activity";
import { Category } from "../types/category";
import { Review } from "../types/review";
import { Testimonial } from "../types/testimonial";
import { ItineraryDay, Tour } from "../types/tour";

export const CATS = ["Aerial", "Culinary", "Water", "Cultural", "Outdoor"];

export function getActivityById(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

const labels = (values: string[]) => values.map((label) => ({ label }));

const sampleHighlights = labels([
  "Small groups capped at 12 travelers",
  "Locally-sourced meals every day",
  "Handpicked boutique lodging",
  "Certified local guides",
  "All permits and entrance fees included",
]);

const sampleReviews: Review[] = [
  {
    id: "r1",
    name: "Amara Okafor",
    avatar: "https://i.pravatar.cc/120?img=47",
    date: "March 2026",
    rating: 5,
    comment:
      "The most alive I've felt in years. Every detail — guides, food, the tiny mountain huts — was thoughtful.",
  },
  {
    id: "r2",
    name: "Hiroshi Tanaka",
    avatar: "https://i.pravatar.cc/120?img=12",
    date: "February 2026",
    rating: 5,
    comment:
      "Quietly perfect. The pace was human, the group small, and nothing felt manufactured.",
  },
  {
    id: "r3",
    name: "Elena Vasquez",
    avatar: "https://i.pravatar.cc/120?img=32",
    date: "January 2026",
    rating: 4,
    comment:
      "I traveled solo and never felt alone. Great mix of structure and quiet time to yourself.",
  },
  {
    id: "r4",
    name: "James Whitfield",
    avatar: "https://i.pravatar.cc/120?img=15",
    date: "December 2025",
    rating: 5,
    comment:
      "The lodging punched well above its price. Meals were the surprise standout.",
  },
];

const buildItinerary = (days: number, title: string): ItineraryDay[] =>
  Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title:
      i === 0
        ? "Arrival & welcome"
        : i === days - 1
          ? "Farewell & departure"
          : `${title} — day ${i + 1}`,
    description:
      "A slow morning, a long walk, an unhurried meal. Details shared on booking.",
  }));

export const tours: Tour[] = [
  {
    id: "patagonia",
    title: "Patagonia Ridgeline Trek",
    description:
      "Eight days across granite spires, glacier lakes and windblown steppe with a small guided group.",
    longDescription:
      "A proper long-form trek through the wildest corner of South America. You'll cross moraine fields, sleep in refugios above the treeline, and end each day with warm food and the kind of silence you only find at altitude.",
    price: 2480,
    duration: 8,
    difficulty: "Challenging",
    category: "Adventure",
    images: [],
    capacity: 10,
    rating: 4.9,
    reviewCount: 128,
    popularity: 95,
    highlights: sampleHighlights,
    itinerary: buildItinerary(8, "On the ridge"),
    reviews: sampleReviews,
  },
  {
    id: "marrakech",
    title: "Marrakech to the Atlas",
    description:
      "A slow week through medinas, riads and Berber villages — bread, spice markets, cedar forests.",
    longDescription:
      "Begin in the noisy heart of the medina and end in the quiet of the High Atlas. A trip built around markets, meals, and the people who cook them.",
    price: 1690,
    duration: 6,
    difficulty: "Easy",
    category: "Cultural",
    images: [],
    capacity: 12,
    rating: 4.8,
    reviewCount: 96,
    popularity: 88,
    highlights: sampleHighlights,
    itinerary: buildItinerary(6, "Souk to summit"),
    reviews: sampleReviews,
  },
  {
    id: "kyoto",
    title: "Kyoto in Autumn",
    description:
      "Ryokan stays, temple mornings and mountain onsen at the peak of the maple season.",
    longDescription:
      "Nine days built around the koyo — the turning of the maples. Early mornings at temples before the crowds, evenings in traditional inns.",
    price: 3120,
    duration: 9,
    difficulty: "Moderate",
    category: "Luxury",
    images: [],
    capacity: 8,
    rating: 5.0,
    reviewCount: 74,
    popularity: 92,
    highlights: sampleHighlights,
    itinerary: buildItinerary(9, "Kyoto mornings"),
    reviews: sampleReviews,
  },
  {
    id: "iceland-ring",
    title: "Iceland Ring Road",
    description:
      "Seven days circling the island — waterfalls, black sand beaches, and geothermal soaks.",
    longDescription:
      "A driving loop of the Ring Road with detours into the Highlands. Small group, one shared van, plenty of hot springs.",
    price: 2290,
    duration: 7,
    difficulty: "Moderate",
    category: "Adventure",
    images: [],
    capacity: 10,
    rating: 4.7,
    reviewCount: 152,
    popularity: 90,
    highlights: sampleHighlights,
    itinerary: buildItinerary(7, "Around the ring"),
    reviews: sampleReviews,
  },
  {
    id: "tuscany",
    title: "Tuscan Slow Roads",
    description:
      "Five days between Siena and the Val d'Orcia — cellars, kitchens, and quiet hilltop towns.",
    longDescription:
      "For people who travel to eat. Winery visits, farmhouse lunches, and a lot of unhurried afternoons in the sun.",
    price: 1980,
    duration: 5,
    difficulty: "Easy",
    category: "Luxury",
    images: [],
    capacity: 8,
    rating: 4.9,
    reviewCount: 63,
    popularity: 80,
    highlights: sampleHighlights,
    itinerary: buildItinerary(5, "Along the strada"),
    reviews: sampleReviews,
  },
  {
    id: "costa-rica",
    title: "Costa Rica Family Journey",
    description:
      "Ten days of rainforest, wildlife, and Pacific beaches — designed for families with kids.",
    longDescription:
      "Zip lines, sloth spotting, and slow beach mornings. Paced for kids but built with grown-ups in mind.",
    price: 2650,
    duration: 10,
    difficulty: "Easy",
    category: "Family",
    images: [],
    capacity: 14,
    rating: 4.8,
    reviewCount: 47,
    popularity: 78,
    highlights: sampleHighlights,
    itinerary: buildItinerary(10, "Rainforest to coast"),
    reviews: sampleReviews,
  },
  {
    id: "peru-inca",
    title: "Peru: The Inca Trail",
    description:
      "Four days on foot to Machu Picchu with a private cook and porter team.",
    longDescription:
      "The classic trail, done right. Small group, proper acclimatization, and a proper meal at the end of every day.",
    price: 1450,
    duration: 4,
    difficulty: "Challenging",
    category: "Adventure",
    images: [],
    capacity: 10,
    rating: 4.9,
    reviewCount: 210,
    popularity: 98,
    highlights: sampleHighlights,
    itinerary: buildItinerary(4, "Trail day"),
    reviews: sampleReviews,
  },
  {
    id: "vietnam-family",
    title: "Vietnam North to South",
    description:
      "Twelve days through Hanoi, Hoi An, and the Mekong — perfect for older kids and teens.",
    longDescription:
      "A slow-paced family trip through Vietnam's greatest hits. Street food tours, tailor shops, and quiet river mornings.",
    price: 2870,
    duration: 12,
    difficulty: "Easy",
    category: "Family",
    images: [],
    capacity: 12,
    rating: 4.7,
    reviewCount: 55,
    popularity: 74,
    highlights: sampleHighlights,
    itinerary: buildItinerary(12, "Vietnam"),
    reviews: sampleReviews,
  },
  {
    id: "norway-fjords",
    title: "Norwegian Fjords by Boat",
    description:
      "Three days along the western fjords by small ship with hiking and kayaking stops.",
    longDescription:
      "A short, cinematic escape along Norway's western coast. Kayak the still water, hike above the fjord, sleep on board.",
    price: 1320,
    duration: 3,
    difficulty: "Moderate",
    category: "Adventure",
    images: [],
    capacity: 12,
    rating: 4.6,
    reviewCount: 41,
    popularity: 70,
    highlights: sampleHighlights,
    itinerary: buildItinerary(3, "On the water"),
    reviews: sampleReviews,
  },
];

export const activities: Activity[] = [
  {
    id: "cappadocia-balloon",
    title: "Cappadocia Balloon at Sunrise",
    description: "Lift off with the first light over the fairy chimneys.",
    longDescription:
      "You'll be picked up in the dark, watch the burners fire, and drift up as the valleys of Göreme turn from lavender to gold. About an hour aloft, then a champagne toast on landing. Warm layers recommended — the desert bites before the sun clears the ridge.",
    price: 220,
    duration: 3,
    category: "Aerial",
    images: [],
    rating: 4.9,
    highlights: labels([
      "Hotel pickup before dawn",
      "~60 minutes of flight time",
      "Small basket, max 16 flyers",
      "Champagne toast on landing",
    ]),
    included: labels([
      "Transfers",
      "Light breakfast",
      "Flight insurance",
      "Certificate",
    ]),
    meetingPoint: "Your hotel lobby in Göreme, 04:30",
  },
  {
    id: "tuscany-pasta",
    title: "Handmade Pasta in Tuscany",
    description: "A farmhouse kitchen, a nonna, four generations of recipes.",
    longDescription:
      "An afternoon at a working farm outside Siena. You'll roll pici and pappardelle by hand, learn two sauces from Nonna Giulia, and sit down to eat what you made with a glass of the family's Chianti. Slow, generous, unhurried.",
    price: 95,
    duration: 4,
    category: "Culinary",
    images: [],
    rating: 4.8,
    highlights: labels([
      "Two pasta shapes, two sauces",
      "Cook, then sit down and eat",
      "Wine pairing included",
      "Small groups of 8",
    ]),
    included: labels([
      "Apron",
      "All ingredients",
      "Full lunch",
      "Two glasses of wine",
    ]),
    meetingPoint: "Podere La Marronaia, Castellina in Chianti",
  },
  {
    id: "reef-snorkel",
    title: "Great Barrier Reef Snorkel",
    description:
      "A quiet cove, warm water and a marine biologist as your guide.",
    longDescription:
      "A half-day sail out to a protected pocket of the outer reef most boats skip. Your guide is a working marine biologist who'll point out what you'd otherwise swim past — reef sharks, giant clams, a resident green turtle named Doris.",
    price: 140,
    duration: 5,
    category: "Water",
    images: [],
    rating: 4.7,
    highlights: labels([
      "Two guided snorkel sites",
      "Small boat, capped at 14",
      "Marine biologist onboard",
      "Reef-safe sunscreen provided",
    ]),
    included: labels([
      "Mask, fins, wetsuit",
      "Lunch on board",
      "Reef tax",
      "Fresh towel",
    ]),
    meetingPoint: "Marlin Marina, Cairns, 08:00",
  },
];

export const categories: Category[] = [
  { slug: "adventure", label: "Adventure", image: "" },
  { slug: "cultural", label: "Cultural", image: "" },
  { slug: "family", label: "Family", image: "" },
  { slug: "luxury", label: "Luxury", image: "" },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Amara Okafor",
    avatar: "https://i.pravatar.cc/120?img=47",
    quote:
      "The Patagonia trek was the most alive I've felt in years. Every detail — guides, food, tiny mountain huts — was thoughtful.",
    rating: 5,
  },
  {
    id: "2",
    name: "Hiroshi Tanaka",
    avatar: "https://i.pravatar.cc/120?img=12",
    quote:
      "Kyoto in autumn is a cliché for a reason. What surprised me was how quietly they arranged everything around us.",
    rating: 5,
  },
  {
    id: "3",
    name: "Elena Vasquez",
    avatar: "https://i.pravatar.cc/120?img=32",
    quote:
      "I traveled solo and never felt alone. The group was small, the pace was human, the food was extraordinary.",
    rating: 5,
  },
];

export function getTourById(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
