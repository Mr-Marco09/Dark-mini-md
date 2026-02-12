const fs = require('fs');
const config = require('./config.json');

async function processEvents(sock, data, type) {
    // Gestion du CHAT
    if (type === 'chat') {
        const from = data.key.remoteJid;
        const body = data.message?.conversation || data.message?.extendedTextMessage?.text || "";
        const isCmd = body.startsWith(config.prefix);
        const command = isCmd ? body.slice(config.prefix.length).trim().split(' ').shift().toLowerCase() : "";

        // 1. Exécution des automatismes (Fichiers)
        const autoFiles = fs.readdirSync('./fichiers').filter(file => file.endsWith('.js'));
        for (const file of autoFiles) {
            require(`./fichiers/${file}`)(sock, data, body);
        }

        // 2. Exécution des commandes (Plugins)
        if (isCmd) {
            const pluginFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js'));
            for (const file of pluginFiles) {
                const plugin = require(`./plugins/${file}`);
                if (plugin.name === command || (plugin.alias && plugin.alias.includes(command))) {
                    await plugin.execute(sock, data, body);
                }
            }
        }
    }

    // Gestion du GROUPE (Welcome)
    if (type === 'group') {
        if (fs.existsSync('./fichiers/group_welcome.js')) {
            require('./fichiers/group_welcome.js')(sock, data);
        }
    }
}

module.exports = { processEvents };
