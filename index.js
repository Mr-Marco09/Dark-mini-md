const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require('readline');
const { processEvents } = require("./events");

// Configuration pour l'entrée du numéro de téléphone
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startDarkBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_dark');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Désactivé au profit du Pairing Code
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"], // Requis pour le pairing
        markOnlineOnConnect: true,
    });

    // --- LOGIQUE DE CONNEXION PAR CODE (PAIRING CODE) ---
    if (!sock.authState.creds.registered) {
        console.log("\n--- SYSTÈME D'APPAIRAGE > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 ---");
        const phoneNumber = await question("Veuillez entrer votre numéro WhatsApp (ex: 50941131299) :\n> ");
        const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
        console.log(`\n✅ VOTRE CODE DE JUMELAGE : ${code.match(/.{1,4}/g).join('-')}\n`);
        console.log("Ouvrez WhatsApp > Appareils connectés > Lier un appareil > Lier avec le numéro de téléphone.");
    }

    sock.ev.on('creds.update', saveCreds);

    // --- GESTION DES ÉVÉNEMENTS ---
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        await processEvents(sock, msg, 'chat');
    });

    sock.ev.on('group-participants.update', async (groupUpdate) => {
        await processEvents(sock, groupUpdate, 'group');
    });

    // --- GESTION DE LA CONNEXION ---
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            let reason = lastDisconnect.error?.output?.statusCode;
            console.log(`Connexion fermée. Raison : ${reason}`);
            
            if (reason !== DisconnectReason.loggedOut) {
                console.log("Tentative de reconnexion...");
                startDarkBot();
            } else {
                console.log("Session déconnectée. Veuillez supprimer le dossier session_dark et recommencer.");
            }
        } else if (connection === 'open') {
            console.log('\n╔════════════════════════════════════════╗');
            console.log('║  ✅ > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 CONNECTÉ AVEC SUCCÈS ║');
            console.log('╚════════════════════════════════════════╝\n');
        }
    });
}

startDarkBot();
