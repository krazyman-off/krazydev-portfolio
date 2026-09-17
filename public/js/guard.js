// KrazyDev — guard.js : protection non destructive.
// - Anti-clickjacking : refuse l'affichage dans une iframe (le serveur envoie
//   déjà X-Frame-Options: DENY + frame-ancestors 'none').
// - Rien d'autre : pas de blocage copier/coller (accessibilité, gestionnaires
//   de mots de passe), pas de wipe du DOM (perte de données, faux sentiment
//   de sécurité — DevTools ne se bloque pas côté client de toute façon).
(function () {
    'use strict';
    try {
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
    } catch (e) {
        // Accès cross-origin refusé : on est dans une iframe tierce → on sort.
        try { document.documentElement.style.display = 'none'; } catch (_) {}
    }
})();
