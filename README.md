# TikTTS
A Simple discord bot using `tiktok-tts` that allows you to use TikTok's TTS voices.

## SETUP:
1. Clone the repository, and run `npm i` inside the folder
2. Fill out the information in .env
3. Run `npm start`

### To get your TikTok Session ID:
1. Install the [Cookie Editor](https://cookie-editor.com/) extension
2. Log into TikTok
3. Copy the `sessionid` value from cookie editor

### Known Issues:
- Each instance only has one player. Because of this, if the bot is being used in two or more servers at once, all audio will be played for both servers.