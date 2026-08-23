import postgres from "postgres";
const connectionString = process.env.SUPABASE_DATABASE_URL;
if (!connectionString) throw new Error("SUPABASE_DATABASE_URL is not configured");
const sql = postgres(connectionString, { ssl: "require", max: 1 });
try {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_content'`;
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'site_content' ORDER BY ordinal_position`;
  console.log(JSON.stringify({ tables, columns }));
} finally { await sql.end({ timeout: 5 }); }
