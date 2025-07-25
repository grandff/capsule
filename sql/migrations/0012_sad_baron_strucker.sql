CREATE TABLE "thread_feedbacks" (
	"feedback_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "thread_feedbacks_feedback_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid NOT NULL,
	"original_text" text NOT NULL,
	"feedback_text" text NOT NULL,
	"etc_text" text NOT NULL,
	"result_text" text,
	"is_applied" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "thread_feedbacks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "thread_feedbacks" ADD CONSTRAINT "thread_feedbacks_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select-threads-policy" ON "thread_feedbacks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "thread_feedbacks"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-threads-policy" ON "thread_feedbacks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "thread_feedbacks"."profile_id");--> statement-breakpoint
CREATE POLICY "update-threads-policy" ON "thread_feedbacks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "thread_feedbacks"."profile_id") WITH CHECK ((select auth.uid()) = "thread_feedbacks"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-threads-policy" ON "thread_feedbacks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "thread_feedbacks"."profile_id");