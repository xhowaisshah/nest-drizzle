ALTER TABLE "leases" ADD COLUMN "lease_duration" "lease_duration" NOT NULL;--> statement-breakpoint
ALTER TABLE "leases" DROP COLUMN IF EXISTS "duration";