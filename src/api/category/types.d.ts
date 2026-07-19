import { PagKeys } from "../types";

export interface CategoryReadRequest extends PagKeys {
  query?: string;
  type?: "tour" | "activity";
  sortBy?: string;
  orderBy?: string;
}

export interface AllCategoryReadRequest {
  type: "tour" | "activity";
}

export interface TCategory {
  slug: string;
  label: string;
  image?: string | null;
  type: "tour" | "activity";
  removedImageUrls?: Array<string | null>;
}

export interface UCategory extends Partial<TCategory> {
  id: string;
}
