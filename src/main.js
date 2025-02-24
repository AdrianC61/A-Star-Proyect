const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');  
const { aStar } = require('./lib/aStar');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        minWidth: 800,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });
    win.loadFile(path.join(__dirname, '../build', 'index.html'));
    //win.loadURL('http://localhost:3000');

    return win;
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('run', async (event, array, start, goal) => {
        try {
            const result = aStar(array, start, goal);
            return result;
        } catch (err) {
            console.error('Error running A*:', err);
            return null;
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});