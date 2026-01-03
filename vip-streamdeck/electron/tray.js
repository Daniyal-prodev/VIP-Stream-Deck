const { Tray, Menu, app } = require("electron");
const path = require("path");
const fs = require("fs");


let tray = null;

function createTray(mainWindow) {
    const iconPath = path.join(__dirname, "../ui/public/icon.png");

    try {
        if (!fs.existsSync(iconPath)) {
            console.warn("Tray icon missing, using fallback (no icon)");
            // On some platforms, Tray needs a valid icon. 
            // We can return early or use a native icon if available.
        }

        tray = new Tray(iconPath);
    } catch (err) {
        console.error("Failed to create tray:", err);
        return null;
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open VIP Stream Deck",
            click: () => {
                mainWindow.show();
            },
        },
        { type: "separator" },
        {
            label: "Exit",
            click: () => {
                app.isQuitting = true;
                app.quit();
            },
        },
    ]);

    tray.setToolTip("VIP Stream Deck");
    if (tray) tray.setContextMenu(contextMenu);


    tray.on("double-click", () => {
        mainWindow.show();
    });

    return tray;
}

module.exports = { createTray };
