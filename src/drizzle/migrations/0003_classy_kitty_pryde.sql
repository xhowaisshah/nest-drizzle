ALTER TABLE "leases" ALTER COLUMN "unit_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "duration" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "payment_schedule" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "end_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "billing_date" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leases" ADD CONSTRAINT "leases_unit_id_units_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("unit_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_lease_id_unique" UNIQUE("lease_id");