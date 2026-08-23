CREATE TABLE "gallery_asset_visibility" (
	"imageUrl" text PRIMARY KEY NOT NULL,
	"hiddenAt" timestamp with time zone DEFAULT now() NOT NULL
);
