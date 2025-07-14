CREATE TABLE "challenge_members" (
	"member_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "challenge_members_member_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"challenge_id" uuid NOT NULL,
	"sort_seq" integer DEFAULT 0 NOT NULL,
	"profile_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenge_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "challenge_submits" (
	"submit_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "challenge_submits_submit_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"challenge_id" uuid NOT NULL,
	"sort_seq" integer DEFAULT 0 NOT NULL,
	"profile_id" uuid NOT NULL,
	"submit_ctt" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenge_submits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "challenges" (
	"challenge_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_ttl" text NOT NULL,
	"challenge_ctt" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"max_member_cnt" integer NOT NULL,
	"now_member_cnt" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "trend_keywords" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "trends" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "threads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "challenge_members" ADD CONSTRAINT "challenge_members_challenge_id_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_members" ADD CONSTRAINT "challenge_members_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_submits" ADD CONSTRAINT "challenge_submits_challenge_id_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_submits" ADD CONSTRAINT "challenge_submits_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "insert-payment-policy" ON "payments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "update-payment-policy" ON "payments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "payments"."user_id") WITH CHECK ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "delete-payment-policy" ON "payments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "select-notifications-policy" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "notifications"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-notifications-policy" ON "notifications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "notifications"."profile_id");--> statement-breakpoint
CREATE POLICY "update-notifications-policy" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "notifications"."profile_id") WITH CHECK ((select auth.uid()) = "notifications"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-notifications-policy" ON "notifications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "notifications"."profile_id");--> statement-breakpoint
CREATE POLICY "select-trend-keywords-policy" ON "trend_keywords" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert-trend-keywords-policy" ON "trend_keywords" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "update-trend-keywords-policy" ON "trend_keywords" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "delete-trend-keywords-policy" ON "trend_keywords" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "select-trends-policy" ON "trends" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert-trends-policy" ON "trends" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "update-trends-policy" ON "trends" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "delete-trends-policy" ON "trends" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "select-threads-policy" ON "threads" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "threads"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-threads-policy" ON "threads" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "threads"."profile_id");--> statement-breakpoint
CREATE POLICY "update-threads-policy" ON "threads" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "threads"."profile_id") WITH CHECK ((select auth.uid()) = "threads"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-threads-policy" ON "threads" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "threads"."profile_id");--> statement-breakpoint
CREATE POLICY "select-challenge-members-policy" ON "challenge_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "challenge_members"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-challenge-members-policy" ON "challenge_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "challenge_members"."profile_id");--> statement-breakpoint
CREATE POLICY "update-challenge-members-policy" ON "challenge_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "challenge_members"."profile_id") WITH CHECK ((select auth.uid()) = "challenge_members"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-challenge-members-policy" ON "challenge_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "challenge_members"."profile_id");--> statement-breakpoint
CREATE POLICY "select-challenge-submits-policy" ON "challenge_submits" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "challenge_submits"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-challenge-submits-policy" ON "challenge_submits" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "challenge_submits"."profile_id");--> statement-breakpoint
CREATE POLICY "update-challenge-submits-policy" ON "challenge_submits" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "challenge_submits"."profile_id") WITH CHECK ((select auth.uid()) = "challenge_submits"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-challenge-submits-policy" ON "challenge_submits" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "challenge_submits"."profile_id");--> statement-breakpoint
CREATE POLICY "select-challenges-policy" ON "challenges" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert-challenges-policy" ON "challenges" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "update-challenges-policy" ON "challenges" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "delete-challenges-policy" ON "challenges" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin');