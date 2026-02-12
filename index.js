const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { processEvents } = require("./events");
const { startServer } = require("./server"); // Import du serveur express

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

    // Lancement du serveur en lui passant l'instance du bot
    startServer(sock);

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        if (!m.messages[0].message || m.messages[0].key.fromMe) return;
        await processEvents(sock, m.messages[0], 'chat');
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) startDarkBot();
        } else if (connection === 'open') {
            console.log('✅ > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 : SYSTÈME PRÊT');
        }
    });
}

startDarkBot();
