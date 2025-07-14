CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TABLE "thread_media" (
	"media_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "thread_media_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"thread_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"media_type" "media_type" NOT NULL,
	"original_filename" text NOT NULL,
	"public_url" text NOT NULL,
	"file_size" bigint NOT NULL,
	"mime_type" text NOT NULL,
	"storage_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "thread_media" ADD CONSTRAINT "thread_media_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_media" ADD CONSTRAINT "thread_media_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "thread_media_thread_idx" ON "thread_media" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "thread_media_profile_idx" ON "thread_media" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "thread_media_type_idx" ON "thread_media" USING btree ("media_type");