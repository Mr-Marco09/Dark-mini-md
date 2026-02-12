const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Chemin vers ta base de données sécurisée
const FILE = path.join(__dirname, '../database/dark_data.enc');
const SECRET = process.env.OWNER_KEY || 'Dark-Mini-Md-Marco';

const ALGO = 'aes-256-cbc';

function getKey() {
  return crypto.createHash('sha256').update(SECRET).digest();
}

/**
 * Crypte et sauvegarde les données sensibles (ex: liste des admins)
 */
async function encryptData(dataArray) {
  try {
    const dir = path.dirname(FILE);
    if (!require('fs').existsSync(dir)) require('fs').mkdirSync(dir, { recursive: true });

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGO, getKey(), iv);

    let encrypted = cipher.update(JSON.stringify(dataArray), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const payload = iv.toString('hex') + ':' + encrypted;
    await fs.writeFile(FILE, payload);
    return true;
  } catch (e) {
    console.error("Erreur encryption:", e);
    return false;
  }
}

/**
 * Décrypte et lit les données
 */
async function decryptData() {
  try {
    const data = await fs.readFile(FILE, 'utf8');
    const [ivHex, encrypted] = data.split(':');

    const decipher = crypto.createDecipheriv(
      ALGO,
      getKey(),
      Buffer.from(ivHex, 'hex')
    );

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch {
    return []; // Retourne une liste vide si le fichier n'existe pas
  }
}

module.exports = { encryptData, decryptData };
