const style = require('./style');
const config = require('../config.json');

module.exports = {
    // Exporte le style (boutons, cadres, etc.)
    ...style,
    
    // Exporte la config pour un accès rapide
    config,

    // Petite fonction utilitaire pour formater le temps (ex: pour le ping)
    runtime: (seconds) => {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        return `${d > 0 ? d + 'j ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
    }
};
