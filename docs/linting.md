# 🧹 Qualité de code, Linting & Sécurité des commits

Ce projet met en place une stratégie stricte de qualité de code afin de garantir :
- un code lisible et maintenable
- moins d’erreurs en production
- des commits propres et fiables
- une base de code cohérente pour toute l’équipe

Cette stratégie repose principalement sur **Biome** et **Husky**.

---

## 🛠️ Outils utilisés

### 🔹 Biome
Biome est un outil moderne qui regroupe :
- le **formatter** (mise en forme du code)
- le **linter** (détection d’erreurs et mauvaises pratiques)
- l’**organisation automatique des imports**

Il remplace avantageusement :
- ESLint
- Prettier
- certaines règles TypeScript ESLint

👉 Un seul outil, une seule config, plus de cohérence.

---

### 🔹 Husky
Husky permet d’exécuter des scripts **automatiquement lors des actions Git**  
(ex: `commit`, `push`, etc.).

Dans ce projet, Husky est utilisé pour :
👉 **empêcher les commits contenant du code incorrect**

Concrètement :
- à chaque `git commit`
- Biome est exécuté automatiquement
- si une erreur est détectée → le commit est bloqué

---

## 🎯 Pourquoi cette approche ?

### Sans linting strict ❌
- `console.log` oubliés en production
- variables inutilisées
- typage approximatif
- code incohérent selon les fichiers
- bugs difficiles à repérer

### Avec Biome + Husky ✅
- erreurs détectées très tôt
- qualité constante
- discipline automatique
- gain de temps en revue de code
- standards professionnels respectés

👉 **Le code ne peut pas être versionné s’il est incorrect.**

---

## 🔥 Règles principales appliquées

### ❌ Erreurs bloquantes
Les éléments suivants empêchent un commit :

- `console.log`
- `debugger`
- variables ou imports inutilisés
- utilisation de `var`
- comparaison avec `==` au lieu de `===`
- typage `any` (TypeScript)
- assertions non-null (`!`)

---

### ✅ Bonnes pratiques imposées
- utilisation de `const` quand possible
- imports automatiquement organisés
- formatage homogène
- règles TypeScript strictes

---

## 🧪 Commandes Biome

### Vérifier le code (sans modifier)
```bash
npx biome check .
```

### Vérifier et corriger automatiquement
```bash
npx biome check . --write
```