# KM-Riot Ops (Proxy)
- Name: KM-Riot Ops (Proxy)
- Stable version: none
- Stable jar: none
- Dev version: 0.1.0-DEV
- Dev jar: KM-RiotOps-Velocity-0.1.0-DEV.jar

## Description

KM-Riot Ops (Proxy) est le coordinateur Velocity du système KM-Riot Ops : hébergé sur le proxy, il supervise en temps réel l'état de chaque backend du réseau protégé par la solution.
De par son rôle de pilote et superviseur central, il offre donc une vision consolidée, propre au proxy, de toutes les machines qui exécutent KM-Riot Ops côté serveur de jeu.
La télémétrie est acheminée par le canal de plugin messaging km-riotops:probe : chaque backend y publie régulièrement un instantané JSON de sa santé.
Ces probes décrivent l'état de chaque backend : TPS, millisecondes par tick (mspt), pourcentage de heap utilisé, joueurs connectés et capacité maximale.
Chaque probe transporte aussi le nombre d'agents actifs, les findings HIGH et CRITICAL remontés par KM-Riot Ops, ainsi qu'un indicateur lab pour les serveurs d'essai.
Un parser JSON défensif (ProbeParser) protège le proxy : aucune donnée hostile ou malformée ne peut faire tomber le plugin, tout retour anormal étant simplement rejeté.
La validation est stricte : le format kind/version est contrôlé, chaque champ est extrait de façon sécurisée et les valeurs numériques anormales sont écartées.
Les payloads sont bornés pour éviter tout abus : messages limités à 64 Ko et à 64 entrées de findings maximum lors de l'analyse.
Par sécurité, le listener n'accepte les probes que lorsqu'elles proviennent d'un backend officiel (ServerConnection) : les messages injectés par des joueurs sont ignorés.
Les messages malformés sont simplement ignorés et tracés en debug, sans jamais être enregistrés dans le store.
Chaque probe valide est conservée par backend dans un store thread-safe (ProbeStore), qui retient le dernier instantané reçu et son âge d'arrivée.
Le store expose instantanés et âges de fraîcheur, ce qui signale immédiatement un backend muet ou obsolète dans le panorama du proxy.
Un moteur d'alerte (AlertEngine) évalue chaque backend selon des seuils entièrement ajustables : TPS sous le seuil ou heap trop élevé, cela déclenche WARNING.
TPS tombant sous le seuil critique, le niveau CRITICAL est levé : l'alerte devient alors une priorité absolue pour la résilience de l'infrastructure.
Les seuils par défaut sont prudents : TPS warning sous 15.0, TPS critique sous 12.0 et alerte mémoire au-delà de 92 % de heap utilisé.
Le moniteur d'alerte (AlertMonitor) tourne toutes les 5 secondes sur le scheduler du proxy et ré-évalue en continu l'ensemble des backends actifs.
La détection est dédupliquée par backend et par niveau : une alerte n'est émise qu'au changement d'état, éliminant tout spam répétitif.
À chaque escalation, le moniteur consigne un log détaillant backend, sévérité, TPS, heap, joueurs, findings et agents.
Les joueurs disposant de la permission kmriotops.alert sont notifiés en temps réel dans le jeu, avec un rendu coloré selon la gravité.
L'activation ou la désactivation du moteur d'alertes s'effectue à chaud, sans redémarrage du proxy, et réinitialise l'état de déduplication.
Une commande /kmriotops (alias /kmro) offre un cockpit d'exploitation complet, protégée par la permission kmriotops.command.
/kmriotops status dresse un panorama consolidé : chaque serveur du proxy avec TPS, mspt, heap, joueurs, findings, agents, marqueur [lab] et âge du dernier probe.
Chaque ligne du statut est colorée selon la santé du backend : vert pour OK, rouge pour un risque détecté, rouge sombre pour une alerte critique.
/kmriotops alert on|off active ou coupe le moteur d'alertes instantanément.
/kmriotops threshold tps <warn> <crit> ajuste les seuils TPS warning et critique, tandis que threshold heap <pct> ajuste le seuil mémoire.
La validation des seuils garantit leur cohérence : un seuil critique doit rester inférieur au seuil warning, et les bornes mémoire sont encadrées.
La commande propose la tab-complétion pour guider l'opérateur : status, servers, alert, threshold et help.
Le plugin s'enregistre proprement sur le canal km-riotops:probe à l'initialisation du proxy, puis lance son moniteur périodique.
À l'arrêt du proxy, la tâche de monitoring est annulée et le nombre de backends suivis est consigné dans les logs.
Gson est shadé et relocalisé (fr.krazystudio.kmriotopsproxy.libs.gson) : aucun conflit de dépendance avec l'environnement Velocity ne peut survenir.
Développé pour Velocity 3.x, le plugin repose sur les APIs natives de messaging, de scheduler, d'événements et de commandes de la plateforme.
Conçu pour la résilience opérationnelle, il ne fait reposer aucune charge lourde ni sur le proxy ni sur les backends supervisés.
L'architecture est simple et robuste : un listener, un store, un moteur de décisions et un moniteur périodique suffisent à couvrir l'ensemble du réseau.
Idéal pour les réseaux multi-backends qui doivent détecter le plus tôt possible une chute de performance ou une montée de mémoire avant qu'elle ne frappe les joueurs.
KM-Riot Ops (Proxy) est le compagnon naturel des backends protégés par KM-Riot Ops : télémétrie fidèle, alertes précoces et supervision unifiée.
L'outil n'administre pas à la place de l'équipe : il l'éclaire, en pointant sans délai la machine qui souffre et son niveau de gravité.
Le statut signale aussi les serveurs sans télémétrie ("no probe yet"), soit parce qu'ils sont muets, soit parce que KM-Riot Ops n'y est pas (encore) déployé.
Entièrement autonome, le plugin fonctionne une fois son jar déposé dans le dossier plugins du proxy, sans configuration externe requise.
Développé par krazyman_off, le plugin est léger en mémoire et sans aucune dépendance réseau : toute la logique est embarquée dans le jar.
La télémétrie arrive déjà agrégée depuis les backends, ce qui maintient la charge du proxy minimale, même sur de grands réseaux.
La version 0.1.0, livrée ici, constitue un socle de supervision fiable pour tout proxy Velocity équipé de backends KM-Riot Ops.