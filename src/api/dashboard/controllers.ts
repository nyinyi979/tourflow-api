import { sql } from "drizzle-orm";
import db from "../../db";

interface DashboardResult extends Record<string, unknown> {
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  dashboardStats: {
    totalRevenue: number;
    totalBookings: number;
    activeTours: number;
    newCustomers: number;
    trends: {
      revenue: number;
      bookings: number;
      tours: number;
      customers: number;
    };
  };
  topTours: Array<{
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
}

export const getDashboard = async () => {
  const result = await db.execute<DashboardResult>(sql`
    with bounds as (
      select
        date_trunc('month', current_timestamp) as current_start,
        date_trunc('month', current_timestamp) - interval '1 month' as previous_start,
        date_trunc('month', current_timestamp) - interval '11 months' as chart_start
    ),
    valid_bookings as (
      select * from bookings where status <> 'cancelled'
    ),
    booking_stats as (
      select
        coalesce(sum(total_price), 0)::double precision as total_revenue,
        count(*)::integer as total_bookings,
        coalesce(sum(total_price) filter (where created_at >= bounds.current_start), 0)::double precision as current_revenue,
        coalesce(sum(total_price) filter (
          where created_at >= bounds.previous_start
            and created_at < bounds.current_start
        ), 0)::double precision as previous_revenue,
        count(*) filter (where created_at >= bounds.current_start)::integer as current_bookings,
        count(*) filter (
          where created_at >= bounds.previous_start
            and created_at < bounds.current_start
        )::integer as previous_bookings
      from valid_bookings cross join bounds
    ),
    customer_stats as (
      select
        count(*) filter (where registered_at >= bounds.current_start)::integer as current_customers,
        count(*) filter (
          where registered_at >= bounds.previous_start
            and registered_at < bounds.current_start
        )::integer as previous_customers
      from customers cross join bounds
    ),
    monthly_revenue as (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'month', to_char(months.month, 'Mon'),
            'revenue', months.revenue,
            'bookings', months.bookings
          ) order by months.month
        ),
        '[]'::jsonb
      ) as data
      from (
        select
          month,
          coalesce(sum(valid_bookings.total_price), 0)::double precision as revenue,
          count(valid_bookings.id)::integer as bookings
        from bounds
        cross join lateral generate_series(
          bounds.chart_start,
          bounds.current_start,
          interval '1 month'
        ) as month
        left join valid_bookings
          on valid_bookings.created_at >= month
          and valid_bookings.created_at < month + interval '1 month'
        group by month
      ) months
    ),
    top_tours as (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'name', ranked.name,
            'bookings', ranked.bookings,
            'revenue', ranked.revenue,
            'rating', ranked.rating
          ) order by ranked.bookings desc
        ),
        '[]'::jsonb
      ) as data
      from (
        select
          tours.title as name,
          count(valid_bookings.id)::integer as bookings,
          coalesce(sum(valid_bookings.total_price), 0)::double precision as revenue,
          tours.rating::double precision as rating
        from tours
        left join valid_bookings on valid_bookings.tour_id = tours.id
        group by tours.id, tours.title, tours.rating
        order by bookings desc
        limit 5
      ) ranked
    )
    select
      monthly_revenue.data as "monthlyRevenue",
      jsonb_build_object(
        'totalRevenue', booking_stats.total_revenue,
        'totalBookings', booking_stats.total_bookings,
        'activeTours', (select count(*)::integer from tours),
        'newCustomers', customer_stats.current_customers,
        'trends', jsonb_build_object(
          'revenue', case
            when booking_stats.previous_revenue <> 0 then
              round(((booking_stats.current_revenue - booking_stats.previous_revenue)
                / booking_stats.previous_revenue * 100)::numeric, 1)
            when booking_stats.current_revenue <> 0 then 100
            else 0
          end,
          'bookings', case
            when booking_stats.previous_bookings <> 0 then
              round(((booking_stats.current_bookings - booking_stats.previous_bookings)::numeric
                / booking_stats.previous_bookings * 100), 1)
            when booking_stats.current_bookings <> 0 then 100
            else 0
          end,
          'tours', 0,
          'customers', case
            when customer_stats.previous_customers <> 0 then
              round(((customer_stats.current_customers - customer_stats.previous_customers)::numeric
                / customer_stats.previous_customers * 100), 1)
            when customer_stats.current_customers <> 0 then 100
            else 0
          end
        )
      ) as "dashboardStats",
      top_tours.data as "topTours"
    from booking_stats, customer_stats, monthly_revenue, top_tours
  `);

  return result.rows[0];
};
