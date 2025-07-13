CREATE TYPE "public"."notification_type" AS ENUM('thread', 'X', 'following', 'challenge');--> statement-breakpoint
CREATE TYPE "public"."trend_type" AS ENUM('trending', 'topic', 'users', 'hot');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('thread', 'X');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('mood', 'work');--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"payment_key" text NOT NULL,
	"order_id" text NOT NULL,
	"order_name" text NOT NULL,
	"total_amount" double precision NOT NULL,
	"metadata" jsonb NOT NULL,
	"raw_data" jsonb NOT NULL,
	"receipt_url" text NOT NULL,
	"status" text NOT NULL,
	"user_id" uuid,
	"approved_at" timestamp NOT NULL,
	"requested_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notifications" (
	"notification_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"notification_type" "notification_type" NOT NULL,
	"notification_content" text NOT NULL,
	"profile_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trend_keywords" (
	"trend_keyword_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trend_keywords_trend_keyword_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"sort_seq" integer NOT NULL,
	"trend_keyword" text NOT NULL,
	"trend_keyword_rank" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trends" (
	"trend_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trends_trend_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"trend_date" date NOT NULL,
	"trend_content" text NOT NULL,
	"trend_type" "trend_type" NOT NULL,
	"trend_rank" integer NOT NULL,
	"trend_keyword_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"avatar_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "setting" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'dark' NOT NULL,
	"font_size" text DEFAULT 'default' NOT NULL,
	"color_blind_mode" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "setting" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
CREATE TABLE "keywords" (
	"keyword_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "keywords_keyword_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"sort_seq" integer DEFAULT 0 NOT NULL,
	"keyword" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"property_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "properties_property_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"sort_seq" integer DEFAULT 0 NOT NULL,
	"property_type" "property_type" NOT NULL,
	"property" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_keywords" (
	"thread_id" bigint NOT NULL,
	"keyword_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_keywords_thread_id_keyword_id_pk" PRIMARY KEY("thread_id","keyword_id")
);
--> statement-breakpoint
CREATE TABLE "thread_properties" (
	"thread_id" bigint NOT NULL,
	"property_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_properties_thread_id_property_id_pk" PRIMARY KEY("thread_id","property_id")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"thread_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "threads_thread_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"short_text" text NOT NULL,
	"thread" text NOT NULL,
	"target_type" "target_type" NOT NULL,
	"send_flag" boolean DEFAULT false NOT NULL,
	"result_id" text,
	"profile_id" uuid,
	"share_cnt" integer DEFAULT 0 NOT NULL,
	"like_cnt" integer DEFAULT 0 NOT NULL,
	"comment_cnt" integer DEFAULT 0 NOT NULL,
	"view_cnt" integer DEFAULT 0 NOT NULL,
	"now_follow_cnt" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_insights" (
	"insight_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_insights_insight_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid NOT NULL,
	"thread_id" bigint NOT NULL,
	"metric_name" text NOT NULL,
	"metric_type" text NOT NULL,
	"period" text NOT NULL,
	"value" integer NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_metrics" (
	"metric_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_metrics_metric_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid NOT NULL,
	"metric_name" text NOT NULL,
	"total_value" integer NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_trend_keyword_id_trend_keywords_trend_keyword_id_fk" FOREIGN KEY ("trend_keyword_id") REFERENCES "public"."trend_keywords"("trend_keyword_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sns_profiles" ADD CONSTRAINT "sns_profiles_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_keywords" ADD CONSTRAINT "thread_keywords_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_keywords" ADD CONSTRAINT "thread_keywords_keyword_id_keywords_keyword_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("keyword_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_properties" ADD CONSTRAINT "thread_properties_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_properties" ADD CONSTRAINT "thread_properties_property_id_properties_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("property_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_insights" ADD CONSTRAINT "user_insights_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_insights" ADD CONSTRAINT "user_insights_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metrics" ADD CONSTRAINT "user_metrics_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "keyword_idx" ON "keywords" USING btree ("keyword");--> statement-breakpoint
CREATE INDEX "property_idx" ON "properties" USING btree ("property");--> statement-breakpoint
CREATE INDEX "property_type_idx" ON "properties" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "profile_thread_idx" ON "user_insights" USING btree ("profile_id","thread_id");--> statement-breakpoint
CREATE INDEX "metric_idx" ON "user_insights" USING btree ("metric_name");--> statement-breakpoint
CREATE INDEX "end_time_idx" ON "user_insights" USING btree ("end_time");--> statement-breakpoint
CREATE INDEX "profile_metric_idx" ON "user_metrics" USING btree ("profile_id","metric_name");--> statement-breakpoint
CREATE POLICY "select-payment-policy" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "edit-profile-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id") WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-setting-policy" ON "setting" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "edit-setting-policy" ON "setting" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "setting"."profile_id") WITH CHECK ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-setting-policy" ON "setting" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "select-setting-policy" ON "setting" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "sns_profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "edit-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "sns_profiles"."profile_id") WITH CHECK ((select auth.uid()) = "sns_profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "sns_profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-sns-profile-policy" ON "sns_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "sns_profiles"."profile_id");