# KM-Maintenance
- Name: KM-Maintenance
- Stable version: 1.0.0-STABLE
- Stable jar: KM-Maintenance-1.0.0-STABLE.jar
- Dev version: 1.0.0-SNAPSHOT
- Dev jar: krazymaintenance-1.0.0-SNAPSHOT.jar

## Description

KM-Maintenance est la solution de maintenance tout-en-un pour les réseaux Minecraft, développée par KrazyMan_off pour sécuriser tes serveurs pendant les opérations techniques.
Il agit sur deux niveaux complémentaires : un mode maintenance au niveau du proxy Velocity, et un pont backend Bukkit pour les serveurs qui évoluent sans proxy.
L'édition Velocity 26.2 gère tout le réseau depuis un seul endroit : /maintenance on suffit à verrouiller l'accès à l'ensemble du réseau en une seconde.
Les connexions sont filtrées dès l'événement PreLogin, avant même le premier échange de données du joueur avec le proxy.
Un second filet de sécurité est tendu via l'événement Login, pour doubler la protection au moment de la connexion réelle.
Le tout repose sur des caches haute performance : whitelist en HashSet (recherche O(1)) et messages MiniMessage pré-compilés en mémoire.
Les joueurs non autorisés reçoivent un message d'exclusion pré-encodé, cohérent et instantané, sans ralentir le traitement des autres requêtes.
La whitelist de maintenance se compose de pseudos de joueurs que tu administres en direct depuis la console.
/maintenance add <joueur> accorde l'accès, /maintenance remove <joueur> le révoque, et /maintenance list affiche la liste actuelle.
Tes administrateurs et ton équipe technique restent donc connectés pendant que le reste du réseau est coupé du public.
Les commandes du proxy sont protégées par la permission krazymaintenance.use, attribuée par défaut aux opérateurs.
En mode maintenance, le MOTD de la liste des serveurs est remplacé par une annonce personnalisée au format MiniMessage.
Dégradés de couleurs, gras et styles avancés sont supportés pour rendre l'annonce vraiment visible et professionnelle.
Des placeholders dynamiques enrichissent chaque texte : {server_name}, {website}, {discord}, {eta} et {reason}.
Ces variables se règlent une seule fois dans la configuration et se répercutent partout dans les messages et le MOTD.
Le module de joueurs échantillon affiche l'état de la maintenance directement dans la liste serveur, sans qu'aucun joueur ne se connecte.
Statut, raison, ETA, contact et version sont autant d'informations facilement visibles au survol du serveur.
Pendant la maintenance, les compteurs de la liste sont remis à zéro (0 en ligne / 0 maximum) pour une image propre.
Au maximum 5 joueurs échantillon sont montrés au survol afin d'éviter le message « and X more » quelque peu repoussant.
Le cache de ping réutilise des UUID statiques au lieu d'en générer de nouveaux à chaque ping, une optimisation précieuse sous forte affluence.
Les composants MiniMessage sont pré-calculés une fois pour toutes : aucun parsing coûteux lors des requêtes de ping.
Même la maintenabilité est pensée : les toggles motd.enabled et sample_players.enabled permettent de désactiver indépendamment chaque module d'affichage.
La commande /maintenance status affiche en temps réel l'état du mode maintenance et de la whitelist depuis la console.
/maintenance reload recharge la configuration et l'ensemble des caches à chaud, sans redémarrer le proxy.
Le config.yml du proxy est généré automatiquement au premier lancement, commenté et structuré pour guider chaque réglage.
L'option compatibility.force_override permet à KM-Maintenance d'imposer son MOTD et d'écraser celui des autres plugins.
La whitelist peut être complètement désactivée via whitelist.enabled si tu souhaites bloquer absolument tout le monde pendant l'opération.
Côté pont backend, l'édition Bukkit apporte la maintenance aux serveurs de jeu qui fonctionnent sans proxy.
Son descriptif officiel le résume : « Maintenance serveur autonome (sans proxy) », une défense au plus près du serveur.
Il suffit de déposer KM-Maintenance-Bukkit-1.0.0-DEV.jar dans le dossier plugins d'un serveur compatible API 1.21.
La maintenance se bascule à chaud avec /kmmaintenance true ou /kmmaintenance false, et se recharge avec /kmmaintenance reload.
Chaque changement est sauvegardé immédiatement dans le config.yml, sans retouche manuelle obligatoire.
Les commandes Bukkit sont réservées à la permission kmmaintenance.admin, donnée par défaut aux opérateurs du serveur.
L'interception passe par AsyncPlayerPreLoginEvent en priorité HIGHEST, soit avant l'apparition du joueur dans le monde.
La whitelist Bukkit est insensible à la casse, un confort réel pour éviter les erreurs de pseudo.
Le message d'exclusion est configurable en MiniMessage via maintenance.kick-message, avec un texte français prêt à l'emploi.
Les deux éditions partagent la même philosophie : réactivité maximale, configuration simple et traitement optimisé des connexions massives.
Que tu pilotes un réseau Velocity multi-serveurs ou un serveur Bukkit isolé, KM-Maintenance épouse ton architecture.
Le pont Bukkit et le module proxy sont conçus pour monter en charge sans se marcher dessus, chacun dans son domaine.
L'édition stable 1.0.0-STABLE est destinée à la production : le mode maintenance proxy complet, éprouvé et prêt à servir.
L'édition développeur 1.0.0-SNAPSHOT (krazymaintenance-1.0.0-SNAPSHOT.jar) permet de tester les évolutions avant leur passage en stable.
La version Bukkit 1.0.0-DEV constitue le pont backend expérimental pour les serveurs autonomes exigeant le même niveau de protection.
L'ensemble du projet est publié par KrazyMan_off, dans la continuité de la suite « KM » orientée gestion réseau et serveur.
KM-Maintenance, c'est une mise en maintenance fiable, rapide et élégante, que tu opères en quelques commandes depuis ton proxy ou tes serveurs.
Pour activer : /maintenance on sur le proxy ; pour désactiver : /maintenance off, et laisse l'équipe technique travailler l'esprit tranquille.