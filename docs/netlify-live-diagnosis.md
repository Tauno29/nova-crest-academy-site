# Netlify live diagnosis notes

The deployed site identified from the user’s deployment name is `https://novacrestacademy.netlify.app/`.

A direct page extraction of the live homepage returned the Nova Crest navigation, announcement banner, hero copy, and footer links. The live page exposed `/learner-portal` and `/admin` navigation routes. The separate visual browser view unexpectedly opened at `about:blank`, so visual confirmation from the sandbox browser was not reliable for this live-site check.

User-reported deployed symptoms remain: homepage/gallery images are not displaying, and submitting details in the Admin Panel returns “unable to transform response from server.” The next checks should inspect the live HTML image `src` values and call the deployed `/api/trpc` route directly, while keeping all requests read-only or deliberately invalid.

## Latest live check (2026-08-24)

After the user’s redeploy, `https://novacrestacademy.netlify.app/api/trpc/publicSite.alert` returns HTTP 200 JSON, so the serverless API bundle repair is active. The first managed-media implementation depended on `/manus-storage/...`, but those paths returned HTTP 500 because the external Netlify Function did not have Manus Forge credentials.

The managed Gallery upload and deletion paths now use the user’s public `school-images` Supabase Storage bucket through server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` variables. Reference media already uses verified public Supabase URLs. Netlify no longer needs the Forge storage variables for Gallery Media operations.
