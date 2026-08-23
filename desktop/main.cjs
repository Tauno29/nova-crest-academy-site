const { app, BrowserWindow, shell, ipcMain, session } = require('electron');
const path = require('node:path');

let mainWindow;

function adminTarget() {
  return process.env.NOVA_ADMIN_WEB_URL || 'https://3000-ia1x5wbzthk1qja7jaxzo-b85f4df3.us5.manus.computer';
}

ipcMain.handle('admin-login', async (_event, credentials) => {
  const target = adminTarget();
  const response = await fetch(`${target}/api/desktop/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Unable to sign in to the Nova Crest admin service.');
  const cookies = response.headers.getSetCookie?.() || [];
  for (const rawCookie of cookies) {
    const [nameValue] = rawCookie.split(';', 1);
    const separator = nameValue.indexOf('=');
    if (separator < 1) continue;
    await session.defaultSession.cookies.set({
      url: target,
      name: nameValue.slice(0, separator),
      value: nameValue.slice(separator + 1),
      secure: target.startsWith('https://'),
      httpOnly: true,
      path: '/',
      expirationDate: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
    });
  }
  return payload;
});

const allowedAdminRoutes = new Set(['/admin', '/admin/learners', '/admin/parents', '/admin/marks', '/admin/attendance', '/admin/updates', '/admin/documents', '/admin/content']);
ipcMain.handle('open-web-admin', async (_event, route = '/admin') => {
  const safeRoute = allowedAdminRoutes.has(route) ? route : '/admin';
  if (mainWindow) await mainWindow.loadURL(`${adminTarget()}${safeRoute}`);
  return { opened: true, route: safeRoute };
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#f7f3ee',
    title: 'Nova Crest Admin',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
