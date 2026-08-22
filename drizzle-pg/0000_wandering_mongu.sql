CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(255) NOT NULL,
	"storageKey" text NOT NULL,
	"storageUrl" text NOT NULL,
	"mimeType" varchar(120) NOT NULL,
	"uploadedBy" varchar(320) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learners" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(160) NOT NULL,
	"surname" varchar(120) NOT NULL,
	"className" varchar(80) NOT NULL,
	"classId" integer,
	"parentAccountId" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_account_learners" (
	"parentAccountId" integer NOT NULL,
	"learnerId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parent_account_learners_parentAccountId_learnerId_pk" PRIMARY KEY("parentAccountId","learnerId")
);
--> statement-breakpoint
CREATE TABLE "parent_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(80) NOT NULL,
	"accessCodeHash" varchar(128) NOT NULL,
	"parentName" varchar(160) NOT NULL,
	"parentEmail" varchar(320),
	"active" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parent_accounts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "performance_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"learnerId" integer NOT NULL,
	"activityName" varchar(160) NOT NULL,
	"activityType" varchar(60) NOT NULL,
	"marks" integer NOT NULL,
	"totalMarks" integer NOT NULL,
	"performedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"contentKey" varchar(100) NOT NULL,
	"title" varchar(180) NOT NULL,
	"body" text NOT NULL,
	"imageUrl" text,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_content_contentKey_unique" UNIQUE("contentKey")
);
--> statement-breakpoint
CREATE TABLE "urgent_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"body" text NOT NULL,
	"isPublished" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "learners" ADD CONSTRAINT "learners_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learners" ADD CONSTRAINT "learners_parentAccountId_parent_accounts_id_fk" FOREIGN KEY ("parentAccountId") REFERENCES "public"."parent_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_account_learners" ADD CONSTRAINT "parent_account_learners_parentAccountId_parent_accounts_id_fk" FOREIGN KEY ("parentAccountId") REFERENCES "public"."parent_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_account_learners" ADD CONSTRAINT "parent_account_learners_learnerId_learners_id_fk" FOREIGN KEY ("learnerId") REFERENCES "public"."learners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_entries" ADD CONSTRAINT "performance_entries_learnerId_learners_id_fk" FOREIGN KEY ("learnerId") REFERENCES "public"."learners"("id") ON DELETE cascade ON UPDATE no action;