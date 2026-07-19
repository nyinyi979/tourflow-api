import { PagKeys } from "../types";

export interface CustomerReadRequest extends PagKeys {
  query?: string;
  sortBy?: string;
  orderBy?: string;
}

export interface TCustomerLogin {
  email: string;
  password: string;
}

export interface TCustomerSignup {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  removedImageUrls?: Array<string | null>;
}

export interface TCustomerUpdate {
  name?: string;
  email?: string;
  password?: string | null;
  avatar?: string | null;
  removedImageUrls?: Array<string | null>;
}
