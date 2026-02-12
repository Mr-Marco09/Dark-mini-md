const express = require("express");
const path = require("path");
const config = require("./config.json");

const app = express();
const PORT = process.env.PORT || 10000;

const startServer = (marcoInstance) => {
    // Route pour ton interface HTML
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // API de Pairing synchronisée avec ton bouton HTML
    app.get('/pair', async (req, res) => {
        const num = req.query.number;
        if (!num) return res.status(400).json({ error: "Numéro requis" });
        if (!marcoInstance) return res.status(503).json({ error: "Moteur non prêt" });

        try {
            const cleanedNum = num.replace(/[^0-9]/g, '');
            const code = await marcoInstance.requestPairingCode(cleanedNum);
            res.status(200).json({ code: code });
        } catch (err) {
            res.status(500).json({ error: "Erreur de génération" });
        }
    });

    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌍 Serveur ${config.botName} actif sur le port ${PORT}`);
    });

    // FIX CRITIQUE : Évite le bug "Port occupé" sur Render
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${PORT} occupé. Arrêt immédiat pour redémarrage propre.`);
            process.exit(1); 
        }
    });
};

module.exports = { startServer };
