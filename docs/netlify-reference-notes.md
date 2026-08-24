# Netlify deployment reference notes

Sources consulted on 2026-08-24:

- [Express on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/): Express applications can be deployed as Netlify Functions. The documented pattern creates a function file under `netlify/functions/`, wraps the Express app with `serverless-http`, and routes `/api/*` to `/.netlify/functions/api/:splat`. The example config uses the esbuild Node bundler and lists Express as an external module.
- [Vite on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/): Vite projects use the normal build command and publish the `dist` directory. Client-side routed SPAs require a rewrite serving `index.html` for all browser routes.

Project implication: the existing project builds its client to `dist/public` and bundles a long-running Express server to `dist/index.js`, so Netlify preparation needs a dedicated Vite publish build plus a serverless function wrapper for the tRPC/API surface. Secrets must be entered in Netlify’s environment-variable settings and must not be committed.
