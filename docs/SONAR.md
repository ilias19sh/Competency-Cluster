# Documentation : Analyse de Qualité avec SonarCloud 🚀

## 1. Qu'est-ce que SonarCloud ?

SonarCloud est une plateforme d'**analyse statique de code** (SAST). Contrairement à un test unitaire qui vérifie si le code "fonctionne", SonarCloud vérifie si le code est "bien écrit".

Il scanne le dépôt à chaque changement pour détecter :

* **Bugs** : Erreurs logiques potentielles.
* **Vulnerabilities** : Failles de sécurité (ex: injection SQL, secrets exposés).
* **Code Smells** : Code complexe, mal structuré ou difficile à maintenir.
* **Dette Technique** : Estimation du temps nécessaire pour corriger les problèmes.
* **Couverture de code** : Pourcentage de code testé.

---

## 2. Pourquoi c'est utile pour "Competency-Cluster" ?

Dans le cadre d'un CDA (Concepteur Développeur d'Applications), la qualité du code est aussi importante que la fonctionnalité :

* **Professionnalisme** : Garantit que le projet respecte les standards de l'industrie.
* **Sécurité** : Étant un outil de gestion de compétences, la protection des données est clé. Sonar identifie les bibliothèques obsolètes ou les failles.
* **Maintenance facilitée** : Le projet est un monorepo (Backend/Frontend). Sonar aide à garder une structure propre malgré la complexité.
* **Validation du diplôme** : Prouve une maîtrise des outils de CI/CD (Intégration Continue).

---

## 3. Configuration mise en place

### A. Fichier de propriétés (`sonar-project.properties`)

Nous avons centralisé la configuration à la racine pour que le scanner sache quoi analyser.

```properties
# Identifiants uniques
sonar.projectKey=competency-cluster_competency-cluster
sonar.organization=votre-org-sonarcloud

# Chemins d'analyse
sonar.sources=.
sonar.exclusions=**/node_modules/**, **/dist/**, **/*.spec.ts

# Encodage
sonar.sourceEncoding=UTF-8

```

### B. Workflow GitHub Actions (`.github/workflows/sonar.yml`)

L'analyse est automatisée à chaque **Push** sur `main` ou chaque **Pull Request**.

```yaml
name: SonarCloud
on:
  push:
    branches: [ main ]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarcloud:
    name: SonarCloud Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Crucial pour l'analyse des différences
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

```

---

## 4. Problèmes résolus durant l'installation 🛠️

Pendant la mise en place, nous avons corrigé plusieurs points critiques :

1. **Dossiers inexistants** : Correction des chemins `sonar.sources` qui pointaient vers des dossiers `apps/` absents.
2. **Organisation Sonar** : Alignement de la clé `sonar.organization` avec celle de l'instance SonarCloud.
3. **Pollution Git** : Nettoyage massif du dépôt (suppression des `node_modules` de l'historique via `filter-branch`) pour éviter d'analyser les dépendances externes, ce qui faisait échouer le scan.
4. **Protection de branche** : Gestion des droits Admin pour permettre le nettoyage de l'historique (`force-push`) tout en gardant la sécurité pour les PR.

---

## 5. Comment lire les résultats ?

Une fois le scan terminé, un rapport apparaît directement dans :

1. **L'onglet "Checks"** de la Pull Request sur GitHub.
2. **Le tableau de bord SonarCloud** : donne une note de A à E (le "Quality Gate").

> **Note :** Si le "Quality Gate" échoue (rouge), le merge de la PR est bloqué, garantissant que seul du code de haute qualité arrive sur la branche principale.
