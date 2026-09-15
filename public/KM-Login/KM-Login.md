# KM-Login
- Name: KM-Login
- Stable version: 2.0.17
- Stable jar: KM-Login-2.0.17.jar
- Dev version: 1.0.0-DEV
- Dev jar: KM-Login-1.0.0-DEV.jar

## Description

KM-Login est un système d'authentification ultra-léger pour serveurs Minecraft, conçu pour sécuriser l'accès à votre serveur en quelques secondes.
Il est développé par krazyman_off et reprend l'architecture éprouvée d'un authentifieur moderne pour offrir une protection complète du premier log au quotidien.
Sa philosophie "ultra-lightweight" garantit un impact minimal sur les performances, même sur les proxies ou serveurs à forte charge.
Le plugin s'installe nativement sur les trois plateformes majeures : Bukkit/Spigot/Paper (avec support Folia), BungeeCord et Velocity.
Cette multi-plateforme permet de couvrir aussi bien un petit serveur standalone qu'un réseau professionnel fonctionnant derrière un proxy.
La version Velocity se décline même en édition standalone autonome, sans dépendance externe, pensée pour les configurations proxies modernes.
KM-Login gère le cycle complet des comptes : enregistrement, connexion, changement de mot de passe, vérification et suppression.
Le plugin différencie les comptes crackés et premium : les joueurs premium peuvent être connectés automatiquement via la session Mojang.
La fonctionnalité "auto-login premium" évite toute saisie pour les propriétaires légitimes d'un compte Premium.
Les protections "block-cracked-premium-names" empêchent un joueur cracké d'usurper l'identité d'un pseudo premium.
Le support Bedrock (Geyser) intègre un auto-login dédié pour fluidifier l'expérience des joueurs de la plateforme.
Côté stockage, KM-Login repose sur une base de données SQLite locale (fichier accounts.db) prête à l'emploi, sans configuration.
Pour les réseaux à grande échelle, une base MySQL complète est disponible : hôte, port, base, utilisateur et mot de passe.
La synchronisation Redis est également prévue, idéale pour propager les sessions et les comptes entre plusieurs serveurs du réseau.
Un moteur de sessions permet de prolonger l'authentification pendant une durée paramétrable, avec liaison optionnelle à l'adresse IP.
Le système anti-bruteforce introduit un délai croissant entre chaque mot de passe erroné, ralentissant radicalement les attaques par force brute.
La sécurité du compte est renforcée par une authentification à deux facteurs (2FA) à code à 6 chiffres, expirable en 300 secondes.
Le 2FA peut être forcé lors d'un changement d'adresse IP, pour bloquer le vol de session.
Un authentifieur par email peut envoyer le code via un serveur SMTP configurable (login, mot de passe, TLS et expéditeur personnalisés).
L'authentification par Discord est aussi supportée, avec possibilité d'exiger une vérification Discord à chaque connexion.
Le plugin impose un mot de passe minimum (5 caractères par défaut) et limite le nombre de comptes par IP à 3.
Les serveurs d'authentification dédiés sont gérés : un serveur "lobby-1" peut être forcé avant login, puis un serveur post-authentification pris en charge.
En attendant la connexion, le joueur est placé dans un mode "limbo" : effet d'aveuglement, joueurs cachés dans la tablist et dans le monde.
Le blocage de paquets empêche tout mouvement et toute interaction tant que le joueur n'est pas authentifié.
Le chat et les commandes sont bloqués par défaut, seuls les commandes autorisées (login, register, changepass, verify, etc.) restent accessibles.
Un délai d'authentification maximal (90 secondes par défaut) déconnecte les joueurs inactifs qui n'auraient pas fini leur login.
La vérification par email peut être exigée à chaque connexion pour les réseaux les plus sensibles, avec contournement réservé aux opérateurs.
Les commandes d'administration, dûment protégées par permissions, couvrent la gestion complète : register, unregister, changepass, changeuuid et delete.
Des permissions de force et de bypass (Discord, email) offrent un contrôle fin : exiger la vérification ou en exempter certains joueurs.
Le plugin inclut des convertisseurs depuis AuthMe, en SQLite comme en MySQL, pour migrer une base existante sans douleur.
L'interface utilisateur soigne l'expérience : titre d'écran à l'arrivée et rappel en actionbar toutes les 8 secondes pour guider le joueur non connecté.
Les messages sont entièrement personnalisables via un fichier messages.yml, pratique pour la traduction ou la thématique serveur.
La configuration centralisée (config.yml) regroupe base de données, Redis, sessions, premium, bedrock, limbo, anti-bruteforce et 2FA.
Le délai anti-bruteforce est paramétrable avec des bornes minimum et maximum (par défaut entre 1 et 3,5 secondes par tentative erronée).
La liaison des sessions par adresse IP (bind-ip) empêche la reprise d'une session authentifiée depuis une autre connexion.
Les comptes crackés peuvent être soumis à un mot de passe même en cas de nom premium (cracked-premium-require-password), selon votre politique.
Le plugin se charge au démarrage du serveur (load STARTUP), ce qui le rend disponible avant la plupart des autres systèmes et couvre les phases critiques.
Il est compatible avec l'API 1.13 et plus, ainsi qu'avec Folia (folia-supported), pour les serveurs modernes comme les installations à threads régionaux.
La permission administrative kmlogin.admin est attribuée par défaut aux opérateurs et donne accès à l'ensemble des ressources de gestion du plugin.
Les commandes de vérification (verify, email, discord) sont, elles aussi, réservées aux opérateurs pour sécuriser les opérations sensibles.
Les commandes register, unregister, changepass et changeuuid sont protégées par des permissions dédiées, accordées au cas par cas.
Sur proxy, une commande /kmlogin centralise la gestion du système pour les administrateurs du réseau.
L'édition Standalone (KM-Login-Standalone) embarque tout le nécessaire dans un seul jar, sans dépendance de plugin tierce ni d'outil externe.
La version Velocity 1.0.0-DEV constitue une réécriture dédiée pour proxies Velocity, avec son propre loader maison (fr.krazystudio.kmlogin.KMLogin).
Les réglages de jeu bloquent le chat et les commandes des joueurs non authentifiés (block-chat, block-commands), réduisant le spam et les abus.
Une liste blanche de commandes autorisées avant login est configurable, pour laisser passer uniquement login, register et leurs alias usuels.
L'import depuis AuthMe couvre à la fois les fichiers SQLite (authme.db) et les tables MySQL (authme), pour une migration complète et rapide.
Le code 2FA dispose d'une durée de validité paramétrable (300 secondes par défaut) et sa longueur (6 chiffres par défaut) est réglable dans la configuration.
KM-Login est donc une solution d'authentification complète, à la fois légère, sécurisée et compatible avec les architectures modernes les plus exigeantes.