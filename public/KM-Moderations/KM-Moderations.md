# KM-Moderations
- Name: KM-Moderations
- Stable version: none
- Stable jar: none
- Dev version: 1.0.0-DEV
- Dev jar: KM-Moderations-1.0.0-DEV.jar

## Description

KM-Moderations est une suite de modération réseau pensée proxy-first pour les serveurs Velocity équipés de serveurs backend Bukkit/Paper 1.21 et plus.
Le plugin se décompose en deux artefacts livrés ensemble : un cœur proxy (Velocity) qui pilote toute la modération au niveau du réseau, et un bridge Bukkit qui assure la relève locale.
Le cœur proxy enregistre des commandes de modération qui écrasent les commandes natives du réseau (ban, tempban, unban, ipban, unipban, kick, mute, tempmute, unmute).
Chaque sanction exige un scope explicite server ou proxy, ce qui permet de choisir si la punition s'applique à un seul serveur de jeu ou à tout le réseau, avec des permissions dédiées par portée.
Les bannissements nominatifs, les bannissements d'IP et les mutes sont persistés sur disque dans le dossier de données du proxy, avec expiration gérée automatiquement pour les sanctions temporaires.
Un système de banhammer permet à un modérateur de bannir un joueur en un clic ciblé, avec détection automatique de la présence du bridge backend.
Le mute est traité directement au niveau du proxy : le chat et les messages privés (msg) sont bloqués avant même d'atteindre les serveurs backend.
Le plugin dispose d'un BanMOTD personnalisé qui modifie le message de la liste des serveurs pour les joueurs dont l'IP est bannie.
Le système de staff intégré centralise les outils d'équipe : staff chat (/staffchat et /sc), espionnage des conversations staff (gspy) et gestion des avertissements à la connexion.
Un service de vanish permet aux modérateurs de se rendre invisible aux yeux des joueurs et de la liste réseaux, avec un état fugitif propagé aux backends.
La commande /glist affiche la liste des joueurs connectés en tenant compte du vanish, tandis que /find localise un joueur sur le réseau et /send le déplace vers un serveur.
Des commandes ciblées /fly et /freeze sont relayées aux backends via un canal de messagerie plugin, permettant de gérer les joueurs à distance depuis le proxy.
Un mode gnick génère un pseudonyme premium aléatoire à partir des profils Mojang, pour protéger l'identité des joueurs et du staff.
Les messages du réseau sont émis via un broadcaster central qui peut composer les préfixes de permissions d'éventuels plugins externes pour rester cohérent avec votre setup existant.
Le côté backend révèle son vrai visage de bridge : il détecte automatiquement la présence de Velocity ou BungeeCord et se désactive s'il est inutile.
En présence d'un proxy, le bridge Bukkit applique les sanctions entrantes, relaie les avertissements proxy, gère l'application du skin /gnick et écoute les évènements du banhammer.
Le bridge embarque aussi un scope serveur : les sanctions visant un seul serveur y sont stockées et appliquées localement quand le serveur est atteint.
Sans proxy, le bridge bascule en mode autonome et fournit une modération locale complète : ban, tempban, unban, ipban, unipban, kick, mute et tempmute.
En mode autonome, chaque commande écrase la commande native du serveur Bukkit et affiche un écran de ban formaté (raison, modérateur, durée).
Les mutes autonomes sont persistés dans le fichier de configuration du plugin et expirent automatiquement après la durée définie.
Les durées acceptent des formats humains comme 30m, 1h, 7d ou 30d, avec suggestions interactives dans les commandes proxy.
Le plugin est compatible avec Folia côté backend (folia-supported) et suit la version d'API Bukkit 1.21.
La configuration et les messages sont chargés depuis le dossier de données, avec rechargement à chaud via la commande /kmmod reload.
Le plugin fournit des commandes de départ /kmmod, /km-mod et /moderations pour accéder à l'aide et au menu principal.
Les permissions sont groupées sous kmmod.* avec des permissions fines comme kmmod.ban, kmmod.ipban, kmmod.mute, kmmod.gnick, kmmod.banhammer, kmmod.admin et kmmod.help.
Les notifications de staff, les formats de messages et les styles de retour console sont centralisés et configurables.
Les joueurs reçoivent instantanément une confirmation de leur sanction, que celle-ci soit locale ou réseau, grâce au retour unifié du service de modération.
Les profils des joueurs sont suivis via un service de tracking, alimentant le store de profils et les informations de la commande /info.
Cette architecture réduit le nombre de plugins à maintenir : une seule suite couvre ban, tempban, IP ban, mute, vanish, staff chat, gspy, banhammer, gnick et broadcast réseau.
Malgré son statut de développement, la version 1.0.0-DEV expose déjà l'ensemble des outils de modération complets du réseau en un seul endroit.
Chaque sanction est tracée par modérateur (nom et UUID) et par serveur d'origine, ce qui facilite l'audit des actions de l'équipe.
La configuration du proxy repose sur deux fichiers YAML : config.yml pour les réglages généraux et messages.yml pour tous les textes affichés aux joueurs et au staff.
Un mécanisme de complétion de configuration crée et renseigne automatiquement ces fichiers au premier lancement du plugin.
Les bannissements natifs, les bannissements d'IP, les mutes et les profils joueurs sont relus depuis le disque à chaque démarrage du proxy.
Cette persistance garantit que les données de sanction restent cohérentes à travers les redémarrages du proxy et des serveurs backend.
Les permissions legacy des anciennes commandes globales (kmmod.gban, kmmod.gmute, kmmod.gunban...) restent prises en compte en complément des permissions modernes.
Le scope proxy est la pierre angulaire du réseau : une seule commande peut toucher l'ensemble des serveurs connectés derrière Velocity.
À la connexion, le bridge envoie un avertissement aux administrateurs lorsque Velocity ou BungeeCord est détecté, pour leur rappeler de retirer le plugin des backends.
Cet avertissement précise notamment que le mute, les bans et les annonces réseau sont gérés côté proxy, et invite à installer KM-Moderations uniquement sur le proxy Velocity.
Le chargeur de commandes utilise Brigadier pour une complétion riche au niveau du proxy, avec suggestions de joueurs, de durées et de scope.
Le plugin s'intègre par plugin messaging au bridge backend, sans nécessiter de plugin tiers pour la communication cross-server.
KM-Moderations est édité par krazyman_off et centralise toute la modération du réseau autour d'une seule suite et d'une seule interface.