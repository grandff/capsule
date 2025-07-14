ALTER TABLE "user_insights" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_metrics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "keywords" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "thread_keywords" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "thread_properties" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_insights" DROP CONSTRAINT "user_insights_thread_id_threads_thread_id_fk";
--> statement-breakpoint
CREATE POLICY "select-keywords-policy" ON "keywords" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert-keywords-policy" ON "keywords" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "update-keywords-policy" ON "keywords" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "delete-keywords-policy" ON "keywords" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "select-properties-policy" ON "properties" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert-properties-policy" ON "properties" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "update-properties-policy" ON "properties" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "delete-properties-policy" ON "properties" AS PERMISSIVE FOR DELETE TO "authenticated" USING (auth.jwt() ->> 'role' = 'admin');--> statement-breakpoint
CREATE POLICY "select-thread-keywords-policy" ON "thread_keywords" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM threads 
        WHERE threads.thread_id = "thread_keywords"."thread_id" 
        AND threads.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "insert-thread-keywords-policy" ON "thread_keywords" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM threads 
        WHERE threads.thread_id = "thread_keywords"."thread_id" 
        AND threads.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "delete-thread-keywords-policy" ON "thread_keywords" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM threads 
        WHERE threads.thread_id = "thread_keywords"."thread_id" 
        AND threads.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "select-thread-properties-policy" ON "thread_properties" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM threads 
        WHERE threads.thread_id = "thread_properties"."thread_id" 
        AND threads.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "insert-thread-properties-policy" ON "thread_properties" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM threads 
        WHERE threads.thread_id = "thread_properties"."thread_id" 
        AND threads.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "delete-thread-properties-policy" ON "thread_properties" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM threads 
        WHERE threads.thread_id = "thread_properties"."thread_id" 
        AND threads.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "select-user-insights-policy" ON "user_insights" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_insights"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-user-insights-policy" ON "user_insights" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_insights"."profile_id");--> statement-breakpoint
CREATE POLICY "update-user-insights-policy" ON "user_insights" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_insights"."profile_id") WITH CHECK ((select auth.uid()) = "user_insights"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-user-insights-policy" ON "user_insights" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_insights"."profile_id");--> statement-breakpoint
CREATE POLICY "select-user-metrics-policy" ON "user_metrics" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "user_metrics"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-user-metrics-policy" ON "user_metrics" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_metrics"."profile_id");--> statement-breakpoint
CREATE POLICY "update-user-metrics-policy" ON "user_metrics" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "user_metrics"."profile_id") WITH CHECK ((select auth.uid()) = "user_metrics"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-user-metrics-policy" ON "user_metrics" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_metrics"."profile_id");