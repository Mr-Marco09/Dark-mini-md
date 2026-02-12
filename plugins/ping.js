const { prepareDarkMessage, runtime, config } = require('../lib');

module.exports = {
    name: "ping",
    alias: ["speed"],
    async execute(sock, msg, body) {
        const start = Date.now();
        const from = msg.key.remoteJid;
        
        // On calcule la vitesse
        const latence = Date.now() - start;
        
        const pingText = `*🚀 SPEED TEST*\n\n` +
                         `*Vitesse :* ${latence} ms\n` +
                         `*Uptime :* ${runtime(process.uptime())}\n\n` +
                         `*${config.footer}*`;

        const finalMsg = prepareDarkMessage(pingText);
        await sock.sendMessage(from, finalMsg, { quoted: msg });
    }
};
