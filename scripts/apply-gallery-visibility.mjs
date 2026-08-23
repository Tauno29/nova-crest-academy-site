import postgres from "postgres";

const url = process.env.SUPABASE_DATABASE_URL;
if (!url) throw new Error("SUPABASE_DATABASE_URL is required");
const sql = postgres(url, { max: 1, connect_timeout: 10, idle_timeout: 1, ssl: "require" });
try {
  await sql`create table if not exists "gallery_asset_visibility" ("imageUrl" text primary key not null, "hiddenAt" timestamptz not null default now())`;
  console.log("gallery_asset_visibility ready");
} finally {
  await sql.end({ timeout: 2 });
}
