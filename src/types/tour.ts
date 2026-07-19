import type { Review } from "./review";

export interface Tour {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number; // days
  difficulty: string;
  category: string;
  images: TourImage[];
  capacity: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  highlights: TourHighlight[];
  itinerary: ItineraryDay[];
  reviews: Review[];
}

export interface ItineraryDay {
  id?: string;
  day: number;
  title: string;
  description: string;
}

export interface TourImage {
  id?: string;
  url: string;
}

export interface TourHighlight {
  id?: string;
  label: string;
}
