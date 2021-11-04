const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", ipcRenderer);
