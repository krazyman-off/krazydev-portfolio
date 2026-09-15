# KM-AC
- Name: KM-AC
- Stable version: none
- Stable jar: none
- Dev version: 1.0.0-DEV
- Dev jar: KMACV-1.0.0-DEV.jar (proxy), KMAC-Bukkit-1.0.0-DEV.jar (backend)

## Description

KM-AC est un système anti-triche complet pour serveurs Minecraft développé par KrazyStudio (auteur : krazyman_off), pensé pour les serveurs en version 26.2 et compatible avec des clients allant de la 1.8 à la 26.2.
Le plugin s'appuie sur PacketEvents 2.0 pour l'analyse des paquets réseau et fonctionne sur Paper comme sur Folia, s'adaptant ainsi aux architectures modernes des serveurs.
KM-AC se déploie en deux composants complémentaires : un module proxy pour Velocity nommé KMACV et un module backend Bukkit/Paper/Folia nommé KM-AC Bukkit.
Le coeur anti-triche du backend est un fork de GrimAC réunissant environ 138 vérifications et un moteur de prédiction avancé qui simule le mouvement légitime avant de le comparer aux paquets reçus.
Le moteur hybride KM-AC V3 combine la précision Spartan et la compensation Grim pour une détection efficace avec un minimum de faux positifs, même en cas de lag serveur ou réseau.
Les contrôles de mouvement détectent le vol (vol non autorisé), les chutes simulées, les no-slow abusifs et la traversée des blocs via le contrôle Phase.
Les contrôles de knockback vérifient que la vélocité d'un joueur correspond réellement aux déplacements attendus après un impact.
Une famille de contrôles Elytra surveille les manipulations illégitimes de la propulsion elytra, y compris les abus de feu d'artifice.
Les contrôles de combat incluent la portée d'attaque (Reach), le KillAura, l'autoclicker, les coups critiques truqués et la vérification des hitboxes.
Les contrôles de paquets (BadPackets) et d'ordre de paquets (PacketOrder) repèrent les tricheurs qui envoient des paquets anormaux, désordonnés ou dupliqués.
Les checks Crash protègent les serveurs contre les tentatives de crash de clients via des paquets malveillants ou surdimensionnés.
Les contrôles de temps (Timer, NegativeTimer, TickTimer) détectent les joueurs qui accélèrent le flux de paquets pour obtenir un avantage de vitesse.
Les contrôles de placement et de cassage (Place/Break) détectent les placements impossibles, les interactions à distance et les accélérations de minage illégitimes.
La gestion des ghostblocks resynchronise les joueurs qui construisent sur des blocs fantômes afin d'éliminer l'avantage obtenu.
Les vérifications de véhicules surveillent les déplacements montés (chevaux, bateaux, véhicules) et la consommation de carburant suspecte.
Les contrôles d'inventaire repèrent les manipulations d'items pendant le déplacement ou les actions simultanées impossibles.
Un détecteur Baritone identifie les joueurs utilisant une client d'automatisation pour miner ou se déplacer sans intervention humaine.
KM-AC maintient l'état de chaque joueur de façon persistante, avec des setbacks progressifs et une décroissance naturelle des violations dans le temps.
Les joueurs légitimes peuvent accumuler un léger avantage puis le perdre grâce aux mécanismes de decay et de plafond d'avantage entièrement configurables.
Le système de punitions transfère kicks, bans et tempbans vers le module proxy KMACV sur Velocity, garantissant des sanctions cohérentes sur l'ensemble du réseau.
Le module proxy sert de relais aux punitions et peut partager les alertes entre les serveurs connectés au proxy, donnant une vue d'ensemble sur le réseau.
Les alertes peuvent être affichées en console et partagées entre serveurs via le canal de messages Bungee/Velocity si celui-ci est activé.
La détection de marque de client (client brand) identifie le client utilisé par chaque joueur et alerte les opérateurs à la connexion.
KM-AC bloque par défaut certaines versions Forge connues pour embarquer des hacks de portée intégrés (1.18.2 à 1.19.3), avec possibilité de les réautoriser.
Un mode spectateur permet de masquer les spectateurs sur demande, avec des mondes autorisés personnalisables.
La resynchronisation des blocs corrige les désynchronisations entre le client et le serveur, afin d'éviter les abus liés aux blocs fantômes.
Des protections réseau expulsent automatiquement les joueurs qui dépassent un seuil de paquets annulés par seconde, parant aux limiteurs de paquets défaillants.
Le plugin gère les limites de ping pour le vol, les boosts de fuseées elytra et les abus de timer afin d'éviter les contournements fondés sur la latence.
KM-AC prend en charge MongoDB, MySQL, PostgreSQL, Redis et SQLite pour stocker alertes, sanctions et données des joueurs.
Des messages Discord peuvent être émis pour relayer les événements importants de l'anti-triche vers vos canaux de modération.
La configuration est traduite dans de nombreuses langues, dont le français, l'anglais, l'allemand, l'espagnol, l'italien, le japonais, le russe et le chinois.
Le gestionnaire de permissions se branche sur LuckPerms et actualise les permissions en cache à la connexion et au rechargement du plugin.
De nombreuses intégrations sont prises en charge en dépendances souples : ProtocolLib, ViaVersion, ViaBackwards, Geyser, floodgate, FastLogin, PlaceholderAPI et bien d'autres.
KM-AC expose une large palette de permissions, parmi lesquelles alertes, verbose, rechargement, profil joueur, performance, exemption et désactivation des contrôles.
Des vérifications expérimentales, le traçage du pipeline Netty et le débogage en vol permettent aux administrateurs d'ajuster finement la détection.
Le plugin migre automatiquement la configuration vers les nouveaux formats et refuse de charger une configuration dont le format ne correspond pas au build installé.
Les contrôles de combat peuvent supprimer les hits impossibles avant qu'ils ne touchent la cible, réduisant l'impact des tricheurs en PvP.
KM-AC est pensé comme une solution professionnelle pour les réseaux de serveurs souhaitant une protection anti-triche centralisée et performante.
La synergie entre le backend, qui analyse le gameplay en profondeur, et le proxy, qui centralise les sanctions, en fait un outil de modération robuste à grande échelle.
Le tout reste hautement configurable : seuils de détection, niveaux de setback, décroissance des violations et plafonds d'avantage peuvent être réglés par contrôle.
KM-AC s'adresse aussi bien aux petits serveurs autonomes qu'aux réseaux multi-serveurs reliés par un proxy Velocity.