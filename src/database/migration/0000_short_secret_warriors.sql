CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"google_id" text,
	"discord_id" text,
	"email" text NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "user_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
