const config = require('../config.json');
module.exports = async (sock, msg, body) => {
    if (config.antilink && body.includes('://chat.whatsapp.com')) {
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { delete: msg.key });
        await sock.sendMessage(from, { text: "❌ *Lien interdit ici !*" });
    }
};
