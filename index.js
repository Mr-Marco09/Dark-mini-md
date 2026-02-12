const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    makeCacheableSignalKeyStore 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const readline = require('readline');
const { processEvents } = require("./events");

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

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
        console.log("\n--- SYSTÈME D'APPAIRAGE > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 ---");
        const phoneNumber = await question("Entrez votre numéro WhatsApp (ex: 50941131299) :\n> ");
        const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
        console.log(`\n✅ VOTRE CODE : ${code.match(/.{1,4}/g).join('-')}\n`);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]; 
        if (!msg || !msg.message || msg.key.fromMe) return;
        await processEvents(sock, msg, 'chat');
    });

    sock.ev.on('group-participants.update', async (g) => {
        await processEvents(sock, g, 'group');
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = lastDisconnect.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log("Connexion perdue, reconnexion...");
                startDarkBot();
            }
        } else if (connection === 'open') {
            console.log('\n✅ > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 : CONNECTÉ ET OPÉRATIONNEL !');
        }
    });
}

startDarkBot();
