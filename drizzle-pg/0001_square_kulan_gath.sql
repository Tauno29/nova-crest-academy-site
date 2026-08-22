CREATE TABLE "attendance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"learnerId" integer NOT NULL,
	"attendanceDate" timestamp with time zone NOT NULL,
	"status" varchar(20) NOT NULL,
	"note" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "urgent_update_reads" (
	"parentAccountId" integer NOT NULL,
	"updateId" integer NOT NULL,
	"readAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "urgent_update_reads_parentAccountId_updateId_pk" PRIMARY KEY("parentAccountId","updateId")
);
--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_learnerId_learners_id_fk" FOREIGN KEY ("learnerId") REFERENCES "public"."learners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urgent_update_reads" ADD CONSTRAINT "urgent_update_reads_parentAccountId_parent_accounts_id_fk" FOREIGN KEY ("parentAccountId") REFERENCES "public"."parent_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urgent_update_reads" ADD CONSTRAINT "urgent_update_reads_updateId_urgent_updates_id_fk" FOREIGN KEY ("updateId") REFERENCES "public"."urgent_updates"("id") ON DELETE cascade ON UPDATE no action;