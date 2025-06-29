CREATE TABLE "sns_profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"target_type" "target_type" NOT NULL,
	"access_token" text NOT NULL,
	"expires_at" timestamp,
	"user_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sns_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sns_profiles" ADD CONSTRAINT "sns_profiles_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "insert-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "sns_profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "edit-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "sns_profiles"."profile_id") WITH CHECK ((select auth.uid()) = "sns_profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "sns_profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "sns_profiles"."profile_id");