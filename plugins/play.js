const yts = require('yt-search');
const config = require('../config.json');
const style = require('../lib/style');

module.exports = {
    name: "play",
    alias: ["song", "musique", "chanson"],
    async execute(sock, msg, body) {
        const from = msg.key.remoteJid;
        const args = body.split(' ').slice(1).join(' ');

        if (!args) return sock.sendMessage(from, { text: `❌ Précisez le titre.\nEx: ${config.prefix}play Drake - God's Plan` });

        // Recherche sur YouTube
        const search = await yts(args);
        const video = search.videos[0];

        if (!video) return sock.sendMessage(from, { text: "❌ Aucune musique trouvée." });

        // Construction du texte avec les boutons simulés via ton style
        let playCaption = `*> 🎧 Dark-mini-PLAYER 🎧*\n\n` +
                          `*📌 Titre :* ${video.title}\n` +
                          `*⏱️ Durée :* ${video.timestamp}\n` +
                          `*👁️ Vues :* ${video.views}\n` +
                          `*📅 Publié :* ${video.ago}\n\n` +
                          `*CHOISISSEZ LE FORMAT :*`;

        const buttons = [
            { display: "1. AUDIO (MP3) 🎧" },
            { display: "2. DOCUMENT (FILE) 📄" },
            { display: "3. LYRICS (TEXTE) 📝" }
        ];

        let finalDescription = style.sendDarkButtons(playCaption, buttons);

        // Envoi avec la miniature de la vidéo
        await sock.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: finalDescription,
            contextInfo: {
                externalAdReply: {
                    title: video.title,
                    body: `Par : ${video.author.name}`,
                    sourceUrl: config.linkChanel,
                    mediaType: 1,
                    thumbnailUrl: video.thumbnail,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: msg });
    }
};
