#!/usr/bin/env node

"use strict";
const { program } = require("commander");
const fs = require("fs");
const path = require("path");
var sanitize = require("sanitize-filename");
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

const pkg = require("./package.json");
const { scrapPlaylist, scrapChannel } = require("./");

program
    .name(pkg.name)
    .version(pkg.version)
    .option("-p, --playlist", "the id do download a playlist into separate folder")
    .option("-c, --channel", "the id of the channel to download all playlists from")
    .option("-F, --ffmpeg [path]", "path to the ffmpeg if is not in PATH")
    .option("-O, --output [path]", "path to the output folder", process.cwd())
    .option(
        "-t, --concurrency [number]",
        "How many parallel downloads/encodes should be started",
        2
    )
    .arguments("<id>")
    .action(async function (id, cmdObj) {
        var YD = new YoutubeMp3Downloader({
            ffmpegPath: cmdObj.ffmpeg,
            outputPath: cmdObj.output,
            youtubeVideoQuality: "highest",
            queueParallelism: cmdObj.concurrency,
            progressTimeout: 2000,
        });

        if (!(cmdObj.playlist || cmdObj.channel)) {
            YD.download(id);
        }

        const downloadPlaylist = async (id, base) => {
            var l = await scrapPlaylist(id);
            const dir = sanitize(l.title || "");
            const p = path.join(base || "", dir);
            
            if (!fs.existsSync(p)) {
                fs.mkdirSync(p);
            }

            l.videos.forEach((t) => {
                const o = path.relative(cmdObj.output, p);
		//console.log(o, o.id);
		const fn = path.join(o, `${sanitize(t.title)}.mp3`);
		if (!fs.existsSync(fn)) {
                	YD.download(t.id, fn);
		}
            });
        };

        if (cmdObj.playlist) {
            await downloadPlaylist(id);
        }

        if (cmdObj.channel) {
            var ch = await scrapChannel(id);
            var dir = path.join(cmdObj.output, sanitize(ch.title));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            ch.playlists.forEach((t) => downloadPlaylist(t.id, dir));
        }

        YD.on("error", function (error) {
            console.log(error);
        });

        YD.on("progress", function (p) {
            console.log(`${p.videoId} => ${p.progress.percentage}%`);
        });

        return new Promise((a, r) => {
            YD.on("queueSize", function (size) {
                if (!size) {
                    a();
                }
            });

            YD.on("finished", (err, data) => {
                if (err) return;
                console.log(`finished: ${data.videoId}: ${data.title}`);
            });
        });
    })
    .parseAsync(process.argv);
