import { PagKeys } from "../types";

export interface TourReadRequest extends PagKeys {
  query?: string;
  categoryId?: string;
  difficulty?: string;
  sortBy?: string;
  orderBy?: string;
}

export interface TTourImage {
  id?: string;
  url: string;
}

export interface TTourHighlight {
  id?: string;
  label: string;
}

export interface TItineraryDay {
  id?: string;
  day: number;
  title: string;
  description: string;
}

export interface TTour {
  slug: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  difficulty: string;
  categoryId: string;
  capacity: number;
  rating?: number;
  reviewCount?: number;
  popularity?: number;
  images?: TTourImage[];
  highlights?: TTourHighlight[];
  itinerary?: TItineraryDay[];
  removedImageUrls?: Array<string | null>;
}

export interface UTour extends Partial<TTour> {
  id: string;
}
