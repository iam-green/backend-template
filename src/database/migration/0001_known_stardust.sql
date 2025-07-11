CREATE TYPE "public"."oauth_type" AS ENUM('google', 'discord');--> statement-breakpoint
CREATE TABLE "oauth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oauth_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "oauth_type" NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_google_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_discord_id_unique";--> statement-breakpoint
ALTER TABLE "oauth" ADD CONSTRAINT "oauth_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "google_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "discord_id";