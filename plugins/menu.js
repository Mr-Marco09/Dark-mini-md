const config = require('../config.json');
const style = require('../lib/style');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "menu",
    alias: ["help", "aide", "h"],
    async execute(sock, msg, body) {
        const from = msg.key.remoteJid;
        
        // 1. Scanner dynamiquement le dossier plugins
        const pluginFolder = path.join(__dirname, '../plugins');
        const files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
        
        // 2. Construire la liste des commandes
        let listeCommandes = "";
        files.forEach(file => {
            const plugin = require(path.join(pluginFolder, file));
            if (plugin.name) {
                listeCommandes += `│ ☛ ${config.prefix}${plugin.name}\n`;
            }
        });

        // 3. Design du Menu
        let menuText = `╔════════════════╗\n` +
                       `║  *${config.botName}*  ║\n` +
                       `╚════════════════╝\n\n` +
                       `*👤 USER :* @${msg.key.remoteJid.split('@')[0]}\n` +
                       `*⚡ CMD TOTAL :* ${files.length}\n\n` +
                       `*SYSTÈME OPÉRATIONNEL :*\n` +
                       `╭───────────────\n` +
                       listeCommandes +
                       `╰───────────────\n\n` +
                       `*${config.footer}*`;

        const finalMsg = style.prepareDarkMessage(menuText);
        
        await sock.sendMessage(from, { 
            ...finalMsg, 
            mentions: [msg.key.remoteJid] 
        }, { quoted: msg });
    }
};
