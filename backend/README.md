# Competency Cluster - Backend

## Stack

- **Framework** : [NestJS](https://nestjs.com/) (Node.js, TypeScript)  
- **Base de données** : PostgreSQL / MySQL (configurable via `.env`)  
- **Testing** : [Jest](https://jestjs.io/) pour tests unitaires et d’intégration  
- **TypeScript** : strict, avec types centralisés dans `utils/types.ts`  
- **API externes** : isolées dans le dossier `api/`  

---

## Structure du projet

```

src/
├── features/       # Fonctionnalités principales
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.model.ts
│   ├── users/
│   ├── quizz/
│   └── leaderboard/
│
├── api/            # Intégrations API externes
├── utils/          # Types et helpers partagés
├── config/         # Config DB, app, environnement
├── common/         # Middleware, guards, interceptors
├── app.module.ts
└── main.ts

```

---

## Règles de développement

1. **Une feature = un dossier**  
   - Chaque feature contient **son controller, service et modèle**.  
   - Exemple : `features/quizz/` → `quizz.controller.ts`, `quizz.service.ts`, `quizz.model.ts`  

2. **Tests obligatoires**  
   - Chaque feature doit avoir des tests unitaires avec **minimum 70% de coverage**.  
   - Les tests doivent se trouver dans un fichier séparé ou dans un sous-dossier `__tests__/` dans la feature.  

3. **Types centralisés**  
   - Tous les types TypeScript partagés doivent être définis dans `utils/types.ts`.  
   - Éviter de redéfinir les interfaces ou types dans plusieurs features.  

4. **Réutilisation du code**  
   - Ne pas recréer des services ou modèles déjà existants.  
   - Appeler les modules existants via import si nécessaire.  

5. **API externes**  
   - Toute intégration avec une API externe doit être placée dans `api/`.  
   - Chaque service externe doit être injectable et testé indépendamment.  

6. **Configuration**  
   - Variables sensibles (`DB_HOST`, `DB_USER`, `API_KEY`, etc.) doivent être dans `.env`.  
   - La configuration globale de l’application est dans `config/`.  

7. **Good practices**  
   - Controllers → gestion des routes uniquement  
   - Services → logique métier et appels aux modèles / DB  
   - Models → définition des entités ou schémas  
   - Common → middleware, guards et interceptors partagés  

---


## Scripts utiles

| Script | Description |
|--------|-------------|
| `npm run start` | Démarre le backend en mode production |
| `npm run start:dev` | Démarre le backend en mode développement avec rechargement automatique |
| `npm run test` | Lance les tests unitaires |
| `npm run test:cov` | Lance les tests et génère le coverage |
| `npm run build` | Compile le projet TypeScript dans `dist/` |

---

## Notes

- Le backend est **feature-based**, inspiré de la philosophie React.  
- L’objectif est de **réutiliser les modules existants**, de maintenir une **cohérence dans le code** et de faciliter l’évolution du projet.  
- Toute nouvelle fonctionnalité doit respecter cette structure pour être intégrée correctement.