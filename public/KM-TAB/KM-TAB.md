# KM-TAB
- Name: KM-TAB
- Stable version: none
- Stable jar: none
- Dev version: 1.0.0-DEV
- Dev jar: km-tab-1.0.0-DEV.jar

## Description

KM-TAB est la suite d'affichage réseau de KrazyStudio, pensée proxy-first pour redessiner la tablist et les messages de vos serveurs Minecraft derrière un proxy Velocity 3.x.
Le plugin s'articule autour de trois livrables complémentaires : un cœur Velocity qui pilote l'affichage au niveau du réseau, un backend Spigot/Paper/Pufferfish pour le mode autonome, et un companion Bukkit pour les serveurs backend.
Le cœur proxy gère la tablist de tous les joueurs connectés, quel que soit le serveur backend auquel ils sont rattachés, depuis un point de contrôle unique.
Chaque joueur voit son nom affiché avec le préfixe et le suffixe de son grade, un séparateur configurable, et éventuellement le poids (weight) de son rang pour hiérarchiser l'affichage.
L'ensemble des formats est entièrement personnalisable via des templates MiniMessage supportant les placeholders {grade_prefix}, {username}, {grade_suffix} et {weight}.
Les couleurs et la charte graphique du serveur sont respectées grâce au support des codes legacy (& et §) et des couleurs hexadécimales, en complément de MiniMessage.
Un header et un footer par joueur sont appliqués à la tablist, avec les placeholders {online_count}, {max_players}, {server}, {ping} et {tps}.
Le rafraîchissement s'exécute en tâche de fond à l'intervalle configuré (update_interval, 20 ticks par défaut, minimum 5) pour un affichage constamment à jour.
À la connexion d'un joueur, ses données de permissions sont chargées avant la construction de sa ligne de tablist, garantissant l'affichage immédiat du bon grade.
L'affichage des grades et du poids de rang s'active indépendamment via les options show_grade et show_rank_weight.
Les préfixes, suffixes et poids de rang sont lus depuis KM-Perms, basé sur LuckPerms, avec détection au démarrage et nouvelle tentative quelques secondes plus tard si nécessaire.
Dès qu'un grade évolue (recalcul des données utilisateur), la tablist et le header/footer sont actualisés automatiquement pour les joueurs concernés.
En l'absence de KM-Perms, le plugin continue de fonctionner sans préfixes ni suffixes, sans bloquer l'affichage réseau.
Le chat global réseau est intégré : chaque message est intercepté au niveau du proxy puis diffusé sur l'ensemble des serveurs connectés.
Le format du chat est configurable avec préfixe de grade : {grade_prefix} | {username} ➔ {message}.
Les messages de connexion et de déconnexion sont gérés au niveau du proxy, avec un comptage précis des joueurs en ligne sur chaque serveur.
Les messages custom de join/quit combinent grade, nom du joueur, nom du serveur et nombre de joueurs connectés sur ce serveur.
Les messages vanilla de connexion (joined/left the game) sont silencés côté proxy grâce à une interception de paquets dédiée via PacketEvents.
Le filtrage couvre les paquets SYSTEM_CHAT_MESSAGE et DISGUISED_CHAT, reconnaissant les formulations anglaises et françaises de connexion et déconnexion.
Une liste personnalisable de fragments texte permet d'étendre le filtrage à d'autres formulations utilisées par d'autres plugins.
Les joueurs en vanish via KM-Mod disparaissent de la tablist des joueurs qui ne peuvent pas les voir et ne sont plus comptés dans les effectifs en ligne.
Un modérateur disposant de la permission km-mod.vanish.bypass continue de voir les joueurs masqués, comme les compteurs en ligne qui intègrent leur présence.
La permission d'administration km-tab.admin couvre l'ensemble des commandes de gestion du plugin et est accordée par défaut aux opérateurs.
La configuration se fait via config.yml, généré automatiquement avec des valeurs d'exemple dès le premier lancement du plugin.
Les installations existantes reposant sur display.yml sont automatiquement détectées et relues, facilitant la migration des réseaux déjà équipés.
Le backend Spigot propose un mode autonome complet pour les serveurs sans proxy, reprenant la même logique de tablist, de header/footer et de chat.
En mode autonome, le nom des joueurs dans la tablist porte leur grade et le tri utilise des équipes scoreboard (KM_TAB_###) fondées sur le poids du rang.
La visibilité des nametags est pilotée par ces équipes, garantissant un affichage cohérent du titre et du grade de chaque joueur.
Le header et le footer autonomes profitent de placeholders enrichis : {player_name}, {server_name}, {server_motd} et un TPS réellement mesuré.
Le chat autonome réécrit chaque message avec le préfixe de grade en s'appuyant sur l'API AsyncChatEvent de Paper, moderne et portable.
Les messages de connexion et de déconnexion natifs peuvent être silencés puis remplacés par les messages personnalisés, au choix de l'administrateur.
Le mode autonome n'est pas destiné à cohabiter avec le plugin Velocity : il s'adresse aux serveurs fonctionnant sans proxy.
Le companion Bukkit complète le cœur Velocity en silençant les messages vanilla de connexion et de déconnexion directement sur les backends.
Le companion est requis lorsque le plugin KM-TAB Velocity est utilisé, afin d'éviter l'apparition des messages natifs en double sur le réseau.
Le companion est compatible Folia (folia-supported, api-version 1.21) et se déploie sur chaque serveur backend du réseau.
La communication entre le companion et le proxy transite par le canal de plugin messaging km-tab:main, sans plugin tiers de messagerie.
Les artefacts embarquent leurs dépendances (MiniMessage, SnakeYAML, PacketEvents...) via le shading Maven, relocalisées sous fr.krazystudio.kmtab.libs.
Les livrables sont compilés pour Java 21 et visent les serveurs de jeu Minecraft 1.21 et supérieurs.
Côté proxy, le placeholder de TPS est prévu pour une intégration future et résolu à une valeur fixe ; c'est la version autonome qui expose la valeur réellement mesurée.
La suite unifie l'affichage réseau dans une interface cohérente, réduisant le nombre de plugins de tablist et de chat à maintenir sur le réseau.
Malgré son statut de développement, la version 1.0.0-DEV expose déjà l'ensemble des fonctionnalités clés de la tablist réseau de KrazyStudio.
KM-TAB s'intègre naturellement à l'écosystème KM-* (KM-Perms pour les grades, KM-Mod pour le vanish, KM-Moderations pour la modération) et s'installe en quelques minutes.