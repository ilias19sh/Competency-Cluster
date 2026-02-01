# Competency Cluster - Frontend

## Stack

- **Framework** : [React](https://reactjs.org/) + TypeScript  
- **State management** : Redux ou Zustand (optionnel selon la feature)  
- **Routing** : React Router v6  
- **Styling** : CSS Modules / Tailwind / SCSS (selon la convention choisie)  
- **Testing** : [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)  
- **API** : appels backend centralisés via `services/api.ts`  

---

## Structure du projet

```

src/
├── features/               # Fonctionnalités principales
│   ├── quizz/
│   │   ├── QuizPage.tsx    # Composant principal de la feature
│   │   ├── QuizPage.module.css  # Styles propres à la feature
│   │   └── QuizPage.test.tsx    # Tests unitaires (>70% coverage)
│   ├── leaderboard/
│   └── auth/
│
├── components/             # Composants réutilisables UI
│   ├── Button.tsx
│   ├── Table.tsx
│   └── Modal.tsx
│
├── hooks/                  # Hooks réutilisables
│   ├── useAuth.ts
│   └── useQuiz.ts
│
├── pages/                  # Pages principales pour router
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── NotFound.tsx
│
├── services/               # API calls et services
│   └── api.ts
│
├── store/                  # Redux / Zustand store
│   └── index.ts
│
├── utils/                  # Types et helpers partagés
│   ├── types.ts
│   ├── validators.ts
│   └── formatters.ts
│
├── styles/                 # Styles globaux et thème
│   └── theme.ts
├── App.tsx
└── main.tsx

```

---

## Règles de développement

1. **Une feature = un dossier**  
   - Chaque feature contient **au minimum :**  
     - Composant principal `.tsx`  
     - Styles associés `.module.css` ou `.scss`  
     - Tests unitaires `.test.tsx` avec **>70% coverage**  
   - Exemple : `features/quizz/` → `QuizPage.tsx`, `QuizPage.module.css`, `QuizPage.test.tsx`  

2. **Réutilisation des composants**  
   - Tout ce qui est UI générique doit être placé dans `components/`  
   - Les hooks réutilisables vont dans `hooks/`  
   - Les types partagés dans `utils/types.ts`  

3. **Tests obligatoires**  
   - Chaque feature doit avoir ses tests unitaires  
   - Coverage minimum de 70%  
   - Les tests doivent valider le rendu et la logique des composants  

4. **Pages et routing**  
   - `pages/` contient les pages du router  
   - Une page peut appeler plusieurs features pour composer l’UI  

5. **Services et appels backend**  
   - Les appels API doivent passer par `services/api.ts`  
   - Éviter d’appeler directement `fetch` ou `axios` dans les composants  

6. **Styles**  
   - Les styles spécifiques à une feature doivent rester dans le dossier de la feature  
   - Les styles globaux ou thème → `styles/theme.ts`  

7. **Good practices**  
   - Composants → pure UI, pas de logique métier  
   - Hooks → logique réutilisable et état local à la feature  
   - Features → composent composants et hooks, pas de duplication  

---

## Scripts utiles

| Script | Description |
|--------|-------------|
| `npm run start` | Démarre le frontend en mode développement |
| `npm run build` | Compile le projet pour production |
| `npm run test` | Lance les tests unitaires |
| `npm run test:cov` | Lance les tests avec génération de coverage |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |

---

## Notes

- Le frontend est **feature-based**, inspiré de React.  
- On favorise la **réutilisation des composants, hooks et types** pour éviter les duplications.  
- Toute nouvelle feature doit respecter cette structure et ces règles pour être intégrée correctement.