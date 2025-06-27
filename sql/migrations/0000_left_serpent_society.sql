CREATE TYPE "public"."notification_type" AS ENUM('thread', 'X', 'following', 'challenge');--> statement-breakpoint
CREATE TYPE "public"."trend_type" AS ENUM('trending', 'topic', 'users', 'hot');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('mood', 'work', 'tone');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('thread', 'X');--> statement-breakpoint
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
	"threads_connect" boolean DEFAULT false,
	"threads_access_token" text,
	"threads_expires_at" timestamp,
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
CREATE TABLE "threads" (
	"thread_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "threads_thread_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"short_text" text NOT NULL,
	"thread" text NOT NULL,
	"property_id" bigint,
	"keyword_id" bigint,
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
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_trend_keyword_id_trend_keywords_trend_keyword_id_fk" FOREIGN KEY ("trend_keyword_id") REFERENCES "public"."trend_keywords"("trend_keyword_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_property_id_properties_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("property_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_keyword_id_keywords_keyword_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("keyword_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select-payment-policy" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "edit-profile-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id") WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "insert-setting-policy" ON "setting" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "edit-setting-policy" ON "setting" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "setting"."profile_id") WITH CHECK ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-setting-policy" ON "setting" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "setting"."profile_id");--> statement-breakpoint
CREATE POLICY "select-setting-policy" ON "setting" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "setting"."profile_id");