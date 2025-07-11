ALTER TABLE "oauth" ALTER COLUMN "access_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth" ALTER COLUMN "refresh_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth" ADD COLUMN "token_expire" timestamp with time zone NOT NULL;