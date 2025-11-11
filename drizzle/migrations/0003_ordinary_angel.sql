ALTER TABLE "users" ALTER COLUMN "total_storage_used" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "storage_limit" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "storage_limit" SET DEFAULT 10000000000;