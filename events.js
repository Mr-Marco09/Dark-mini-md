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
            try {
                const fPath = path.join(__dirname, 'fichiers', file);
                delete require.cache[require.resolve(fPath)];
                require(fPath)(sock, m, body);
            } catch (e) {
                console.error(`Erreur dans l'automatisme ${file}:`, e);
            }
        }

        // 2. Commandes (/plugins)
        if (isCmd) {
            const pluginFiles = fs.readdirSync('./plugins').filter(f => f.endsWith('.js'));
            for (const file of pluginFiles) {
                try {
                    const pPath = path.join(__dirname, 'plugins', file);
                    delete require.cache[require.resolve(pPath)];
                    const plugin = require(pPath);
                    if (plugin.name === command || (plugin.alias && plugin.alias.includes(command))) {
                        await plugin.execute(sock, m, body);
                    }
                } catch (e) {
                    console.error(`Erreur dans le plugin ${file}:`, e);
                }
            }
        }
    }

    if (type === 'group') {
        const welcomePath = path.join(__dirname, 'fichiers', 'group_welcome.js');
        if (fs.existsSync(welcomePath)) {
            try {
                delete require.cache[require.resolve(welcomePath)];
                require(welcomePath)(sock, m);
            } catch (e) {
                console.error(`Erreur dans group_welcome.js:`, e);
            }
        }
    }
}

module.exports = { processEvents };
