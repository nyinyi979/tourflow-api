import { PagKeys } from "../types";
export interface TestimonialReadRequest extends PagKeys {
  query?: string;
  sortBy?: string;
  orderBy?: string;
}
export interface TTestimonial {
  name: string;
  avatar?: string | null;
  quote: string;
  rating: number;
  removedImageUrls?: Array<string | null>;
}
export interface UTestimonial extends Partial<TTestimonial> {
  id: string;
}
