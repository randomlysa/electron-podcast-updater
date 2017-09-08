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

    const fullPathAndFilenameToUpload = `./ffmpeg-output/${newFileName}`;

    const Client = require('ftp');
    const fs = require('fs');

    const c = new Client();
    c.on('ready', function() {
      mainWindow.webContents.send('upload:status', 'Ready to upload.');
        c.put(fullPathAndFilenameToUpload, `./files/${newFileName}`,
            function(err) {
                if (err) {
                    // Error uploading.
                    throw err;
                    mainWindow.webContents.send(
                        'upload:status', 'File upload failed.'
                    );
                    c.end();
                } else {
                    mainWindow.webContents.send(
                        'upload:status', 'File upload succeeded.'
                    );
                    c.end();
                }
        }); // end put
    }); // end on ready

    // Error connecting.
    c.on('error', function(e) {
        mainWindow.webContents.send(
            'upload:status', 'Error connecting to the server.'
        );
    })

    // Get connection info from file and connect.
    const connectionInfo = require ('./ftpInfo.json');
    c.connect(connectionInfo);

});
