# yt-scrapper 

[![Coverage Status](https://coveralls.io/repos/github/Eomm/youtube-download-playlist/badge.svg?branch=master)](https://coveralls.io/github/Eomm/youtube-download-playlist?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=yt-scrapper )](https://packagephobia.now.sh/result?p=yt-scrapper )

This module let you to download the audio files of a video playlist or all channel's playlists on YouTube in MP3 format.
It exposes API the **yts** command line command to download single or multiple audio.

⚠ You must use this module/cli respecting the [YouTube's Copyright Policies](https://www.youtube.com/intl/en/about/copyright/#support-and-troubleshooting).

## Install

### Requirements

- [Node.js](https://nodejs.org/it/download/) >= v10
- [`ffmpeg`](https://www.ffmpeg.org/download.html) installed in your system

## Usage

### CLI - Command Line Interface

```sh
# NPM Global
npm install yt-scrapper  -g
yts <video_id or playlist_id>
```

Run `yts --help` to see all the options!!

The cli is very simple and quick-and-dirty:

Examples:

```sh
# Download channel's playlists
yts PLAv2aQ9JgGbVcUtDpuiTB9WgaMljCUpa_ -p

# Download playlist
yts OLAK5uy_mJoXRJ0NQey9QqGgZ2Vw9pI657EvfkQmI -c

# Download audio
yts 2bexTB7xq_U
```


#### FFMPEG

This program needs [`ffmpeg`](https://www.ffmpeg.org/download.html).
It is a free program that elaborate video and audio stream.
It can be download also in the portable `.zip` without installation!

To config the `ffmpeg` path you can run the script in a `cmd` shell like this:

```sh
yts ZIyyj2FrVI0 -F /ffmpeg/bin
```

Or more simply run the `yd` command from the directory where ffmpeg is saved:

```sh
cd download/ffmpeg/bin
yts ZIyyj2FrVI0
```
## License

Copyright [MIT](./LICENSE).