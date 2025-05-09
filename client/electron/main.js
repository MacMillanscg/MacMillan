const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.webContents.openDevTools(); // Optional: Open DevTools for debugging
}

app.on("ready", createWindow);

ipcMain.handle("save-file", async (event, { fileName, xmlContent }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: "Save XML File",
    defaultPath: path.join(
      app.getPath("documents"),
      fileName || "converted.xml"
    ),
    filters: [{ name: "XML Files", extensions: ["xml"] }],
  });

  if (filePath) {
    fs.writeFileSync(filePath, xmlContent);
    return "File saved successfully!";
  } else {
    throw new Error("File save canceled");
  }
});
