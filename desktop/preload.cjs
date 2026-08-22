const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('novaCrestDesktop', {
  platform: process.platform,
  version: '1.0.0',
  openWebAdmin: () => require('electron').ipcRenderer.invoke('open-web-admin'),
});
