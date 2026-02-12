const express = require("express");
const path = require("path");
const config = require("./config.json");

const app = express();

// CRITIQUE : Laisser Render choisir le port (10000 par défaut)
// Ne JAMAIS forcer 10000 en dur ici pour éviter les conflits
const PORT = process.env.PORT || 3000; 

const startServer = (marcoInstance) => {
    
    // Sert l'interface de jumelage
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // API de Pairing
    app.get('/pair', async (req, res) => {
        const num = req.query.number; 
        if (!num) return res.status(400).json({ error: "Numéro requis" });
        if (!marcoInstance) return res.status(503).json({ error: "Bot non prêt" });

        try {
            const cleanedNum = num.replace(/[^0-9]/g, '');
            const code = await marcoInstance.requestPairingCode(cleanedNum);
            res.status(200).json({ code: code }); 
        } catch (err) {
            res.status(500).json({ error: "Erreur de génération" });
        }
    });

    // Démarrage sur l'hôte 0.0.0.0 (Obligatoire sur Render)
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌍 Serveur > ${config.botName} en ligne sur le port ${PORT}`);
    });

    // Gestion propre du crash de port
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${PORT} occupé. Arrêt immédiat pour laisser Render redémarrer.`);
            process.exit(1); // Force Render à libérer le port proprement
        }
    });
};

module.exports = { startServer };
