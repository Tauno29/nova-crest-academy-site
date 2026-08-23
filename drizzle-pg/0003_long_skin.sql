ALTER TABLE "site_content" ALTER COLUMN "contentKey" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "site_content" ADD COLUMN "published" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "site_content" ADD COLUMN "updatedBy" integer;--> statement-breakpoint
ALTER TABLE "site_content" DROP COLUMN "imageUrl";