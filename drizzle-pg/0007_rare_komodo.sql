CREATE TABLE "learner_portal_records" (
	"learnerId" integer PRIMARY KEY NOT NULL,
	"behaviorNotes" text DEFAULT '' NOT NULL,
	"term1Report" text DEFAULT '' NOT NULL,
	"term2Report" text DEFAULT '' NOT NULL,
	"term3Report" text DEFAULT '' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "learner_portal_records" ADD CONSTRAINT "learner_portal_records_learnerId_learners_id_fk" FOREIGN KEY ("learnerId") REFERENCES "public"."learners"("id") ON DELETE cascade ON UPDATE no action;