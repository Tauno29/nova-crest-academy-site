const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('node:path');
let mainWindow;

ipcMain.handle('open-web-admin', async () => { const target = process.env.NOVA_ADMIN_WEB_URL || 'https://3000-ia1x5wbzthk1qja7jaxzo-b85f4df3.us5.manus.computer/admin'; if (mainWindow) await mainWindow.loadURL(target); return { opened: true }; });

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
app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
