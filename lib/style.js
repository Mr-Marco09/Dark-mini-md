const config = require('../config.json');

module.exports = {
    prepareDarkMessage: (text, thumb = null) => {
        return {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: config.botName,
                    body: config.fakestatus, // "whatsapp:©Mr Marco✅"
                    sourceUrl: config.linkChanel,
                    mediaType: 1,
                    thumbnailUrl: thumb || config.logo,
                    renderLargerThumbnail: false,
                    showAdAttribution: true
                },
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.channelJid,
                    newsletterName: config.fakestatus,
                    serverMessageId: 1
                }
            }
        };
    },
    sendDarkButtons: (text, buttons) => {
        let btnText = `${text}\n`;
        buttons.forEach(b => { btnText += `\n┏━━━━━━━━━━━━━━┓\n┃ ☛ ${b.display}\n┗━━━━━━━━━━━━━━┛\n`; });
        return btnText + `\n${config.footer}`;
    }
};
