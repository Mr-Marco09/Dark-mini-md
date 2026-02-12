module.exports = async (sock, msg, body) => {
    const from = msg.key.remoteJid;
    
    // Si l'utilisateur tape juste "1" ou "2" sans préfixe
    if (body === "1") {
        // Logique pour envoyer l'AUDIO
        // Ici on ajoutera plus tard le lien vers le téléchargement
        await sock.sendMessage(from, { text: "⏳ *Préparation de votre audio...*" });
    } else if (body === "2") {
        // Logique pour envoyer la VIDÉO
        await sock.sendMessage(from, { text: "⏳ *Préparation de votre vidéo...*" });
    }
};
