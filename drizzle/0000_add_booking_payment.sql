ALTER TABLE "bookings"
ADD COLUMN IF NOT EXISTS "payment_status" varchar(20) DEFAULT 'unpaid' NOT NULL;
--> statement-breakpoint
ALTER TABLE "bookings"
ADD COLUMN IF NOT EXISTS "payment_method" varchar(20);
--> statement-breakpoint
ALTER TABLE "bookings"
ADD COLUMN IF NOT EXISTS "payment_reference" varchar(50);
--> statement-breakpoint
ALTER TABLE "bookings"
ADD COLUMN IF NOT EXISTS "paid_at" timestamp with time zone;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_payment_status_index"
ON "bookings" USING btree ("payment_status");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_payment_reference_unique"
ON "bookings" USING btree ("payment_reference");
