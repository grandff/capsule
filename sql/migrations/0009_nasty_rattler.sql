CREATE TABLE "gpt_analysis_results" (
	"analysis_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gpt_analysis_results_analysis_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid NOT NULL,
	"analysis_text" text NOT NULL,
	"analysis_date" timestamp DEFAULT now() NOT NULL,
	"is_helpful" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gpt_analysis_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gpt_analysis_results" ADD CONSTRAINT "gpt_analysis_results_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_analysis_date_idx" ON "gpt_analysis_results" USING btree ("profile_id","analysis_date");--> statement-breakpoint
CREATE INDEX "analysis_date_idx" ON "gpt_analysis_results" USING btree ("analysis_date");--> statement-breakpoint
CREATE POLICY "select-gpt-analysis-results-policy" ON "gpt_analysis_results" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "gpt_analysis_results"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-gpt-analysis-results-policy" ON "gpt_analysis_results" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "gpt_analysis_results"."profile_id");--> statement-breakpoint
CREATE POLICY "update-gpt-analysis-results-policy" ON "gpt_analysis_results" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "gpt_analysis_results"."profile_id") WITH CHECK ((select auth.uid()) = "gpt_analysis_results"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-gpt-analysis-results-policy" ON "gpt_analysis_results" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "gpt_analysis_results"."profile_id");