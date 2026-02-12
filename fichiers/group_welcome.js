const config = require('../config.json');

module.exports = async (sock, update) => {
    const { id, participants, action } = update;
    const metadata = await sock.groupMetadata(id);

    for (let user of participants) {
        let text = "";
        if (action === 'add') {
            text = `*BIENVENUE DANS LE SYSTÈME*\n\n` +
                   `Bienvenue @${user.split('@')[0]} sur *${metadata.subject}*\n\n` +
                   `┏━━━━━━━━━━━━━━┓\n` +
                   `┃ ☛ LIRE LES RÈGLES\n` +
                   `┗━━━━━━━━━━━━━━┛\n` +
                   `┏━━━━━━━━━━━━━━┓\n` +
                   `┃ ☛ REJOINDRE CANAL\n` +
                   `┗━━━━━━━━━━━━━━┛`;
        } else if (action === 'remove') {
            text = `*ADIEU AU SYSTÈME*\n\n` +
                   `@${user.split('@')[0]} a quitté le réseau... ⚡`;
        }

        if (text) {
            await sock.sendMessage(id, { 
                text: text, 
                mentions: [user],
                contextInfo: {
                    externalAdReply: {
                        title: config.botName,
                        body: "Notification de Groupe",
                        sourceUrl: config.linkChanel,
                        thumbnailUrl: config.logo,
                        mediaType: 1
                    }
                }
            });
        }
    }
};
