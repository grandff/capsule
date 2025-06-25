CREATE TYPE "public"."notification_type" AS ENUM('thread', 'X', 'following', 'challenge');--> statement-breakpoint
CREATE TYPE "public"."trend_type" AS ENUM('trending', 'topic', 'users', 'hot');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('mood', 'work', 'tone');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('thread', 'X');--> statement-breakpoint
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_trend_keyword_id_trend_keywords_trend_keyword_id_fk" FOREIGN KEY ("trend_keyword_id") REFERENCES "public"."trend_keywords"("trend_keyword_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_property_id_properties_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("property_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_keyword_id_keywords_keyword_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("keyword_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;