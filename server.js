const express = require("express");
const path = require("path");
const config = require("./config.json");

const app = express();
const PORT = process.env.PORT || 10000;

/**
 * Démarre le serveur web de contrôle pour le jumelage
 * @param {Object} marcoInstance - L'instance active de Baileys (sock)
 */
const startServer = (marcoInstance) => {
    
    // 1. Sert l'interface HTML (Design Glassmorphism)
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // 2. API de Jumelage (Synchronisée avec index.html)
    app.get('/pair', async (req, res) => {
        const num = req.query.number; 
        
        if (!num) return res.status(400).json({ error: "Numéro de téléphone requis" });
        if (!marcoInstance) return res.status(503).json({ error: "Le moteur du bot n'est pas encore prêt" });

        try {
            // Nettoyage du numéro (garde uniquement les chiffres)
            const cleanedNum = num.replace(/[^0-9]/g, '');
            
            // Demande du Pairing Code à Baileys
            const code = await marcoInstance.requestPairingCode(cleanedNum);
            
            // Retourne le code au format JSON
            res.status(200).json({ code: code }); 
        } catch (err) {
            console.error("Erreur Pairing:", err);
            res.status(500).json({ error: "Échec de la génération du code" });
        }
    });

    // 3. Démarrage du serveur avec sécurité pour Render
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌍 Serveur > ${config.botName} en ligne sur le port ${PORT}`);
    });

    // Gestion de l'erreur "EADDRINUSE" (Port occupé par une ancienne instance)
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`❌ Port ${PORT} occupé. Arrêt immédiat pour forcer Render à redémarrer proprement.`);
            process.exit(1); // Crucial pour libérer le port sur Render
        }
    });
};

module.exports = { startServer };
