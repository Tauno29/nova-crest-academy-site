import fs from "node:fs/promises";
import postgres from "postgres";

const url = process.env.SUPABASE_DATABASE_URL;
if (!url?.startsWith("postgres")) throw new Error("SUPABASE_DATABASE_URL must be a PostgreSQL URI");
const sql = postgres(url, { max: 1, ssl: "require", connect_timeout: 10 });
const migration = await fs.readFile(new URL("../drizzle-pg/0000_wandering_mongu.sql", import.meta.url), "utf8");
try {
  for (const statement of migration.split(/--?> statement-breakpoint/).map(part => part.trim()).filter(Boolean)) {
    await sql.unsafe(statement);
  }
  const tables = await sql`select table_name from information_schema.tables where table_schema = 'public' and table_name in ('users','classes','learners','parent_accounts','parent_account_learners','performance_entries','site_content','documents','urgent_updates') order by table_name`;
  console.log(JSON.stringify({ applied: true, tables: tables.map(row => row.table_name) }, null, 2));
} finally {
  await sql.end({ timeout: 5 });
}
