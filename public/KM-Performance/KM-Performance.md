# KM-Performance
- Name: KM-Performance
- Stable version: none
- Stable jar: none
- Dev version: 1.0.0-DEV
- Dev jar: KM-Performance-Bukkit-1.0.0-DEV.jar

## Description

KM-Performance (anciennement KM-PL) est le plugin d'optimisation et d'isolation des latences de KrazyStudio (auteur : krazyman_off).
Il est développé en Java 21 et destiné aux serveurs Paper en version 1.21, avec un fonctionnement axé sur la stabilité avant tout.
Son objectif est ambitieux : isoler tout lag, qu'il provienne du monde, des chunks ou d'un sous-système particulier, sans jamais impacter le reste du serveur.
Un seul lagon ne doit plus jamais faire tomber l'ensemble de l'expérience de jeu de vos joueurs.
Le plugin repose sur un moteur d'isolation de nouvelle génération (V2) construit autour de mécanismes d'ingénierie de fiabilité éprouvés.
Le premier mécanisme est le bulkhead (cloison étanche), qui découpe le serveur en compartiments isolés.
Une surcharge de travail dans un compartiment ne peut plus se propager aux autres, protégeant ainsi les fonctionnalités critiques.
Le second mécanisme est le circuit breaker, qui coupe proprement le flux de travail vers une source de lag dès qu'elle dépasse les seuils.
Le circuit breaker fonctionne sur les trois états classiques : CLOSED (fermé), OPEN (ouvert) et HALF_OPEN (semi-ouvert).
L'état CLOSED laisse passer le travail normalement ; l'état OPEN le bloque pour protéger le serveur.
L'état HALF_OPEN est une étape de test : un trafic réduit est autorisé pour vérifier que la source est redevenue saine.
Chaque source de lag est surveillée en continu et son état adapté automatiquement, sans intervention de l'administrateur.
Le système de budget par tick complète le dispositif en attribuant un quota de travail à chaque sous-système.
Dès que le budget est dépassé, le travail excédentaire est reporté, réduit ou bloqué selon la criticité de la tâche.
Les tâches coûteuses comme la redstone, les hoppers, les entités ou la génération de chunks ne peuvent plus monopoliser le tick.
Le watchdog surveille en permanence la santé globale du serveur et détecte les dégradations avant qu'elles ne deviennent visibles.
En cas de dégradation, des modes dégradés progressifs allant de L0 à L3 sont activés automatiquement.
Le mode L0 correspond à une absence totale de restriction ; le mode L3 applique une isolation maximale des systèmes gourmands.
Les modes dégradés réduisent graduellement le travail autorisé jusqu'à ce que le serveur retrouve sa performance normale.
Le comportement est fail-open dans tous les cas : le plugin ne coupe jamais le jeu de manière brutale.
La commande /kmpl est une véritable console de performance avec plus de trente sous-commandes.
top identifie en un instant les sources de lag les plus importantes du serveur.
tps et memory permettent de surveiller les métriques vitales de stabilité et de mémoire disponible.
perf mesure les performances du serveur sur une période choisie, avec des rapports comparables.
chunks inspecte l'état du chargement des chunks et détecte les zones générées trop agressivement.
redstone, hopper, spawner, entityai et chunkload ciblent les sous-systèmes les plus souvent responsables de latence.
profiler, benchmark, trends et realtime analysent le comportement du serveur dans la durée.
stats, export et logging génèrent des rapports et des journaux exploitables pour le diagnostic.
alerts et health préviennent le staff dès qu'un indicateur passe sous un seuil critique.
dashboard offre une vue d'ensemble consolidée de tous les indicateurs de performance en un coup d'œil.
throttle limite le travail des systèmes identifiés comme trop gourmands.
autoconfig applique une configuration recommandée selon votre matériel et la taille de votre serveur.
tuning, limits, cache et gc affinent les réglages, les plafonds, les caches et la collecte des ordures.
reload permet de recharger la configuration à chaud, sans redémarrage du serveur.
network analyse le trafic entrant et sortant pour détecter les abus de bande passante.
prometheus expose les métriques au format Prometheus pour une intégration dans Grafana ou tout autre tableau de bord.
backup accompagne la sauvegarde de vos données sensibles directement depuis la commande.
worldborder pilote la limite du monde généré dynamiquement pour limiter le coût de génération des nouveaux chunks.
Les permissions sont simples : kmpl.use pour utiliser les commandes, kmpl.bypass pour contourner les temps d'attente.
Par défaut, les opérateurs disposent de kmpl.use, et la configuration des permissions est immédiatement compréhensible.
Les plugins tiers ne sont pas requis : KM-Performance fonctionne de manière autonome sur Paper.
Le projet prépare une bibliothèque native en Rust pour déléguer les opérations les plus coûteuses à du code compilé.
Cette évolution future apportera encore plus de performance et un moindre impact sur le moteur de jeu.
Les sources Java de l'ancienne version décompilée (61 fichiers) sont conservées à titre de référence.
Cette traçabilité garantit la maintenabilité et la reproductibilité du comportement du plugin.
KM-Performance est livré en variante Bukkit/Paper pour les serveurs backend.
La version 1.0.0-DEV est actuellement disponible et évolue activement au sein de KrazyStudio.
Il s'intègre naturellement à l'écosystème KrazyStudio, aux côtés de KM-Moderations et des autres composants.
La philosophie du plugin tient dans son nom : Performance & Lag-isolation.
Plutôt que d'appliquer des correctifs génériques, il isole la source du problème puis protège le reste du serveur.
Le flux de travail est restauré automatiquement dès que la santé du serveur revient à la normale.
Le résultat est un serveur plus stable, moins saccadé et plus agréable pour les joueurs, sans surveillance constante.
En résumé, KM-Performance apporte la rigueur de l'ingénierie de fiabilité au monde de Minecraft.
Un serveur qui lag ne fait plus tomber tout le monde : la performance devient un problème isolé et maîtrisé.