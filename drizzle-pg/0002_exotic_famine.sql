ALTER TABLE "documents" ADD COLUMN "importStatus" varchar(30) DEFAULT 'uploaded' NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "importedRows" integer DEFAULT 0 NOT NULL;