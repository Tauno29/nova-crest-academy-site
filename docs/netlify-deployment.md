# External deployment guide

This project can be hosted on Manus, Netlify, or Vercel. Manus hosting remains the lowest-configuration option. The sections below document the external-host settings for the current full-stack API.

## Vercel deployment guide

Use the GitHub repository `Tauno29/nova-crest-academy-site` and the `main` branch. The repository includes `vercel.json`, which configures the Vite build output and the catch-all Vercel Node function at `api/[...path].ts`.

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `pnpm build:vercel` |
| Output directory | `dist/public` |
| Install command | `pnpm install --frozen-lockfile` |
| Node version | `22.x` |

The public reference images already use public Supabase Storage URLs, so they do not require Manus Forge credentials. Managed Gallery uploads use the server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` variables.

Vercel environment variables should use the same names and values documented below. Add them for the Production environment before the first deployment. Never expose server-only values through a `VITE_` variable.


This project is prepared for Netlify deployment but is **not published by this change**. Netlify can host the Vite frontend and expose the Express/tRPC API through a serverless function. The project keeps the existing local full-stack build and adds a Netlify-specific frontend build.

## Netlify site settings

Use the GitHub repository `Tauno29/nova-crest-academy-site` as the repository source, the `main` branch as the production branch, and the following settings:

| Setting | Value |
|---|---|
| Build command | `pnpm build:netlify` |
| Publish directory | `dist/public` |
| Functions directory | `netlify/functions` |
| Node version | `22` |
|

These values are already encoded in `netlify.toml`. The build command creates the Vite frontend in `dist/public`; Netlify packages `netlify/functions/api.ts` as the API function.

## Runtime environment variables

Add these in Netlify Site configuration → Environment variables. Enter values directly in Netlify; do not commit an `.env` file.

| Variable | Required | Purpose |
|---|---:|---|
| `SUPABASE_DATABASE_URL` | Yes | PostgreSQL connection used by learner, admin, admissions, content, and performance procedures. Use the Supabase connection string with SSL enabled. |
| `JWT_SECRET` | Yes | Signs and verifies admin, parent, learner, and application session cookies. Use a new long random value for this deployment. |
| `NOVA_ADMIN_EMAIL` | Yes | Administrator email accepted by the protected Admin Panel login. |
| `NOVA_ADMIN_PASSWORD` | Yes | Administrator password accepted by the protected Admin Panel login. |
| `VITE_APP_ID` | Required if using Manus OAuth | OAuth application identifier used by the browser and server. |
| `VITE_OAUTH_PORTAL_URL` | Required if using Manus OAuth | OAuth portal URL used by the browser login redirect. |
| `OAUTH_SERVER_URL` | Required if using Manus OAuth | OAuth backend URL used by the server callback. |
| `OWNER_OPEN_ID` | Required if using Manus OAuth | Owner identity used by the existing account synchronization logic. |
| `SUPABASE_URL` | Yes for managed Gallery uploads | Supabase project URL used by the server-side Storage adapter. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for managed Gallery uploads | Server-only Supabase Storage credential used to upload and delete objects. Never expose it as a client variable. |
| `VITE_EMAILJS_SERVICE_ID` | Yes for Admissions email | EmailJS service identifier embedded in the browser build. |
| `VITE_EMAILJS_TEMPLATE_ID` | Yes for Admissions email | EmailJS template identifier embedded in the browser build. |
| `VITE_EMAILJS_PUBLIC_KEY` | Yes for Admissions email | EmailJS browser-safe public key. |
| `EMAILJS_PRIVATE_KEY` | Yes for Admissions email | Server-side EmailJS private key used by the protected submission procedure. |
| `VITE_FRONTEND_FORGE_API_URL` | Optional | Browser-side Forge proxy URL used by the map component; the component has a default. |
| `VITE_FRONTEND_FORGE_API_KEY` | Optional | Browser-side Forge map key if the map integration is used. |

Netlify environment variables beginning with `VITE_` are included in the public browser bundle. Only use browser-safe values for those variables. Keep `SUPABASE_DATABASE_URL`, `JWT_SECRET`, `NOVA_ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, and `EMAILJS_PRIVATE_KEY` server-only.

## Routing provided by `netlify.toml`

The first rewrite sends `/api/*` to `/.netlify/functions/api/:splat`. This preserves the existing frontend contract for `/api/trpc`, `/api/oauth/callback`, `/api/desktop/login`, and related API routes. The second rewrite sends client-side Wouter routes such as `/admin`, `/admin/learners/2`, and `/learner-portal` to `/index.html` so direct visits and refreshes work.

## Supabase and storage prerequisites

The Supabase PostgreSQL schema must already be initialized before the first authenticated request. The existing SQL handoff under `docs/` remains the source for a fresh project. Netlify does not migrate database data automatically. Managed Gallery files are stored in the public `school-images` Supabase Storage bucket through server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` variables.

## Important compatibility note

Netlify Functions are request-based and do not provide the same long-running server process as the managed WebDev deployment. This configuration adapts the current API surface to a serverless Express function, but production behavior should be checked for database connection reuse, function execution limits, and external storage/API timeouts. If the school management workload needs a continuously running server, the project’s built-in hosting or another Node server host may be a better fit than Netlify.

## Local preflight

Run the following before connecting the repository in Netlify:

```bash
pnpm install --frozen-lockfile
pnpm build:netlify
pnpm test
pnpm check
```

The project should be connected to Netlify through the Git provider UI or Netlify CLI after these checks. Publishing was intentionally not performed here.
