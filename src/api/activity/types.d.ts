import { PagKeys } from "../types";
export interface ActivityReadRequest extends PagKeys {
  query?: string;
  categoryId?: string;
  sortBy?: string;
  orderBy?: string;
}
export interface TActivityImage {
  id?: string;
  url: string;
}
export interface TActivityLabel {
  id?: string;
  label: string;
}
export interface TActivity {
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  price: number;
  duration: number;
  categoryId: string;
  rating?: number;
  meetingPoint?: string | null;
  images?: TActivityImage[];
  highlights?: TActivityLabel[];
  included?: TActivityLabel[];
  removedImageUrls?: Array<string | null>;
}
export interface UActivity extends Partial<TActivity> {
  id: string;
}
