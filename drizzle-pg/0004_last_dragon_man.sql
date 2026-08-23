CREATE TABLE "fee_structures" (
	"id" serial PRIMARY KEY NOT NULL,
	"academicYear" varchar(20) NOT NULL,
	"kindergarten" varchar(80) NOT NULL,
	"prePrimary" varchar(80) NOT NULL,
	"grade1to3" varchar(80) NOT NULL,
	"developmentFund" varchar(80) NOT NULL,
	"hostelBoarding" varchar(80) NOT NULL,
	"registrationFee" varchar(80) NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fee_structures_academicYear_unique" UNIQUE("academicYear")
);
--> statement-breakpoint
CREATE TABLE "gallery_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"category" varchar(80) NOT NULL,
	"imageUrl" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_contact_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(80) NOT NULL,
	"whatsapp" varchar(80) NOT NULL,
	"email" varchar(320) NOT NULL,
	"location" varchar(180) NOT NULL,
	"postalBox" varchar(180) NOT NULL,
	"registrationNumber" varchar(80) NOT NULL,
	"nextTermDate" varchar(80) NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_alert_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL,
	"message" text NOT NULL,
	"buttonLabel" varchar(80) NOT NULL,
	"destination" varchar(255) NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
