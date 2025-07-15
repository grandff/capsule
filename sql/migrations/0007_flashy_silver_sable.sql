ALTER TABLE "trend_keywords" RENAME COLUMN "trend_keyword" TO "keyword";--> statement-breakpoint
ALTER TABLE "trend_keywords" RENAME COLUMN "trend_keyword_rank" TO "rank";--> statement-breakpoint
ALTER TABLE "trend_keywords" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "trends" ADD COLUMN "profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trend_keywords" DROP COLUMN "sort_seq";--> statement-breakpoint
ALTER TABLE "trends" DROP COLUMN "trend_content";--> statement-breakpoint
ALTER TABLE "trends" DROP COLUMN "trend_type";--> statement-breakpoint
ALTER TABLE "trends" DROP COLUMN "trend_rank";