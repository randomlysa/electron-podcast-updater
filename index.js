// Common JS import format
const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

// Convert video file to MP3.
ipcMain.on('video:submit', (event, object) => {
    const { fullPathWithFilename, newFileName, pathOnly } = object;

    ffmpeg()
    // File handling.
    .input(fullPathWithFilename)
    .noVideo()
    .audioCodec('libmp3lame')
    .audioBitrate('96')
    .save('ffmpeg-output/' + newFileName)

    // Event handling.
    .on('start', (commandline) => {
        mainWindow.webContents.send('ffmpeg:status', 'File Converstion Started');
    })
    .on('error', function(err, stdout, stderr) {
        mainWindow.webContents.send('ffmpeg:status', 'Error: ' + err.message);
    })
    .on('end', () => {
        mainWindow.webContents.send(
            'ffmpeg:status', 'File Converted Successfully',
            newFileName, pathOnly
        );
    });
})

// Upload MP3 file to server.
ipcMain.on('audio:readyToUpload', (event, newFileName, pathOnly) => {

    mainWindow.webContents.send('upload:status', 'File upload initiated.');

});
