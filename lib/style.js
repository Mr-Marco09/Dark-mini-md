const config = require('../config.json');

module.exports = {
    prepareDarkMessage: (text) => {
        return {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: config.botName,
                    body: "Sʏsᴛᴇ̀ᴍᴇ Oᴘᴇ́ʀᴀᴛɪᴏɴɴᴇʟ",
                    sourceUrl: config.linkChanel,
                    thumbnailUrl: config.logo,
                    mediaType: 1,
                    renderLargerThumbnail: false
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.channelJid,
                    newsletterName: "REJOINDRE LE CANAL"
                }
            }
        };
    }
};
