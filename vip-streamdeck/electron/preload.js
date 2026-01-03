const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getProfiles: () => ipcRenderer.invoke('get-profiles'),
    loadProfile: (name) => ipcRenderer.invoke('load-profile', name),
    executeAction: (action) => ipcRenderer.invoke('execute-action', action),
    showNotification: (payload) => ipcRenderer.invoke('execute-action', { type: 'notification', ...payload }),
    snoozeAlert: (alertData, minutes) => ipcRenderer.invoke('snooze-alert', alertData, minutes),
    onTriggerTile: (callback) => ipcRenderer.on('trigger-tile', (event, tileId) => callback(tileId)),
    onContextChanged: (callback) => ipcRenderer.on('context-changed', (event, appName) => callback(appName)),
    getSystemStats: () => ipcRenderer.invoke('get-system-stats'),
    saveProfile: (params) => ipcRenderer.invoke('save-profile', params),
    openMiniMode: () => ipcRenderer.send('open-mini-mode'),
});





window.addEventListener('DOMContentLoaded', () => {

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron', 'v8']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
