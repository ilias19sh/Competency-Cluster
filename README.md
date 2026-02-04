# 🚀 Competency Cluster

**Competency Cluster** est une application web moderne conçue pour la gestion, la visualisation et l'évaluation des grappes de compétences. Le projet permet de structurer des parcours d'apprentissage et de suivre l'évolution des acquis de manière intuitive et dynamique.

## 🛠️ Stack Technique

* **Frontend** : React / TypeScript / Vite
* **Backend** : Node.js / Nest
* **Outils** : Biome (Linting), Vitest (Tests), SonarCloud (Qualité)

---

## ⚙️ Installation & Lancement

Ce projet est structuré en **Monorepo**. Pour le faire fonctionner correctement, vous devez installer les dépendances à trois niveaux.

### 1. Installation globale (Racine)

Indispensable pour la gestion des outils de qualité (Husky, Biome) :

```bash
npm install

```

### 2. Configuration du Backend

```bash
cd backend
npm install
# Créez votre fichier .env basé sur .env.example

```

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install

```

### 3. Lancement du projet
Se mettre à la racine puis 
```bash
npm run dev

```


---

## 🧪 Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run test` | Lance la suite de tests Vitest |
| `npm run lint` | Vérifie la qualité et le formatage du code |
| `npm run build` | Prépare les bundles pour la production |

---

## 📜 Conventions du Projet

Le projet suit des règles strictes pour garantir une base de code saine :

* **Commits** : Respect de la convention `type(ticket): description`.
* **Qualité** : Analyse automatique via SonarCloud sur chaque Pull Request.
* **Tests** : Seuil de couverture minimal fixé à **70%**.

---

## 👥 Équipe

Développé dans le cadre du titre **CDA (Concepteur Développeur d'Applications)** par **Koman Boni** & **Ilias Hanfaoui**.