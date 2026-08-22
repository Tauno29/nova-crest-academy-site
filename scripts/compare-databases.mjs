import mysql from "mysql2/promise";
import postgres from "postgres";

const tables = ["users", "classes", "learners", "parent_accounts", "parent_account_learners", "performance_entries", "site_content", "documents", "urgent_updates"];
const source = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 1 });
const target = postgres(process.env.SUPABASE_DATABASE_URL, { max: 1, ssl: "require" });
try {
  const result = {};
  for (const table of tables) {
    try {
      const [rows] = await source.query("SELECT COUNT(*) AS count FROM `" + table + "`");
      result[`source_${table}`] = Number(rows[0].count);
    } catch { result[`source_${table}`] = "missing"; }
    try {
      const rows = await target.unsafe(`select count(*)::int as count from public."${table}"`);
      result[`supabase_${table}`] = Number(rows[0].count);
    } catch { result[`supabase_${table}`] = "missing"; }
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await source.end();
  await target.end({ timeout: 5 });
}
