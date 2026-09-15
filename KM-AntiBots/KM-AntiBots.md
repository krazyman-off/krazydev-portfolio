# KM-AntiBots
- Name: KM-AntiBots
- Stable version: none
- Stable jar: none
- Dev version: 1.0.0-DEV
- Dev jar: KM-AntiBots-1.0.0-DEV.jar, KM-AntiBots-Bridge-1.0.0-DEV.jar, KM-AntiBots-Bukkit-1.0.0-DEV.jar

## Description

KM-AntiBots est une protection anti-bot et anti-DDoS pensée pour les serveurs Minecraft protégés directement sur IP brute, sans nom de domaine.
Il remplace exactement Cloudflare pour le trafic Minecraft et va même plus loin, car il analyse le protocole natif du jeu alors que Cloudflare ne le voit pas.
L'architecture est proxy-first : un plugin Velocity bloque les attaquants AVANT qu'ils n'atteignent le serveur backend Bukkit.
Cette stratégie protège le serveur de jeu du trafic malveillant tout en absorbant les vagues de connexions artificielles à l'edge.
Trois livrables sont fournis : le plugin proxy Velocity, le bridge Bukkit qui relaie les commandes admin vers le proxy, et un plugin Bukkit autonome.
Le proxy centralise la protection : ping, handshake, joins, ratio par IP, blacklists, mode attaque et firewall y sont évalués en temps réel.
Le bridge permet de piloter la protection directement depuis la console ou les commandes du serveur de jeu Bukkit.
La version Bukkit autonome offre une protection anti-bot sans proxy pour ceux qui préfèrent garder une infrastructure simple.
La protection ping contrôle les requêtes serveur-list pour empêcher les bots de passer avant même de se connecter.
Un mode Turnstile exige de passer par le ping serveur avant de pouvoir rejoindre, ce que les bots automatisés ne font pas.
Les compteurs de fenêtre glissante limitent les pings et les joins par période afin de maintenir des ratios IP stricts.
Chaque IP est suivie : le nombre de connexions, la fréquence et les pics sont comparés à des seuils configurables.
Les ratios par IP déclenchent des actions allant d'une simple limitation à un blocage immédiat des nouvelles connexions.
Un score anti-bot évalue chaque client : entropie du pseudo, volume de pings, source hébergement, VPN et pays.
Ce scoring, comparable à Bot Management de Cloudflare, classe les connexions de 1 (humain) à 99 (bot).
Les IP considérées comme bots sont placées en blacklist temporaire avec une durée de bannissement configurable.
La blacklist temporaire est automatique, thread-safe et peut être levée manuellement à tout moment grâce à une commande de déban.
Le mode attaque (Under Attack) renforce instantanément la sévérité : plus de challenges, plus de blocages, shield de cinq secondes.
Le mode attaque peut être activé à la main ou automatiquement détecté selon les seuils de connexions par seconde.
Un firewall d'expression reproduit le modèle de règles Cloudflare, comme bloquer les IP dont le score de bot dépasse un seuil.
Des règles géographiques permettent de bloquer ou challenger des pays entiers pour filtrer les origines hostiles.
Des règles ASN bloquent ou challengent des acteurs de réseau (hébergeurs, cloud) dont le trafic est suspect.
La détection VPN vérifie les adresses via une API externe pour bloquer ou défier les connexions par proxy privé.
Les blacklists d'IP et de CIDR sont gérées finement et persistent automatiquement après chaque modification.
Le validateur de handshake inspecte l'host, le port et la version du client pour refuser les connexions bricolées.
Le blocage bogon neutralise les adresses invalides ou privées qui ne peuvent jamais être légitimes en ligne.
La protection anti-bot est renforcée par des passerelles de challenge avec un bouclier de cinq secondes type Cloudflare.
Un challenge réussi accorde un passage de trente minutes, évitant de re-tester les joueurs humains à chaque visite.
Les joueurs de confiance (UUID connus) bénéficient d'une dérogation : score amélioré, VPN ignoré et challenges contournés.
La tolérance NAT accorde des slots supplémentaires aux IP légitimes déjà connectées pour ne pas punir les joueurs partagés.
Les joueurs whitelistés ou de confiance sont ignorés par le mode attaque, le hit-and-run et la détection VPN.
Une période de grâce post-login et un délai de déconnexion évitent les faux positifs sur les connexions instables.
Les statistiques détaillées rapportent les joins autorisés, les blocages totaux, les blocages à la minute et la liste des raisons.
Un planificateur purge les IP suivies toutes les cinq minutes pour garder la mémoire de protection légère et rapide.
Les messages du plugin sont entièrement externalisés et personnalisables dans un fichier de messages complet.
La configuration est riche : niveaux de sécurité, tolérances, seuils anti-DDoS L7, protections globales par seconde.
Des permissions fines (admin, reload, stats, attack, whitelist, blacklist, unban, bypass) contrôlent chaque action.
Le plugin ainsi protégé sans domaine sur une IP brute devient virtuellement invisible aux botnets d'entrée.
KM-AntiBots offre donc la puissance d'un CDN anti-bot sans abonnement Cloudflare, tout en inspectant plus finement Minecraft.