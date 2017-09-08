# Podcast Uploader

A very basic video-to-MP3 converter and FTP podcast uploader written using Electron. I'm using it with [Podcast Generator](http://www.podcastgenerator.net/).

#### Requirement(s):

 * npm
 * ffmpeg needs to be in your path, or specify a path to it.  (See: [Setting binary paths manually](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg).)

#### How it works:

FFMPEG converts the selected file, renames it to "Title - Speaker - Day - Date.mp3", and uploads it to a FTP server.

#### Setting up.
* Rename 'ftpInfo.example.json' to 'ftpInfo.json' and enter your FTP server details.
* In `index.js`, you will probably need to change the directory that you are uploading to. For me, the directory is `./files/podcasts/`
	* ```  `c.put(fullPathAndFilenameToUpload, `./files/podcasts/${newFileName}`, ```

#### Using the program.

* Run ```npm start electron``` in the project dir.
* Pick a video file using the 'choose file' button.
* Input a title and speaker.
* Click 'convert and upload.
* After the upload is complete, you will need the URL to update your podcast. This is found under admin > Change Podcast Generator Configuration > Use cron to auto index episodes.
* Open the URL you found to add the newly uploaded file to your podcast.
