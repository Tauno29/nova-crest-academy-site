# Vercel live findings — 2026-08-25

The deployment URL shown in the user screenshots (`novacrestacademy-d9bhfbf8td-taunos-projects-d4e38e21.vercel.app`) currently returns Vercel `404 NOT_FOUND / DEPLOYMENT_NOT_FOUND`, so it is an old or removed deployment and cannot be used for final verification.

The stable domain `https://novacrestacademy.vercel.app/learner-portal` currently serves the Nova Crest Learner Portal page and loads its HTML, JavaScript, CSS, font, and logo assets successfully. The stable domain shows the expected Student ID and PIN form with no error before submission.

The user’s screenshot captured a different live state: `POST /api/trpc/learner.login?batch=1` returned HTTP 500 with `content-type: text/plain`, `Server: Vercel`, and `x-vercel-error: FUNCTION_INVOCATION_FAILED`. This proves the request reached Vercel but the function crashed during invocation; it is distinct from the prior JSON parsing symptom.

## Stable-domain reproduction

On `https://novacrestacademy.vercel.app/learner-portal`, submitting deliberately invalid non-sensitive credentials (`NOT-A-REAL-STUDENT-ID` / `0000`) reproduces the same UI message: `Unexpected token 'A', "A server e"... is not valid JSON`. This confirms the stable Vercel deployment still returns a plain-text HTTP 500 from the live function, rather than a JSON tRPC error. The user’s screenshot showed the corresponding request headers: `POST /api/trpc/learner.login?batch=1`, status `500 Internal Server Error`, `content-type: text/plain; charset=utf-8`, and `x-vercel-error: FUNCTION_INVOCATION_FAILED`.

## Runtime diagnosis and fix

A public and learner tRPC request on the stable Vercel domain both returned HTTP 500 plain text with `FUNCTION_INVOCATION_FAILED`, proving the whole API function invocation was failing, not merely the learner credential check. The Vercel Node runtime documentation states that `/api` functions should use a Web Standard `fetch` export or a Node `(request, response)` handler; the temporary `serverless-http` adapter was therefore removed from the Vercel handlers because it targets AWS Lambda-style events.

The dedicated `/api/trpc/[...path].ts` handler now uses `fetchRequestHandler` with endpoint `/api/trpc`, the existing `appRouter`, and a Vercel-native context that adapts Web `Request` and `Headers` to the existing session procedures and serializes secure cookies. A local fetch-level smoke test against the bundled handler returned `learner.login: 500 JSON` (database unavailable in the sandbox, but correctly encoded as tRPC JSON) and `admin.login: 401 JSON` for deliberately invalid credentials. No function invocation crash occurred.

References: https://vercel.com/docs/functions/runtimes/node-js; https://vercel.com/kb/guide/ship-a-express-app-on-vercel; the installed tRPC fetch-adapter guidance at `@trpc/server/skills/adapter-fetch/SKILL.md`.
