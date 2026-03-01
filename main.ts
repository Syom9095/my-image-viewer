import { app, BrowserWindow, ipcMain, dialog } from 'electron'; // ipcMain, dialog を追加
import * as path from 'path';
import * as fs from 'fs'; // fs を追加


function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,     
            contextIsolation: false,   
            webSecurity: false,        
        }
    });
    win.loadFile('index.html');
}


ipcMain.handle('open-directory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory'] // フォルダ選択
    });
    if (canceled) return [];

    const folderPath = filePaths[0];
    const files = fs.readdirSync(folderPath);
    
    // 画像ファイルのフルパス一覧を作って返す
    return files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => path.join(folderPath, file));
});

app.whenReady().then(createWindow);