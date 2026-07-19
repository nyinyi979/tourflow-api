import * as userSchema from "./user";
import * as activitySchema from "./activity";
import * as bookingSchema from "./booking";
import * as categorySchema from "./category";
import * as customerSchema from "./customer";
import * as reviewSchema from "./review";
import * as testimonialSchema from "./testimonial";
import * as tourSchema from "./tour";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle({
  client: pool,
  schema: {
    ...activitySchema,
    ...bookingSchema,
    ...categorySchema,
    ...customerSchema,
    ...reviewSchema,
    ...testimonialSchema,
    ...tourSchema,
    ...userSchema,
  },
  connection: process.env.DATABASE_URL!,
});

export default db;
