// Common JS import format
const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('video:submit', (event, path, rename) => {

    ffmpeg()
    // File handling.
    .input(path)
    .noVideo()
    .audioCodec('libmp3lame')
    .audioBitrate('96')
    .save('ffmpeg-output/' + rename)

    // Event handling.
    .on('start', (commandline) => {
        mainWindow.webContents.send('ffmpeg:status', 'File Converstion Started');
    })
    .on('error', function(err, stdout, stderr) {
        mainWindow.webContents.send('ffmpeg:status', 'Error: ' + err.message);
    })
    .on('end', () => {
        mainWindow.webContents.send('ffmpeg:status', 'File Converted Successfully');
    });
})
