const config = require('../config.json');
module.exports = async (sock, msg) => {
    if (config.autoReadStatus && msg.key.remoteJid === 'status@broadcast') {
        await sock.readMessages([msg.key]);
    }
};
