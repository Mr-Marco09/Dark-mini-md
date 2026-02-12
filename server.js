const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// On crée un objet partagé pour stocker le code
let sharedData = { pairingCode: null, sock: null };

app.use(express.static(path.join(__dirname, 'public')));

app.get('/get-pairing', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.status(400).json({ error: "Numéro requis" });

    if (sharedData.sock && !sharedData.sock.authState.creds.registered) {
        try {
            const code = await sharedData.sock.requestPairingCode(phone.replace(/[^0-9]/g, ''));
            res.json({ code: code.match(/.{1,4}/g).join('-') });
        } catch (e) {
            res.status(500).json({ error: "Erreur technique" });
        }
    } else {
        res.json({ code: "DÉJÀ CONNECTÉ" });
    }
});

function startServer(sockInstance) {
    sharedData.sock = sockInstance;
    app.listen(port, () => {
        console.log(`🌐 Interface Web active sur le port ${port}`);
    });
}

module.exports = { startServer };
