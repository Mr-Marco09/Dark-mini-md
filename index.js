const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { processEvents } = require("./events");

async function startDarkBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_dark');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        browser: ['> 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝', 'Safari', '3.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        await processEvents(sock, msg, 'chat');
    });

    sock.ev.on('group-participants.update', async (g) => {
        await processEvents(sock, g, 'group');
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) startDarkBot();
        } else if (connection === 'open') {
            console.log('✅ > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 : SYSTÈME OPÉRATIONNEL');
        }
    });
}

startDarkBot();
