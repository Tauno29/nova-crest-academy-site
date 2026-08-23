# Nova Crest Admin Desktop

This directory contains the separate Electron desktop client for the Nova Crest administrator workspace. The public website no longer exposes the retired web Admin Panel taskbar link. The existing React admin route remains recoverable in project history while the desktop replacement is being completed.

## Local development

From a Windows machine with Node.js and pnpm installed, run `pnpm install` inside this directory and then `pnpm start`. The branded desktop shell provides the administrator sign-in and navigation. The login is sent through Electron's main process to `/api/desktop/login`; credentials are not stored in the renderer, and the resulting short-lived `nova_admin_session` cookie is kept in the Electron session.

Set `NOVA_ADMIN_WEB_URL` when the server is not the default project preview URL. For example, in PowerShell:

```powershell
$env:NOVA_ADMIN_WEB_URL = "https://your-school-domain.example"
pnpm start
```

After authentication, **Open live school workspace** reuses that secure session to load the Supabase-backed management workflows inside the Electron window. The server remains the only place where the database URL, JWT secret, and private EmailJS credentials are available.

## Windows packaging

On Windows, run `pnpm package:win` to create an NSIS installer and a portable executable in `dist`. The validated cross-platform source build can also be produced with:

```powershell
pnpm exec electron-builder --win dir
```

The Linux sandbox can validate the unpacked `dist/win-unpacked` bundle, but it cannot reliably produce the signed NSIS installer because Windows signing and Wine-based installer tooling are not available here. Build the installer locally on Windows for the final distributable.

## Data security

Never put `SUPABASE_DATABASE_URL`, database passwords, or server-only EmailJS keys in this directory or in renderer JavaScript. The desktop client calls the existing authenticated server API over HTTPS through a narrow main-process IPC boundary. Electron context isolation is enabled, renderer Node integration is disabled, and external links open in the system browser.
