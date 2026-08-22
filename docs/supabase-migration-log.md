# Supabase Migration Log

## Target confirmation

The Nova Crest application is now configured to use the Supabase PostgreSQL project supplied by the project owner. The confirmed project reference is `gfejcueqmgjtqoocqfle`, the region is Central EU (Frankfurt), and the owner chose to continue with this project as the live target rather than create a separate staging project. The project connection was validated with a live `SELECT 1` query over SSL. The existing MySQL/TiDB database remains available as the fallback `DATABASE_URL` while the Supabase connection is preferred by the runtime helper.

## Schema migration

A clean PostgreSQL migration was generated under `drizzle-pg/0000_wandering_mongu.sql` and applied to the Supabase `public` schema. The migration created the `user_role` enum and the following tables: `users`, `classes`, `learners`, `parent_accounts`, `parent_account_learners`, `performance_entries`, `site_content`, `documents`, and `urgent_updates`. Foreign-key relationships were created for classes, parent-child links, and learner performance entries.

## Source comparison and data copy

A read-only count comparison found one existing row in the source `users` table and zero rows in the other Nova Crest tables. The idempotent data-copy script migrated that one user record into Supabase using the existing `openId` as the conflict key. No learner, parent-account, performance, content, document, or urgent-update records required copying. The original source database remains untouched, and the runtime can be restored by removing or changing `SUPABASE_DATABASE_URL` so it falls back to `DATABASE_URL`; this provides the tested application rollback path without deleting the Supabase target.

## Application verification

The PostgreSQL connection smoke test, TypeScript check, full Vitest suite, Drizzle consistency check, and production build passed after the adapter switch. EmailJS and S3 remain external service boundaries and were not moved into Supabase.

## Safety note

The migration scripts are additive and the original MySQL migration history remains in `drizzle/`. The source database was not modified by the comparison or copy scripts. Any future rollback should first switch the runtime connection back to the original `DATABASE_URL`, then separately remove Supabase objects only after confirming there is no active traffic depending on them.
