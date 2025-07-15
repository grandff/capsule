ALTER TABLE "trends" DROP CONSTRAINT "trends_trend_keyword_id_trend_keywords_trend_keyword_id_fk";
--> statement-breakpoint
ALTER TABLE "trend_keywords" ADD COLUMN "trend_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "trend_keywords" ADD CONSTRAINT "trend_keywords_trend_id_trends_trend_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("trend_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trends" DROP COLUMN "trend_keyword_id";