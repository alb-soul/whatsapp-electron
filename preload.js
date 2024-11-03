const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message) => ipcRenderer.send('new-message', message)
});
