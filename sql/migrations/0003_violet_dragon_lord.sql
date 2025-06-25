ALTER TABLE "profiles" ADD COLUMN "threads_connect" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "threads_access_token" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "threads_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "marketing_consent";