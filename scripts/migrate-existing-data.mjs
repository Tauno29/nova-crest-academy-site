import mysql from "mysql2/promise";
import postgres from "postgres";

const source = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 1 });
const target = postgres(process.env.SUPABASE_DATABASE_URL, { max: 1, ssl: "require" });
try {
  const [users] = await source.query("SELECT openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn FROM users");
  for (const user of users) {
    await target`
      insert into public."users" ("openId", "name", "email", "loginMethod", "role", "createdAt", "updatedAt", "lastSignedIn")
      values (${user.openId}, ${user.name}, ${user.email}, ${user.loginMethod}, ${user.role}, ${user.createdAt}, ${user.updatedAt}, ${user.lastSignedIn})
      on conflict ("openId") do update set "name" = excluded."name", "email" = excluded."email", "loginMethod" = excluded."loginMethod", "role" = excluded."role", "updatedAt" = excluded."updatedAt", "lastSignedIn" = excluded."lastSignedIn"
    `;
  }
  console.log(JSON.stringify({ migratedUsers: users.length }, null, 2));
} finally {
  await source.end();
  await target.end({ timeout: 5 });
}
