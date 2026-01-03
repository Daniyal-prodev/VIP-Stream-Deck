const { app, BrowserWindow, ipcMain, Notification, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { createTray } = require("./tray");
const si = require('systeminformation');

// Disable Hardware Acceleration to prevent cache access/GPU errors on some Windows systems
app.disableHardwareAcceleration();


const PROFILES_DIR = path.join(__dirname, "../profiles");

// SINGLE INSTANCE LOCK
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Ensure profiles directory exists
if (!fs.existsSync(PROFILES_DIR)) {
  fs.mkdirSync(PROFILES_DIR);
}

// Store for active shorts
let registeredShortcuts = {};

function registerGlobalShortcuts(profile) {
  // Clear existing shortcuts
  globalShortcut.unregisterAll();
  registeredShortcuts = {};

  if (!profile || !profile.tiles) return;

  profile.tiles.forEach(tile => {
    if (tile.hotkey) {
      try {
        const ret = globalShortcut.register(tile.hotkey, () => {
          console.log(`Global hotkey triggered: ${tile.hotkey} -> ${tile.name}`);
          // Execute the action associated with this tile
          // We need a way to execute this tile's action. 
          // Re-using the logic from the renderer might be tricky if it lives in UI.
          // Ideally, we send an event to the renderer to "click" the tile
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('trigger-tile', tile.id);
          }
        });

        if (!ret) {
          console.warn(`Registration failed for hotkey: ${tile.hotkey}`);
        } else {
          registeredShortcuts[tile.hotkey] = tile.id;
        }
      } catch (err) {
        console.error(`Error registering hotkey ${tile.hotkey}:`, err);
      }
    }
  });
}

let mainWindow;
let miniWindow;

function createMiniWindow() {
  if (miniWindow) {
    miniWindow.show();
    return;
  }

  miniWindow = new BrowserWindow({
    width: 300,
    height: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    icon: path.join(__dirname, "../ui/public/icon.png")
  });

  miniWindow.loadURL("http://localhost:5173?mode=mini");

  miniWindow.on("closed", () => {
    miniWindow = null;
  });
}

// IPC Handlers
ipcMain.handle("get-profiles", () => {
  const files = fs.readdirSync(PROFILES_DIR);
  return files.filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
});

ipcMain.handle("load-profile", (event, name) => {
  const filePath = path.join(PROFILES_DIR, `${name}.json`);
  if (fs.existsSync(filePath)) {
    const profile = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // Register hotkeys for this profile
    registerGlobalShortcuts(profile);
    return profile;
  }
  return null;
});


ipcMain.handle("execute-action", (event, action) => {
  console.log("Executing action:", action);

  if (action.type === "url") {
    const { shell } = require("electron");
    let val = action.value;
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      val = 'https://' + val;
    }
    shell.openExternal(val);
  } else if (action.type === "app" || action.type === "shell") {
    let command = action.value;
    const isWin = process.platform === "win32";

    if (action.value === "chrome") command = isWin ? "start chrome" : "open -a 'Google Chrome'";
    else if (action.value === "terminal") command = isWin ? "start cmd" : "open -a Terminal";
    else if (action.value === "calc") command = isWin ? "start calc" : "open -a Calculator";
    else if (isWin && !command.startsWith('start ')) command = `start "" "${command}"`;

    exec(command, (err) => {
      if (err) console.error("Failed to execute action:", err);
    });
  } else if (action.type === "notification") {
    if (Notification.isSupported()) {
      new Notification({
        title: action.title || "VIP Stream Deck",
        body: action.body || action.value,
        icon: path.join(__dirname, "../ui/public/icon.png")
      }).show();
    }
  }

  return { success: true };
});

ipcMain.handle("get-system-stats", async () => {
  try {
    const [cpu, mem] = await Promise.all([
      si.currentLoad(),
      si.mem()
    ]);
    return {
      cpu: Math.round(cpu.currentLoad),
      mem: Math.round((mem.active / mem.total) * 100)
    };
  } catch (error) {
    console.error("Error getting system stats:", error);
    return { cpu: 0, mem: 0 };
  }
});

ipcMain.handle("snooze-alert", (event, alertData, minutes) => {
  console.log(`Snoozing alert for ${minutes} minutes:`, alertData);
  app.emit('reschedule-alert', alertData, minutes);
  return { success: true };
});

ipcMain.handle('save-profile', async (event, { name, data }) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const profilePath = path.join(__dirname, '..', 'profiles', `${name.toLowerCase()}.json`);
    fs.writeFileSync(profilePath, JSON.stringify(data, null, 4));
    return { success: true };
  } catch (err) {
    console.error("Failed to save profile:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle("open-mini-mode", () => {
  createMiniWindow();
  return { success: true };
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: true,
    frame: true,
    backgroundColor: '#030305',
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();

  // Load Vite dev server URL with retry mechanism
  const loadWithRetry = (url, retries = 10, interval = 2000) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    mainWindow.loadURL(url).catch(err => {
      if (retries > 0) {
        if (!mainWindow || mainWindow.isDestroyed()) return;
        console.log(`Failed to load URL, retries left: ${retries}. Retrying in ${interval}ms...`);

        // Show a "Waiting" page during retries
        const loadingHtml = `
          <html>
            <body style="background: #030305; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; overflow: hidden;">
              <div style="padding: 40px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; text-align: center; backdrop-filter: blur(20px);">
                <div style="width: 40px; height: 40px; border: 3px solid rgba(59, 130, 246, 0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <h1 style="font-size: 14px; text-transform: uppercase; tracking: 0.2em; margin: 0 0 10px; color: #3b82f6;">Connecting to System</h1>
                <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0;">Waking up the VIP Interface...</p>
                <div style="margin-top: 20px; font-size: 10px; color: rgba(255,255,255,0.2); font-family: monospace;">Retry attempt: ${11 - retries}/10</div>
              </div>
              <style>
                @keyframes spin { to { transform: rotate(360deg); } }
              </style>
            </body>
          </html>
        `;
        if (!mainWindow.isDestroyed()) {
          mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml)}`);
        }

        setTimeout(() => loadWithRetry(url, retries - 1, interval), interval);
      } else {
        if (!mainWindow || mainWindow.isDestroyed()) return;
        console.error("Failed to load URL after multiple retries:", err);
        const errorHtml = `
          <html>
            <body style="background: #030305; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, sans-serif; margin: 0;">
              <div style="padding: 40px; background: rgba(244, 63, 94, 0.05); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 24px; text-align: center;">
                <h1 style="font-size: 14px; text-transform: uppercase; margin: 0 0 10px; color: #f43f5e;">System Link Failed</h1>
                <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 0 0 20px;">The Dev Server (Vite) was not detected.</p>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; text-align: left; font-size: 11px; color: #fff; font-family: monospace;">
                   Step 1: Open Terminal<br>
                   Step 2: Run <b>npm run dev</b><br>
                   Step 3: Wait for "Vite ready" message<br>
                   Step 4: Restart this app
                </div>
              </div>
            </body>
          </html>
        `;
        if (!mainWindow.isDestroyed()) {
          mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
        }
      }
    });
  };

  loadWithRetry("http://localhost:5173");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });


  mainWindow.on("minimize", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  createTray(mainWindow);

  // Startup configuration
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath("exe"),
    });
  }
}


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") {
    // app.quit(); // Keep running in background
  }
});


app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

