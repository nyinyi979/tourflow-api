import { PagKeys } from "../types";
export interface ReviewReadRequest extends PagKeys {
  query?: string;
  tourId?: string;
  status?: "published" | "hidden";
  sortBy?: string;
  orderBy?: string;
}
export interface TReview {
  tourId: string;
  rating: number;
  comment: string;
}
export interface UReview {
  id: string;
  rating?: number;
  comment?: string;
  status?: "published" | "hidden";
}
