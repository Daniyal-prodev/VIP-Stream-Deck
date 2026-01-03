const { BrowserWindow } = require("electron");
const path = require("path");

function triggerAlert(task) {
  const alertWin = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Use a query param to tell the UI to show the alert view
  const alertData = encodeURIComponent(JSON.stringify(task));
  alertWin.loadURL(`http://localhost:5173/?alert=${alertData}`);
}

module.exports = { triggerAlert };

