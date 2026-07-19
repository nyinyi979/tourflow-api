import db from "../../db";

const percentChange = (current: number, previous: number) =>
  previous
    ? Math.round(((current - previous) / previous) * 1000) / 10
    : current
      ? 100
      : 0;

export const getDashboard = async () => {
  const [bookings, tours, customers] = await Promise.all([
    db.query.bookingsTable.findMany({
      with: { tour: { columns: { id: true, title: true, rating: true } } },
    }),
    db.query.toursTable.findMany({
      columns: { id: true, title: true, price: true, rating: true },
    }),
    db.query.customersTable.findMany({ columns: { registeredAt: true } }),
  ]);
  const now = new Date();
  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const valid = bookings.filter((booking) => booking.status !== "cancelled");
  const currentBookings = valid.filter(
    (booking) => booking.createdAt >= currentStart,
  );
  const previousBookings = valid.filter(
    (booking) =>
      booking.createdAt >= previousStart && booking.createdAt < currentStart,
  );
  const currentCustomers = customers.filter(
    (customer) => customer.registeredAt >= currentStart,
  ).length;
  const previousCustomers = customers.filter(
    (customer) =>
      customer.registeredAt >= previousStart &&
      customer.registeredAt < currentStart,
  ).length;
  const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const rows = valid.filter(
      (booking) => booking.createdAt >= date && booking.createdAt < next,
    );
    return {
      month: date.toLocaleString("en", { month: "short" }),
      revenue: rows.reduce((sum, row) => sum + row.totalPrice, 0),
      bookings: rows.length,
    };
  });
  const topTours = tours
    .map((tour) => {
      const rows = valid.filter((booking) => booking.tourId === tour.id);
      return {
        name: tour.title,
        bookings: rows.length,
        revenue: rows.reduce((sum, row) => sum + row.totalPrice, 0),
        rating: tour.rating,
      };
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);
  return {
    monthlyRevenue,
    dashboardStats: {
      totalRevenue: valid.reduce((sum, booking) => sum + booking.totalPrice, 0),
      totalBookings: valid.length,
      activeTours: tours.length,
      newCustomers: currentCustomers,
      trends: {
        revenue: percentChange(
          currentBookings.reduce((sum, row) => sum + row.totalPrice, 0),
          previousBookings.reduce((sum, row) => sum + row.totalPrice, 0),
        ),
        bookings: percentChange(
          currentBookings.length,
          previousBookings.length,
        ),
        tours: 0,
        customers: percentChange(currentCustomers, previousCustomers),
      },
    },
    topTours,
  };
};
