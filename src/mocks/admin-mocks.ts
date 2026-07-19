import { Tour } from "../types/tour";
import { tours, activities } from "./mocks";
import { Activity } from "../types/activity";
import { Booking } from "../types/booking";
import { Customer } from "../types/customer";
import { AdminReview } from "../types/review";

const names = [
  ["Amara Okafor", "amara.okafor@mail.com", 47],
  ["Hiroshi Tanaka", "h.tanaka@mail.com", 12],
  ["Elena Vasquez", "elena.v@mail.com", 32],
  ["James Whitfield", "j.whitfield@mail.com", 15],
  ["Priya Menon", "priya.m@mail.com", 45],
  ["Marcus Bell", "marcus@mail.com", 8],
  ["Sofia Lindqvist", "sofia.l@mail.com", 20],
  ["Diego Ramirez", "diego.r@mail.com", 33],
  ["Yuki Nakamura", "yuki@mail.com", 5],
  ["Fatima Al-Hassan", "fatima@mail.com", 44],
  ["Ollie Bennett", "ollie@mail.com", 68],
  ["Zara Khan", "zara.k@mail.com", 26],
] as const;

const statuses: string[] = ["pending", "confirmed", "cancelled", "completed"];

function pad(n: number) {
  return String(n).padStart(4, "0");
}

const allItems: { name: string; price: number; type: "tour" | "activity" }[] = [
  ...tours.map((t: Tour) => ({
    name: t.title,
    price: t.price,
    type: "tour" as const,
  })),
  ...activities.map((a: Activity) => ({
    name: a.title,
    price: a.price,
    type: "activity" as const,
  })),
];

export const adminBookings: Booking[] = Array.from({ length: 24 }, (_, i) => {
  const [name, email, img] = names[i % names.length];
  const item = allItems[i % allItems.length];
  const adults = 1 + (i % 4);
  const children = i % 3;
  const daysAgo = i * 3;
  const created = new Date(2026, 5, 30 - daysAgo);
  const travel = new Date(2026, 6 + (i % 4), 4 + (i % 20));
  const status = statuses[i % statuses.length];
  return {
    id: `BK-${pad(1024 + i)}`,
    customer: { name, email, avatar: `https://i.pravatar.cc/80?img=${img}` },
    tour: { name: item.name, type: item.type },
    travelDate: travel.toISOString().slice(0, 10),
    createdAt: created.toISOString().slice(0, 10),
    guests: { adults, children },
    totalPrice: item.price * adults + Math.round(item.price * 0.5) * children,
    status,
    activity: [
      {
        at: created.toISOString().slice(0, 10) + " 09:12",
        label: "Booking created",
      },
      {
        at: created.toISOString().slice(0, 10) + " 09:14",
        label: "Payment received",
      },
      ...(status !== "pending"
        ? [
            {
              at: created.toISOString().slice(0, 10) + " 10:02",
              label: `Status changed to ${status}`,
            },
          ]
        : []),
    ],
  };
});

export const adminCustomers: Customer[] = names.map(([name, email, img], i) => {
  const bookings = adminBookings.filter((b) => b.customer.email === email);
  return {
    id: `CU-${pad(200 + i)}`,
    name,
    email,
    avatar: `https://i.pravatar.cc/80?img=${img}`,
    registeredAt: new Date(2025, i % 12, 1 + (i % 27))
      .toISOString()
      .slice(0, 10),
    totalBookings: bookings.length,
    totalSpent: bookings.reduce((s, b) => s + b.totalPrice, 0),
  };
});

const reviewComments = [
  "Absolutely unforgettable — every detail was thoughtful.",
  "Guides were exceptional. Food was the highlight.",
  "A little more free time would have been nice, but wonderful overall.",
  "Best trip I've ever taken. Small group made all the difference.",
  "Lodging was gorgeous and the pace was perfect.",
  "Well organised, well paced. Would book again.",
];

export const adminReviews: AdminReview[] = Array.from(
  { length: 14 },
  (_, i) => {
    const [name, , img] = names[i % names.length];
    const tour = tours[i % tours.length];
    return {
      id: `RV-${pad(500 + i)}`,
      customer: name,
      avatar: `https://i.pravatar.cc/80?img=${img}`,
      tour: tour.title,
      rating: 3 + (i % 3),
      comment: reviewComments[i % reviewComments.length],
      date: new Date(2026, 5 - (i % 6), 2 + (i % 25))
        .toISOString()
        .slice(0, 10),
      status: i % 5 === 0 ? "hidden" : "published",
    };
  },
);

export const monthlyRevenue = [
  { month: "Jul", revenue: 42100, bookings: 38 },
  { month: "Aug", revenue: 51800, bookings: 46 },
  { month: "Sep", revenue: 48600, bookings: 42 },
  { month: "Oct", revenue: 62400, bookings: 55 },
  { month: "Nov", revenue: 58200, bookings: 51 },
  { month: "Dec", revenue: 71300, bookings: 63 },
  { month: "Jan", revenue: 54900, bookings: 48 },
  { month: "Feb", revenue: 60100, bookings: 53 },
  { month: "Mar", revenue: 68700, bookings: 61 },
  { month: "Apr", revenue: 74500, bookings: 67 },
  { month: "May", revenue: 82300, bookings: 74 },
  { month: "Jun", revenue: 91600, bookings: 82 },
];

export const dashboardStats = {
  totalRevenue: monthlyRevenue.reduce((s, m) => s + m.revenue, 0),
  totalBookings: monthlyRevenue.reduce((s, m) => s + m.bookings, 0),
  activeTours: tours.length,
  newCustomers: 128,
  trends: { revenue: 12.4, bookings: 8.7, tours: 2, customers: -3.1 },
};

export const topTours = tours.slice(0, 5).map((t, i) => ({
  name: t.title,
  bookings: 120 - i * 14,
  revenue: t.price * (120 - i * 14),
  rating: t.rating,
}));
