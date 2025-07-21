CREATE TYPE "public"."followers_event_type" AS ENUM('upload', 'refresh', 'daily_snapshot');--> statement-breakpoint
CREATE TABLE "followers_history" (
	"history_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "followers_history_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid NOT NULL,
	"thread_id" bigint,
	"follower_count" integer NOT NULL,
	"event_type" "followers_event_type",
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "followers_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "followers_history" ADD CONSTRAINT "followers_history_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_id_idx" ON "followers_history" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "thread_id_idx" ON "followers_history" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "followers_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "event_type_idx" ON "followers_history" USING btree ("event_type");--> statement-breakpoint
CREATE POLICY "select-followers-history-policy" ON "followers_history" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "followers_history"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-followers-history-policy" ON "followers_history" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "followers_history"."profile_id");--> statement-breakpoint
CREATE POLICY "update-followers-history-policy" ON "followers_history" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "followers_history"."profile_id") WITH CHECK ((select auth.uid()) = "followers_history"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-followers-history-policy" ON "followers_history" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "followers_history"."profile_id");