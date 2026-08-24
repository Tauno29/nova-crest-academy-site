# Netlify live diagnosis notes

The deployed site identified from the user’s deployment name is `https://novacrestacademy.netlify.app/`.

A direct page extraction of the live homepage returned the Nova Crest navigation, announcement banner, hero copy, and footer links. The live page exposed `/learner-portal` and `/admin` navigation routes. The separate visual browser view unexpectedly opened at `about:blank`, so visual confirmation from the sandbox browser was not reliable for this live-site check.

User-reported deployed symptoms remain: homepage/gallery images are not displaying, and submitting details in the Admin Panel returns “unable to transform response from server.” The next checks should inspect the live HTML image `src` values and call the deployed `/api/trpc` route directly, while keeping all requests read-only or deliberately invalid.

## Latest live check (2026-08-24)

After the user’s redeploy, `https://novacrestacademy.netlify.app/api/trpc/publicSite.alert` returns HTTP 200 JSON, so the serverless API bundle repair is active. The homepage HTML and deployed JavaScript reference the new `/manus-storage/...` paths.

Every durable media path returns HTTP 500 with the exact body `Storage proxy not configured`. The deployed Express storage proxy reads `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY` from `server/_core/env.ts`; these variables are available in the managed WebDev runtime but are absent from the external Netlify Function environment. The remaining production image issue is therefore Netlify environment configuration, not React rendering or tRPC serialization.
