const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('novaCrestDesktop', {
  platform: process.platform,
  version: '1.0.0',
  login: credentials => ipcRenderer.invoke('admin-login', credentials),
  openWebAdmin: route => ipcRenderer.invoke('open-web-admin', route),
});
