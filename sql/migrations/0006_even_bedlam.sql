CREATE TABLE "user_interest_keywords" (
	"keyword_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_interest_keywords_keyword_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid NOT NULL,
	"keyword" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_interest_keywords" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_interest_keywords" ADD CONSTRAINT "user_interest_keywords_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_keyword_idx" ON "user_interest_keywords" USING btree ("profile_id","keyword");--> statement-breakpoint
CREATE INDEX "profile_active_idx" ON "user_interest_keywords" USING btree ("profile_id","is_active");--> statement-breakpoint
CREATE INDEX "sort_order_idx" ON "user_interest_keywords" USING btree ("sort_order");--> statement-breakpoint
CREATE POLICY "select-user-interest-keywords-policy" ON "user_interest_keywords" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_interest_keywords"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-user-interest-keywords-policy" ON "user_interest_keywords" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_interest_keywords"."profile_id");--> statement-breakpoint
CREATE POLICY "update-user-interest-keywords-policy" ON "user_interest_keywords" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_interest_keywords"."profile_id") WITH CHECK ((select auth.uid()) = "user_interest_keywords"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-user-interest-keywords-policy" ON "user_interest_keywords" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_interest_keywords"."profile_id");