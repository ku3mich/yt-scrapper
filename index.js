const fetch = require("node-fetch");
const cherio = require("cheerio");
const queryString = require("query-string");
const url = require("url");

const channelUrl = (id) => `https://www.youtube.com/channel/${id}`;
const playlistUrl = (id) => `https://www.youtube.com/playlist?list=${id}`;

const browse = async (u) =>
    (await fetch(u, { headers: { "Accept-Language": "en" } })).text();

const extract = (u, w) => queryString.parse(url.parse(u).query)[w];

const parseChannelHtml = (html, id) => {
    const $ = cherio.load(html);
    const q = $(".yt-lockup-meta a")
        .filter((i, t) => $(t).prop("href").startsWith("/playlist"))
        .map((i, t) => {
            const a = $(t);
            return {
                id: extract(a.prop("href"), "list"),
                title: $("h3 a", a.parent().parent()).text().trim(),
            };
        })
        .get();

    return {
        id,
        title: $("meta[name=title]").prop("content"),
        playlists: q,
    };
};

const parsePlaylistHtml = (html, id) => {
    const $ = cherio.load(html);
    const q = $("a.pl-video-title-link")
        .map((i, t) => {
            const a = $(t);
//		console.log(a.prop("href"), extract(a.prop("href"), "v"));
            return {
                id: extract(a.prop("href"), "v"),
                title: a.text().trim(),
            };
        })
        .get()
	.filter(s=>s.id && s.title)

//                        console.log(q);
    return {
        id,
        title: $('meta[itemprop="name"]').prop("content"),
        videos: q,
    };
};

const scrapChannel = async (id) => {
    const html = await browse(channelUrl(id));
    return parseChannelHtml(html, id);
};

const scrapPlaylist = async (id) => {
    const html = await browse(playlistUrl(id));
    return parsePlaylistHtml(html, id);
};

module.exports = {
    scrapPlaylist,
    scrapChannel,
};
