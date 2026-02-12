const fs = require('fs');
const path = require('path');
const config = require('./config.json');

async function processEvents(sock, m, type) {
    if (type === 'chat') {
        const from = m.key.remoteJid;
        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || "";
        const isCmd = body.startsWith(config.prefix);
        const command = isCmd ? body.slice(config.prefix.length).trim().split(' ').shift().toLowerCase() : "";

        // 1. Automatismes (/fichiers)
        const autoFiles = fs.readdirSync('./fichiers').filter(f => f.endsWith('.js'));
        for (const file of autoFiles) {
            const fPath = path.join(__dirname, 'fichiers', file);
            delete require.cache[require.resolve(fPath)];
            require(fPath)(sock, m, body);
        }

        // 2. Commandes (/plugins)
        if (isCmd) {
            const pluginFiles = fs.readdirSync('./plugins').filter(f => f.endsWith('.js'));
            for (const file of pluginFiles) {
                const pPath = path.join(__dirname, 'plugins', file);
                delete require.cache[require.resolve(pPath)];
                const plugin = require(pPath);
                if (plugin.name === command || (plugin.alias && plugin.alias.includes(command))) {
                    await plugin.execute(sock, m, body);
                }
            }
        }
    }

    if (type === 'group') {
        const welcomePath = path.join(__dirname, 'fichiers', 'group_welcome.js');
        if (fs.existsSync(welcomePath)) {
            delete require.cache[require.resolve(welcomePath)];
            require(welcomePath)(sock, m);
        }
    }
}

module.exports = { processEvents };
