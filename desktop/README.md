# Nova Crest Admin Desktop

This directory contains the Windows desktop replacement shell for the Nova Crest administrator workspace. It is intentionally separate from the existing React web app so the recoverable web admin remains available while the desktop client is completed.

## Local development

From a Windows machine with Node.js installed, run `pnpm install` inside this directory and then `pnpm start`. The current shell is a reference-inspired visual workspace with navigation for the same operational areas as the web admin. Supabase and tRPC wiring will be connected through the preload boundary rather than exposing database secrets to the renderer.

## Windows packaging

Run `pnpm package:win` from Windows to create an NSIS installer and a portable executable in the generated `dist` directory. The package uses Electron context isolation, disables renderer Node integration, and opens external links in the system browser.

## Data security

Never put `SUPABASE_DATABASE_URL`, database passwords, or server-only EmailJS keys in this directory or in renderer JavaScript. The production design should call the existing authenticated server API over HTTPS, or use a narrowly scoped Supabase client with only public-safe credentials.
