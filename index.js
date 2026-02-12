const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const express = require('express');
const path = require('path');
const pino = require("pino");
const { processEvents } = require("./events");

const app = express();
const port = process.env.PORT || 3000;
let currentPairingCode = "PAS DE CODE";

// Sert les fichiers statiques du dossier "public"
app.use(express.static('public'));

// API pour que le HTML récupère le code
app.get('/get-code', (req, res) => {
    res.json({ code: currentPairingCode });
});

async function startDarkBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_dark');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    if (!sock.authState.creds.registered) {
        // Remplace par ton numéro ou utilise une variable d'env
        const phoneNumber = "50941131299"; 
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber);
            currentPairingCode = code.match(/.{1,4}/g).join('-');
            console.log(`🔑 CODE GÉNÉRÉ : ${currentPairingCode}`);
        }, 5000);
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async (m) => {
        if (!m.messages[0].message || m.messages[0].key.fromMe) return;
        await processEvents(sock, m.messages[0], 'chat');
    });

    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') {
            currentPairingCode = "CONNECTÉ ✅";
            console.log("✅ BOT CONNECTÉ !");
        }
        if (connection === 'close') startDarkBot();
    });
}

app.listen(port, () => {
    console.log(`🌐 Serveur Web : http://localhost:${port}`);
    startDarkBot();
});
