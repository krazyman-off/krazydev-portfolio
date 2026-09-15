# KM-MOTD
- Name: KM-MOTD
- Stable version: 2.0.0-STABLE
- Stable jar: KM-MOTD-Velocity-2.0.0-STABLE.jar, KM-MOTD-Bukkit-1.0.0-STABLE.jar
- Dev version: none
- Dev jar: none

## Description

KM-MOTD est le plugin de message d'accueil (MOTD) nouvelle génération de KrazyStudio, développé par krazyman_off pour les serveurs Minecraft modernes.
Il est conçu en Java 21 et pensé pour les environnements de proxy Velocity 3.3+, tout en étant décliné en variantes selon la plateforme de votre serveur.
Sa mission est simple : transformer un simple message d'accueil en une véritable vitrine animée, performante et entièrement personnalisable.
Le rendu graphique repose sur la norme MiniMessage d'Adventure, avec des dégradés de couleurs, du gras, des symboles et des polices spéciales partout.
Le moteur de la version 2.0.0 repose sur le système de frames, des écrans successifs que vous définissez librement dans la configuration.
Chaque frame dispose de ses propres lignes de texte, de son propre survol (hover), de sa propre favicon, de sa propre version affichée et de son propre compteur de joueurs.
L'animation est pilotée par un module dédié avec trois modes de diffusion : séquentiel, aléatoire et mélange (shuffle), avec un intervalle réglable en secondes.
Un planificateur interne gère la rotation des frames sans jamais bloquer le chemin de réponse du proxy.
Les placeholders ne sont plus figés au chargement : ils sont résolus en direct à chaque ping du serveur.
Le moteur de placeholders gère notamment {online}, {max}, {time}, {host}, {website}, {discord}, {real_online} et {server_name}.
Chaque ping déclenche une résolution fraîche, garantissant un compteur de joueurs et une heure toujours exacts.
Le gestionnaire de survol est configurable frame par frame, avec un fallback global lorsque un frame n'en définit pas.
Les lignes de survol supportent également les placeholders en direct, par exemple pour afficher le site, le Discord ou le nombre de joueurs réels.
Le nombre de joueurs affichés devient un véritable outil marketing grâce au module max_players.mode.
Quatre modes sont disponibles : real (valeurs réelles), fake_only (valeurs fictives uniquement), real_plus_fake (réels plus fictifs) et fixed (valeur fixe).
Le module fake_players permet d'ajouter des joueurs fictifs supplémentaires, additionnables ou non aux compteurs réels.
Chaque frame peut utiliser sa propre favicon : il suffit de déposer des images PNG 64x64 dans le dossier favicons du plugin.
Une favicon par défaut sert de secours globale, et un cache interne optimise leur chargement.
Le nom de version affiché est entièrement manipulable frame par frame, avec support complet du MiniMessage.
Le protocole annoncé est également configurable, ou laissé en automatique avec la valeur -1.
La maintenance est intégrée nativement avec un bloc dédié et des frames de maintenance spécifiques.
La commande /km-motd maintenance on/off permet de basculer les frames de maintenance en un instant, sans recharger le plugin.
Les messages de connexion et de déconnexion sont gérés avec un encodage UTF-8 propre et un rendu MiniMessage.
Le module de messages distingue le mode natif du mode personnalisé, en évitant tout affichage de caractères corrompus.
La commande principale /km-motd expose reload, info, preview, maintenance et version.
La complétion automatique, les clics et le survol dans le chat sont pleinement gérés.
La sous-commande preview permet d'apercevoir un frame précis sans attendre le prochain ping réel.
La migration depuis la version 1 est entièrement automatique : l'ancien format motds est converti vers des frames.
Les anciens caches (MotdCache, PingCache) sont remplacés par des gestionnaires modernes plus performants.
Le chemin critique de réponse du ping est optimisé pour zéro allocation non nécessaire.
Les caches par frame et l'architecture en priorité post-ordre permettent de servir des milliers de pings par seconde.
Le plugin est compatible avec Velocity 3.3+, avec l'API fournie en provided.
La configuration utilise SnakeYAML avec un constructeur sûr, pour une lecture sécurisée des fichiers YAML.
Le rendu MiniMessage passe par la librairie Adventure fournie par Velocity, sans dépendance lourde.
L'intégration avec la disparition (vanish) de KM-Moderations est assurée par des appels réflexifs parfaitement isolés.
KM-MOTD est disponible en deux familles de builds selon votre plateforme : une variante Velocity pour les proxies.
Une variante Bukkit est également fournie pour les serveurs backend de type Paper ou Spigot.
La version actuelle en diffusion stable est la 2.0.0-STABLE, disponible pour les deux plateformes.
La configuration livrée avec le plugin contient des exemples complets : frames multicolores, dégradés, hover riche.
Chaque bloc de configuration est documenté en français, accessible même aux administrateurs débutants.
Les symboles, polices spéciales et dégradés inclus dans l'exemple donnent immédiatement un rendu professionnel.
KM-MOTD s'intègre naturellement dans l'écosystème KrazyStudio, aux côtés de KM-Moderations et des autres composants.
En résumé, KM-MOTD transforme le message d'accueil de votre serveur en un atout visuel et marketing de premier plan.
La promesse de KrazyStudio : une installation rapide, une configuration agréable et un message d'accueil qui donne envie de rejoindre la partie.