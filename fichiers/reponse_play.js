const { config } = require('../lib');

module.exports = async (sock, msg, body) => {
    const from = msg.key.remoteJid;
    const text = body.trim();
    
    // Vérifie si on répond à un message du bot contenant le menu play
    const isReplyToPlay = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption?.includes("DARK-PLAY SYSTEM");

    if (isReplyToPlay) {
        if (text === "1") {
            await sock.sendMessage(from, { text: "📥 *TÉLÉCHARGEMENT DE L'AUDIO...*\n\n" + config.footer });
            // Logique de téléchargement ici
        } 
        else if (text === "2") {
            await sock.sendMessage(from, { text: "📂 *PRÉPARATION DU DOCUMENT...*\n\n" + config.footer });
        } 
        else if (text === "3") {
            await sock.sendMessage(from, { text: "📝 *RÉCUPÉRATION DES PAROLES...*\n\n" + config.footer });
        }
    }
};
