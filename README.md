# > 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝 🤖⚡

<p align="center">
  <img src="https://i.postimg.cc/qqsXnp8w/L-homme-au-regard-bleu-lumineux.png" width="200" height="200" alt="Dark-Mini-MD">
</p>
<a align="false">
  <a href="#"><img src="https://img.shields.io" width="200 alt="Version"></a>
  <a href="#"><img src="https://img.shields.io" width="200 alt="Maintenance"></a>
  <a href="https://whatsapp.com/channel/0029VbASWFzHFxP6cbTkkz08"><img src="https://i.postimg.cc/v8fKxjGG/IMG-20260201-WA0107.jpg" width="200 alt="Canal"></a>
</p>

---
div class="container">
        <img src="https://i.postimg.cc/qqsXnp8w/L-homme-au-regard-bleu-lumineux.png" class="bot-logo" alt="Logo">
        
        <h1>> 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝</h1>
        <p class="desc">Bot WhatsApp par ©Mr Marco.</p>

        <div id="setup-area" class="setup-area">
            <input type="text" id="phone" placeholder="Numéro (ex: 509...)">
            <button onclick="getPairing()" id="mainBtn" class="btn-gen">GÉNÉRER LE CODE <i class="fas fa-bolt"></i></button>
        </div>

        <div id="code-area" class="code-area">
            <div class="code-box" id="displayCode">---- ----</div>
            <button onclick="copyIt()" class="btn-copy"><i class="fas fa-copy"></i> COPIER</button>
        </div>

        <div class="social-links">
            <a href="https://wa.me/50941131299" target="_blank" class="social-btn btn-wa">
                <i class="fab fa-whatsapp"></i> SUPPORT
            </a>
            <a href="https://whatsapp.com/channel/0029VbASWFzHFxP6cbTkkz08" target="_blank" class="social-btn btn-channel">
                <i class="fas fa-bullhorn"></i> CHAÎNE
            </a>
        </div>
        <p id="info" style="font-size: 0.7em; margin-top: 20px; color: #555;">© 2026 DARK-MODS-CORP | MR MARCO</p>
    </div>

____

## 🌟 DESCRIPTION
**> 𝐃𝐚𝐫𝐤-𝐦𝐢𝐧𝐢-𝐦𝐝** est un bot WhatsApp ultra-rapide, modulaire et élégant. Conçu avec une interface système unique ("Fake Status") et des boutons simulés pour une expérience utilisateur haut de gamme.

## 🚀 FONCTIONNALITÉS
- 🎵 **Multimédia :** Recherche et téléchargement YouTube (Audio/Vidéo).
- 🛡️ **Protection :** Système Antilink intégré pour les groupes.
- 🎭 **Identité :** Fake Status personnalisé avec badge vérifié "©Mr Marco ✅".
- ⚡ **Performance :** Optimisé pour **Render**, **Railway** et **Termux**.
- 🛠️ **Modulaire :** Ajoutez vos propres plugins facilement dans `/plugins`.

---

## 🛠️ INSTALLATION (TERMUX)

```bash
pkg update && pkg upgrade
pkg install nodejs git -y
git clone https://github.com
cd dark-mini-md
npm install
npm start
