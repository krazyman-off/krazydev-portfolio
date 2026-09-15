# KM-Perms
- Name: KM-Perms
- Stable version: none
- Stable jar: none
- Dev version: 1.0.0-DEV
- Dev jar: KM-Perms-Velocity-1.0.0-DEV.jar, KM-Perms-Bukkit-1.0.0-DEV.jar

## Description

KM-Perms est le système de permissions réseau de KrazyMan_off, un fork du moteur LuckPerms 5.5.17 entièrement rebrandé sous la marque Krazy Studio.
Le plugin se déploie en deux artefacts complémentaires : un cœur proxy Velocity (pensé pour la version 26.2) qui pilote la logique globale, et un backend Bukkit/Paper (version 1.21.10) qui applique les permissions sur chaque serveur de jeu.
Dès la connexion, chaque joueur se voit calculer un jeu complet de permissions réseau, identique sur le proxy et sur l'ensemble des backends, sans configuration supplémentaire par machine.
La gestion repose sur un système de groupes avec héritage complet : un groupe peut hériter des permissions, des métadonnées et des parents d'autres groupes selon un algorithme de traversée configurable (depth-first ou breadth-first).
Des tracks organisent les groupes en hiérarchies promotionnelles, avec des commandes de promotion et de rétrogradation qui font progresser les joueurs le long du parcours défini.
Le groupe principal de chaque joueur est calculé automatiquement selon le poids relatif de ses groupes parents, ou lu depuis le profil stocké selon la méthode choisie.
Les permissions peuvent être temporaires, avec une politique de cumul configurable : accumulate pour additionner les durées, replace pour prolonger, ou deny pour refuser les doublons.
Le système de contextes rend les permissions dépendantes du serveur, du monde ou de toute autre donnée, avec des calculatrices de contexte activables et désactivables individuellement.
Sur le proxy, le nom du serveur est injecté dans le contexte de tous les joueurs, ce qui permet d'accorder des permissions propres à un serveur sans affecter les autres.
Les permissions globales, les permissions par serveur et les groupes globaux peuvent être activés ou désactivés indépendamment pour couvrir tous les schémas réseau.
Les wildcards, les permissions par expression régulière (préfixe r=) et les raccourcis de permissions sont détectés et résolus automatiquement pour simplifier l'écriture des rôles.
Les préfixes et suffixes sont entièrement configurables, avec un stacking qui permet d'afficher plusieurs éléments combinés et un formatage par poids pour chaque groupe.
Des métadonnées alimentent les placeholders visibles dans le chat et les informations des joueurs, avec un sélecteur de valeur configurable pour chaque clé.
La persistance repose sur un stockage flexible : H2 par défaut, mais aussi SQLite, MySQL, MariaDB, PostgreSQL, MongoDB, ou des fichiers plats lisibles YAML, JSON, HOCON et TOML.
Un stockage séparé peut être activé pour répartir utilisateurs, groupes, tracks, UUID et journaux sur des sources de données différentes.
La synchronisation réseau est assurée par un service de messagerie qui propage instantanément chaque modification à tous les serveurs connectés et au proxy.
La messagerie supporte plusieurs transports : plugin messaging, file d'attente SQL, Redis, RabbitMQ, NATS ou un service personnalisé fourni par l'API.
Les nouveautés sont poussées automatiquement après chaque commande de modification, et le journal des actions peut être transmis à l'ensemble du réseau.
La commande /kmpv networksync permet de forcer manuellement la synchronisation des données entre toutes les instances connectées.
Un cycle de synchronisation automatique reste disponible en l'absence de service de messagerie, avec un intervalle de rafraîchissement configurable en minutes.
Le journal des actions enregistre chaque opération de permissions avec sa source, et les notifications peuvent être envoyées aux joueurs autorisés, avec filtrage par expression régulière.
La commande /kmpv log notify permet à chaque joueur autorisé d'activer ou de désactiver ses notifications de modifications en temps réel.
Sur le proxy Velocity, une option permet d'annuler une connexion lorsque les données de permissions d'un joueur ne peuvent pas être chargées, garantissant l'intégrité des droits dès l'arrivée.
Le plugin force le chargement de Vault après lui (loadbefore), ce qui règle les problèmes des plugins qui ne capturent le service fournisseur qu'une seule fois au démarrage.
Les dépendances souples LilyPad-Connect et ViaVersion sont respectées pour la messagerie custom et la compatibilité des versions de protocole.
Le backend Bukkit est compatible avec Folia, déclare une version d'API 1.13 et se charge au démarrage du serveur (load: STARTUP).
Les commandes sont centralisées sous km-perms, avec les alias kmp, perm, perms, permission et permissions pour une prise en main rapide.
Sur le proxy, la commande /kmpv couvre la gestion complète : utilisateurs, groupes, tracks, contextes, journal et synchronisation réseau.
Les permissions par arguments permettent un contrôle très fin sur ce que chaque utilisateur peut faire avec chaque commande, y compris sur quels groupes il a le droit d'agir.
L'appartenance à un groupe peut être exigée avant toute modification de ses données, pour une délégation sécurisée de la gestion des rôles.
Un mode lecture seule empêche les commandes de modifier des données, et les commandes peuvent être totalement désactivées pour les joueurs ou pour la console.
L'opération de bulkupdate permet de modifier ou supprimer en masse les données de permissions, avec confirmation obligatoire pour éviter les erreurs irréversibles.
Les calculatrices de contexte par monde peuvent être réécrites via des alias, pour harmoniser des mondes comme world_nether et world_the_end avec le monde principal.
Les poids de groupes peuvent être définis globalement ou par serveur, influençant directement la priorité du groupe principal et le formatage des préfixes.
Une API publique complète permet à vos plugins maison d'interroger utilisateurs, groupes et permissions en toute confiance, sans passer par les commandes.
Un éditeur web intégré permet de modifier les permissions à distance via des sessions sécurisées, avec échanges par sockets et signatures de vérification.
La documentation wiki référencée sur krazystudio.fr accompagne l'administrateur sur la configuration des stockages, de la messagerie et des contextes.
La gestion des usernames invalides, le suivi des UUID et les journaux de connexion détaillés facilitent le diagnostic des problèmes de liaison de données.
L'ensemble est conçu pour un fonctionnement purement réseau : une seule source de vérité, et des droits cohérents sur le proxy comme sur tous les backends.
La philosophie du plugin est de remplacer plusieurs plugins de permissions disparates par un moteur unique, performant et centralisé au niveau du réseau.
Le jeu de commandes kmperms permet également d'administrer les permissions localement sur un serveur Bukkit sans proxy, grâce au module backend autonome.
KM-Perms est édité par KrazyMan_off et distribué par Krazy Studio, avec le site de référence https://krazystudio.fr pour la documentation et le support.
Le code repose sur la base LuckPerms placée sous licence MIT, dont les droits sont conservés par son auteur originel lucko et les contributeurs.