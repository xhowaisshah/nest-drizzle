ALTER TABLE "billing" DROP CONSTRAINT "billing_lease_id_leases_id_fk";
--> statement-breakpoint
ALTER TABLE "leases" DROP CONSTRAINT "leases_unit_id_units_unit_id_fk";
--> statement-breakpoint
ALTER TABLE "leases" DROP CONSTRAINT "leases_tenant_id_tenants_id_fk";
--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "unit_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "unit_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "payment_schedule" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "payment_schedule" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "amount" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "billing_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "leases" ALTER COLUMN "billing_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "lease_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "duration" varchar;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "start_date" varchar;--> statement-breakpoint
ALTER TABLE "leases" ADD COLUMN "end_date" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing" ADD CONSTRAINT "billing_lease_id_leases_lease_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."leases"("lease_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leases" ADD CONSTRAINT "leases_tenant_id_contacts_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "leases" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "leases" DROP COLUMN IF EXISTS "lease_duration";--> statement-breakpoint
ALTER TABLE "leases" DROP COLUMN IF EXISTS "created_at";