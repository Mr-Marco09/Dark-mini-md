const express = require("express");
const path = require("path");
const config = require("./config.json");

const app = express();
const PORT = process.env.PORT || 10000;

const startServer = (marcoInstance) => {
    
    // Sert les fichiers statiques (images, css) si vous en avez
    app.use(express.static(path.join(__dirname, 'public')));

    // 1. Affiche votre fichier index.html
    app.get('/', (req, res) => {
        // Vérifie si index.html est à la racine ou dans /public
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // 2. Logique de Pairing
    app.get('/pair', async (req, res) => {
        const num = req.query.number; 
        
        if (!num) return res.status(400).json({ error: "Numéro requis" });
        if (!marcoInstance) return res.status(503).json({ error: "Le bot n'est pas encore initialisé" });

        try {
            // Nettoyage du numéro (enlève les espaces et +)
            const cleanedNum = num.replace(/[^0-9]/g, '');
            const code = await marcoInstance.requestPairingCode(cleanedNum);
            res.status(200).json({ code: code }); 
        } catch (err) {
            console.error("Erreur Pairing:", err);
            res.status(500).json({ error: "Échec de la génération du code" });
        }
    });

    // 3. Démarrage sécurisé (évite l'erreur EADDRINUSE)
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌍 Serveur ${config.botName} actif sur le port ${PORT}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Le port ${PORT} est occupé, nouvelle tentative...`);
            setTimeout(() => {
                server.close();
                server.listen(PORT);
            }, 2000);
        }
    });
};

module.exports = { startServer };
