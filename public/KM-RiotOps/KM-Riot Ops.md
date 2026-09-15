# KM-Riot Ops
- Name: KM-Riot Ops
- Stable version: none
- Stable jar: none
- Dev version: 2.0.0-DEV
- Dev jar: KM-RiotOps-Bukkit-2.0.0-DEV.jar

## Description

KM-Riot Ops est un système de sécurité et d'audit backend pour serveurs Paper 1.20.4, pensé pour les serveurs de réseaux qui doivent garder leurs backends sous contrôle.
Le plugin fonctionne exclusivement en local-only : chaque moteur refuse toute cible externe et n'agit que sur la machine du serveur installé.
La priorité du moteur est nette : stabilité d'abord, sécurité ensuite, correction, détection, performance, expérience utilisateur.
Un safety controller centralise un drapeau d'abort vérifié par toutes les opérations longues (agents, stress, fuzzing) et autorise uniquement les cibles locales.
L'agent local-only-guard vérifie en continu que l'invariant local-only reste actif et émet un finding critique si la configuration a été désactivée.
En cas d'échec fatal au démarrage, le plugin se désactive lui-même pour protéger le serveur : fail-safe obligatoire.
Un moteur d'agents (AgentEngine) exécute les analyseurs sous budgets de temps et de ressources, avec cancellation propre via token.
L'agent resource-health observe le TPS critique et l'usage de la heap par rapport aux seuils de sécurité configurés.
L'agent config-analyzer lit en lecture seule server.properties et les fichiers de sécurité (whitelist, ops, bans) et signale online-mode=false, command blocks ou protection de spawn à 0.
L'agent command-analyzer parcourt l'inventaire local des commandes et détecte les commandes sans permission ou avec permissions wildcard.
L'agent permission-analyzer audite les permissions enregistrées : wildcard global '*', permissions sensibles actives par défaut et surface op.
L'agent plugin-analyzer contrôle la santé des plugins chargés : plugins désactivés, opacité (auteurs/site absents), versions snapshot et cycles de dépendances.
L'agent topology-analyzer décrit la topologie des mondes en lecture seule : environnement, difficulté, PvP, keep-inventory, chunks et entités chargés.
Un scanner d'inventaire local (InventoryScanner) collecte commandes, permissions et opérateurs depuis les plugin.yml, borné par un budget d'exécution.
Le monitor de ressources échantillonne toutes les 5 secondes TPS/MSPT, joueurs, chunks, entités, heap utilisée/max, charge CPU, GC et tâches en attente.
Le monitor garde un anneau de 120 échantillons, capture une baseline de référence et un pic (peak) pour suivre les dégradations dans le temps.
Un doctor (DoctorService) réalise le diagnostic de l'environnement : Java 17 minimum, type de serveur, plugins, mémoire, CPU, indices de proxy et disponibilité des APIs.
Le doctor n'applique aucune réparation ; il émet des statuts PASS/WARN/FAIL pour guider l'opérateur sans toucher au système.
Tous les findings passent dans un pipeline : stockés dans un store borné (5000 entrées, dédupliqué par agent+message), puis reliés dans un graphe de sécurité.
Le graphe de sécurité (SecurityGraph) relie findings, agents, commandes, permissions, plugins et mondes en un graphe dirigé borné.
Un correlator applique des règles pour promouvoir les observations : une même répétition vue trois fois devient confirmée, un HIGH passe en suspecté.
Le correlator détecte aussi le signal d'épuisement de ressources : TPS critique combiné à une pression heap élevée engendre un finding synthétique.
Le moteur de reproduction (ReproEngine) relance l'agent d'origine sur l'état local courant pour vérifier qu'un finding est toujours reproductible.
Les verdicts de reproduction sont clairs : reproductible, partiel ou non reproductible, et mettent à jour le statut des findings en conséquence.
Le moteur génère des étapes de remédiation et de vérification par catégorie : commandes, permissions, plugins, config, topologie, ressources et stress.
Le moteur de stress exige une autorisation lab (mode lab configuré ou activé en session) et n'autorise qu'un seul test actif à la fois.
Les tests de stress sont bornés en durée, soumis à un cooldown et annulables à tout moment via le token d'abort.
Deux types de tests sont fournis : brûlage CPU (CpuBurnStress) et inondation du scheduler (SchedulerFloodStress), chacun mesurant l'impact sur les ressources.
Le fuzzer contrôlé (FuzzEngine) attaque les parseurs internes (échappement JSON, découpage de commandes) avec des octets aléatoires, purement CPU.
Le fuzzing n'a aucun effet réseau ou I/O, ses itérations sont plafonnées et il reste compatible cancellation.
Un moteur d'auto-test (SelfTestEngine) lance des vérifications d'intégrité en JVM : invariant local-only, politique de cibles, bornes du store, dédup, JSON et fumée fuzzing.
La sonde backend (ProbeModule) remonte périodiquement la télémétrie locale au proxy via plugin messaging sur un canal dédié, sans cible réseau externe.
La sonde transmet TPS, MSPT, usage heap, compteurs de joueurs, statistiques de findings et nombre d'agents enregistrés.
Les rapports sont générés en trois formats : lignes console, fichier JSON et page HTML, écrits uniquement dans le dossier reports du plugin.
Les rapports lisent exclusivement l'état des moteurs et n'écrivent que dans plugins/KM-RiotOps/reports.
Les findings sont classés par sévérité (INFO, LOW, MEDIUM, HIGH, CRITICAL) et par statut (observé, suspecté, confirmé).
La commande maîtresse km-riotops regroupe les sous-commandes : statut, scan, analyse, topologie, monitor, findings, rapport, abort, doctor, lab, reproduction et auto-test.
Les permissions sont gérées finement : scan, analyze, stress et report, tous rattachés à une permission admin réservée aux opérateurs.
Un exécuteur asynchrone borné (threads core/max et file bornée) isole les travaux lourds du thread principal du serveur.
Un exécuteur principal (main thread executor) garantit que la lecture des données synchrones ignore les zones non sécurisées.
En mode local-only désactivé, tous les moteurs restent éteints : seuls le doctor et l'abort demeurent actifs, par conception de sécurité.
Le plugin est pensé comme moteur défensif : il ne scanne rien à l'extérieur et ne tente aucun contact réseau non prévu.
La configuration complète est chargée au démarrage et relue sur demande ; aucun réglage ne peut être modifié à chaud par un agent.
Le système est conçu pour ne jamais bloquer longtemps, ne jamais allouer sans borne et échouer en silence plutôt que de casser le serveur.
Les tests d'intégrité (self-test) couvrent la robustesse des parseurs jusque dans les chaînes hostiles, garantissant des rapports JSON fiables.
L'ensemble forme une chaîne complète : détection, stockage, corrélation, graphe, reproduction, rapport et remédiation guidée, le tout en local.
Destiné aux réseaux de serveurs, KM-Riot Ops se concentre uniquement sur le backend Paper, hors de portée des joueurs et sans surface externe.
Le rapport final donne au staff une vue consolidée : occurrences par sévérité, graphe des relations, et télémétrie TPS/MSPT/heap du moment.