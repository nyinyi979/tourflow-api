import { PagKeys } from "../types";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export interface BookingReadRequest extends PagKeys {
  query?: string;
  status?: BookingStatus;
  itemType?: "tour" | "activity";
  sortBy?: string;
  orderBy?: string;
}
export interface TBooking {
  itemType: "tour" | "activity";
  tourId?: string | null;
  activityId?: string | null;
  travelDate: string;
  adults: number;
  children?: number;
}
export interface UBooking {
  travelDate?: string;
  adults?: number;
  children?: number;
  status?: BookingStatus;
}
