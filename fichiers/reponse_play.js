module.exports = async (sock, msg, body) => {
    const from = msg.key.remoteJid;
    const text = body.trim();
    
    // On vérifie si on répond à un message qui contient le titre du plugin
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const isDarkPlay = quotedMsg?.imageMessage?.caption?.includes("DARK-SYSTEM PLAY");

    if (isDarkPlay) {
        if (text === "1") {
            await sock.sendMessage(from, { text: "⚡ *CHARGEMENT DE L'AUDIO (MP3)...* ⏳" });
            // Ici tu appelleras ta fonction de téléchargement ytdl
        } 
        else if (text === "2") {
            await sock.sendMessage(from, { text: "⚡ *CONVERSION EN DOCUMENT...* 📄" });
        } 
        else if (text === "3") {
            await sock.sendMessage(from, { text: "📝 *RÉCUPÉRATION DES PAROLES...*" });
        }
    }
};
