export interface Booking {
  id: string;
  customer: { name: string; email: string; avatar: string };
  tour: { name: string; type: "tour" | "activity" };
  travelDate: string;
  createdAt: string;
  guests: { adults: number; children: number };
  totalPrice: number;
  status: string; // "pending" | "confirmed" | "cancelled" | "completed";
  activity: { at: string; label: string }[];
}
