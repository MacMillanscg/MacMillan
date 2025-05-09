const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  },
});
console.log("Preload script loaded"); // For debugging: Ensure this is logged in the console
