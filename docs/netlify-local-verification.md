# Local Netlify Function verification

Verified locally on 2026-08-24 using the production-style Netlify Function entrypoint at `netlify/functions/api.ts`. The temporary smoke harness was removed after execution and no credentials or test mutations were retained.

| Request | Result | Meaning |
|---|---:|---|
| `GET /api/trpc/publicSite.alert` | 200 | Public tRPC query resolves through the serverless Express adapter and can read the configured public alert. |
| `GET /api/trpc/admin.learners.list` without a session | 403 | Admin route is protected by the existing role guard. |
| `POST /api/trpc/learner.login` with a deliberately nonexistent Student ID and PIN | 401 | Learner authentication rejects invalid credentials without creating a session. |
| `POST /api/desktop/login` with deliberately invalid credentials | 401 | Admin desktop-login compatibility endpoint rejects invalid credentials. |
| `GET /api/oauth/callback` without `code` and `state` | 400 | OAuth callback validation is active and does not proceed without required parameters. |

The smoke test did not send an Admissions email, create or edit a learner, write a mark, upload a file, or modify production data. The Vite publish build, API function bundle check, TypeScript check, and full Vitest suite also passed during the same deployment-preparation cycle.

The local result is a strong pre-deployment check, not a substitute for a Netlify preview deployment with the production environment variables configured. The preview should still verify cookies, Supabase connectivity, EmailJS delivery, OAuth callback behavior, and managed gallery storage from the deployed domain.
