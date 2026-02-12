const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const express = require('express');
const pino = require("pino");
const { processEvents } = require("./events");

const app = express();
const port = process.env.PORT || 3000;
let sock;

app.use(express.static('public'));

// Route pour générer le code
app.get('/get-pairing', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.json({ error: "No phone" });

    try {
        if (!sock.authState.creds.registered) {
            let code = await sock.requestPairingCode(phone.replace(/[^0-9]/g, ''));
            res.json({ code: code.match(/.{1,4}/g).join('-') });
        } else {
            res.json({ code: "DÉJÀ CONNECTÉ" });
        }
    } catch (e) {
        res.json({ error: "Erreur serveur" });
    }
});

async function startDarkBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_dark');
    
    sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async (m) => {
        if (!m.messages[0].message || m.messages[0].key.fromMe) return;
        await processEvents(sock, m.messages[0], 'chat');
    });

    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'close') startDarkBot();
        if (connection === 'open') console.log("✅ BOT CONNECTÉ !");
    });
}

app.listen(port, () => {
    console.log(`🌐 Interface disponible sur le port ${port}`);
    startDarkBot();
});
