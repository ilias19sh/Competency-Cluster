# Guide sur les `.gitignore`

## 1. Introduction

Le fichier `.gitignore` permet d’indiquer à Git quels fichiers ou dossiers ne doivent pas être suivis par le système de versionnement. Il est essentiel pour maintenir un dépôt propre et éviter de versionner des fichiers temporaires, générés automatiquement ou sensibles.

Dans un projet fullstack comme **Competency Cluster**, où le front-end et le back-end coexistent dans un même dépôt, un `.gitignore` bien structuré est indispensable pour éviter les conflits et assurer une uniformité.

---

## 2. Pourquoi utiliser un `.gitignore`

1. Éviter de versionner des fichiers volumineux tels que `node_modules` qui n’ont pas besoin d’être dans le dépôt.
2. Protéger les informations sensibles, notamment les fichiers de configuration et les variables d’environnement.
3. Prévenir les conflits liés aux fichiers générés automatiquement (builds, logs, caches).
4. Garantir que tous les développeurs travaillent avec une configuration cohérente.

---

## 3. Structure typique du projet

Pour **Competency Cluster**, la structure du dépôt pourrait être la suivante :

```
competency-cluster/
├── backend/
├── frontend/
├── scripts/
│   └── banner.js
├── .gitignore
├── package.json
└── README.md
```

Dans ce type de projet, il est recommandé d’avoir un `.gitignore` principal à la racine qui couvre à la fois le front-end et le back-end. Des `.gitignore` spécifiques aux sous-projets peuvent être ajoutés si nécessaire, mais ils ne sont pas obligatoires si le fichier racine est complet.

---

## 4. `.gitignore` recommandé

Voici un exemple de `.gitignore` uniforme pour le dépôt **Competency Cluster** :

```gitignore
# Node / JavaScript
node_modules/
**/node_modules/

# Build / Dist
dist/
**/dist/
build/
**/build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
**/.env

# OS / IDE
.DS_Store
Thumbs.db
.vscode/
.idea/

# Temporary files / cache
*.tmp
.cache/
```

### Explications

* `**/node_modules/` : ignore tous les dossiers `node_modules`, que ce soit dans le front-end ou le back-end.
* `**/dist/` : ignore tous les builds générés.
* `.env` : protège les variables d’environnement et les fichiers de configuration sensibles.
* `.vscode/`, `.idea/` : ignore les configurations d’IDE locales.
* Logs et caches : empêche d’encombrer le dépôt avec des fichiers générés temporairement.

---

## 5. `.gitignore` spécifiques aux sous-projets (optionnel)

Si vous souhaitez gérer certains fichiers uniquement pour un sous-projet :

### Frontend (React / Vite / TypeScript)

```gitignore
node_modules/
dist/
.env.local
.vite/
```

### Backend (NestJS / Node.js)

```gitignore
node_modules/
dist/
.env
```

Ces fichiers sont optionnels si le `.gitignore` principal est déjà bien structuré.

---

## 6. Bonnes pratiques

1. Placer le `.gitignore` à la racine pour unifier la configuration.
2. Ne jamais versionner de fichiers sensibles.
3. Ajouter tous les fichiers générés automatiquement (`node_modules`, `dist`, logs, cache).
4. Mettre à jour le `.gitignore` dès l’apparition de nouveaux fichiers temporaires.
5. Utiliser des patterns globaux (`**/folder`) pour couvrir tous les sous-dossiers.

---

## 7. Option avancée : `.gitignore_global`

Pour ignorer des fichiers propres à votre machine (OS ou IDE) dans tous vos projets Git :

```bash
git config --global core.excludesfile ~/.gitignore_global
```

Exemple pour macOS :

```gitignore
.DS_Store
```

---

## 8. Résumé rapide

| Type de fichier           | Doit être ignoré ? | Exemple              |
| ------------------------- | ------------------ | -------------------- |
| node_modules              | Oui                | `node_modules/`      |
| Build / dist              | Oui                | `dist/`              |
| Fichiers de configuration | Oui                | `.env`               |
| Logs                      | Oui                | `*.log`              |
| Code source               | Non                | `src/`               |
| IDE / OS configs          | Oui                | `.vscode/`, `.idea/` |

---
