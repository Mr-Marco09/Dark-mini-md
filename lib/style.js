const config = require('../config.json');

/**
 * Bibliothèque de Style pour > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝
 * Gère l'identité visuelle, le Fake Status et les boutons simulés.
 */

const style = {
    /**
     * Prépare un message avec l'effet "Fake Status" et badge vérifié.
     * @param {string} text - Le contenu du message.
     * @param {string} [customThumb] - URL d'image optionnelle (ex: miniature YouTube).
     */
    prepareDarkMessage: (text, customThumb = null) => {
        return {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: config.botName,
                    body: config.fakestatus, // "©Mr Marco ✅"
                    sourceUrl: config.linkChanel,
                    mediaType: 1, // Nécessaire pour l'affichage du cadre
                    thumbnailUrl: customThumb || config.logo,
                    renderLargerThumbnail: false, // Crée l'effet "petit rond" style statut
                    showAdAttribution: true // Ajoute le badge officiel
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

    /**
     * Génère le texte des boutons simulés style système.
     * @param {string} caption - Le texte principal.
     * @param {Array} buttons - Tableau d'objets [{display: "Texte"}]
     */
    sendDarkButtons: (caption, buttons) => {
        let btnText = `${caption}\n`;
        buttons.forEach(btn => {
            btnText += `\n┏━━━━━━━━━━━━━━┓\n┃ ☛ ${btn.display}\n┗━━━━━━━━━━━━━━┛\n`;
        });
        return btnText + `\n${config.footer}`;
    },

    /**
     * Fonction utilitaire pour le temps d'activité (Uptime)
     */
    runtime: (seconds) => {
        seconds = Number(seconds);
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);
        const dDisplay = d > 0 ? d + (d == 1 ? " jour, " : " jours, ") : "";
        const hDisplay = h > 0 ? h + (h == 1 ? " heure, " : " heures, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        const sDisplay = s > 0 ? s + (s == 1 ? " seconde" : " secondes") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }
};

module.exports = style;
