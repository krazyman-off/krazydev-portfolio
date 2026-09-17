# KRAZYCRYPT — chiffrement local du site

Chiffrement **hybride** : chaque fichier reçoit des clés aléatoires
AES-256 + HMAC-SHA256, enveloppées en RSA-2048-OAEP (clé publique = chiffrer,
clé privée = déchiffrer). RSA seul ne peut pas chiffrer de gros fichiers,
d'où l'hybride. Vérification HMAC + SHA256 au déchiffrement.

## Usage

1. Double-clic `KRAZYCRYPT.bat` → `1` (génère `secure/keys/public.xml` + `private.xml`).
2. Option `2` : chiffre tous les fichiers suivis par git → `secure/vault/`
   (`.bin` + `.meta.json` par fichier) + clone en clair `secure/origin-plain/`.
3. Option `3` : déchiffre `secure/vault/` → `secure/restore-check/`.

## Limites honnêtes (à lire)

- **GitHub Pages sert du clair** : un vault chiffré commité ne peut pas être
  déployé tel quel. Le motif réel serait : repo privé + clé privée en
  GitHub Secret + étape de déchiffrement dans le workflow avant déploiement.
- **Pas de « VM que personne sauf GitHub peut utiliser »** : tout runner
  Actions est partagé ; la garantie vient du repo privé + secrets, pas du
  chiffrement seul.
- `keys/`, `vault/`, `origin-plain/`, `restore-check/` sont gitignorés :
  **ne commite jamais la clé privée**. Une clé privée copiée dans un chat,
  un mail ou un commit est compromise.
- OAEP ici en SHA-1 (limite de .NET Framework) pour l'enveloppe de 64 octets ;
  acceptable pour cet usage, à durcir (OAEP-SHA256) si porté sur .NET moderne.
