import { describe, expect, it } from "vitest";
import postgres from "postgres";

describe.skipIf(!process.env.SUPABASE_DATABASE_URL)("Supabase database configuration", () => {
  it("connects to PostgreSQL and responds to a lightweight query", async () => {
    const url = process.env.SUPABASE_DATABASE_URL;
    expect(url).toBeTruthy();
    expect(url).toMatch(/^postgres(ql)?:\/\//);
    const sql = postgres(url!, { max: 1, connect_timeout: 5, idle_timeout: 1, ssl: "require" });
    try {
      const rows = await sql`select 1 as connected`;
      expect(rows[0]?.connected).toBe(1);
    } finally {
      await sql.end({ timeout: 2 });
    }
  }, 15000);
});
