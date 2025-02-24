const {contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('app', {
    createRequestHandler: (array, start, goal) => {
        return ipcRenderer.invoke('run', array, start, goal)
    } 
})