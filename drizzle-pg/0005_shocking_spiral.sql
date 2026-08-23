ALTER TABLE "learners" ADD COLUMN "studentId" varchar(80);--> statement-breakpoint
ALTER TABLE "learners" ADD COLUMN "parentPinHash" varchar(128);--> statement-breakpoint
ALTER TABLE "learners" ADD COLUMN "teacher" varchar(160);--> statement-breakpoint
ALTER TABLE "learners" ADD COLUMN "subjects" text;