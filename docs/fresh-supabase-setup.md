# Fresh Supabase setup

This project is prepared for a new, user-owned Supabase PostgreSQL project. The repository does not contain the previous project’s connection string, database password, migration-copy scripts, or source-database fallback. The application runtime reads only the server-side `SUPABASE_DATABASE_URL` variable.

## 1. Create the empty database schema

Open the new Supabase project, go to **SQL Editor**, choose **New query**, paste the complete contents of [`supabase-fresh-schema.sql`](./supabase-fresh-schema.sql), and select **Run**. The script creates empty tables and enables row-level security. It does not insert administrator accounts, passwords, parent PINs, learners, test data, or other records.

The schema uses an idempotent PostgreSQL `DO $$ ... EXCEPTION WHEN duplicate_object ... $$` block for the `user_role` type. This is required because PostgreSQL does not support `CREATE TYPE IF NOT EXISTS` in the same way it supports `CREATE TABLE IF NOT EXISTS`. If the SQL Editor reports a statement error, run the complete corrected file again from the beginning; every table statement is rerunnable.

## 2. Connect the application later

The only application database value required is:

| Variable | Purpose | Where it belongs |
|---|---|---|
| `SUPABASE_DATABASE_URL` | Server-side PostgreSQL connection string for the new Supabase project | Project environment/secrets settings, never client code or chat |

Use the Supabase-provided connection pooler URI, normally the SSL-enabled port `6543`. Do not use the old project’s URI. The application intentionally does not read `DATABASE_URL` or `DRIZZLE_DATABASE_URL`.

## 3. Fresh-start behavior before connection

Without `SUPABASE_DATABASE_URL`, public pages continue to render their safe fallback content and database-backed procedures return their configured empty or fallback responses. Admin persistence and live learner data remain unavailable until the new secret is configured.

## 4. Initial administrator

The schema intentionally does not create an administrator account. Configure the administrator credential through the project’s secure administrator settings after the new database is connected. Do not place credentials in SQL, source files, or public environment variables.
