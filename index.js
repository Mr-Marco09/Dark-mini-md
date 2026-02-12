const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const { processEvents } = require("./events");

async function startDarkBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_dark');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        browser: ['Dark-Mini-MD', 'Safari', '3.0']
    });

    sock.ev.on('creds.update', saveCreds);

    // Écoute des messages (Chat)
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        await processEvents(sock, msg, 'chat');
    });

    // Écoute des mouvements de groupe (Welcome/Bye)
    sock.ev.on('group-participants.update', async (groupUpdate) => {
        await processEvents(sock, groupUpdate, 'group');
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = lastDisconnect.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startDarkBot();
        } else if (connection === 'open') {
            console.log('✅ > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 : SYSTÈME OPÉRATIONNEL');
        }
    });
}

startDarkBot();
