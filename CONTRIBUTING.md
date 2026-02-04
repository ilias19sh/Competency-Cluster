# 🛠️ Guide de Contribution - Competency Cluster

Bienvenue dans le projet **Competency Cluster**. Afin de maintenir une qualité de code optimale et une collaboration fluide, merci de respecter les conventions suivantes.

---

## 📂 1. Workflow des Branches

Nous utilisons un workflow basé sur les tickets **Jira**. Aucune modification ne doit être poussée directement sur la branche `main`.

* **Format du nom de branche :** `TYPE-NUMERO`
* **Exemple :** `CC-12` ou `CC-53`

> [!TIP]
> Avant de commencer à travailler, assurez-vous que votre branche locale est à jour :
> `git pull origin main --rebase`

---

## ✍️ 2. Convention de Commit

Nous suivons une syntaxe stricte pour faciliter la lecture de l'historique Git et automatiser la génération de changelogs.

### Format du message

`type(TICKET): description en minuscule`

**Exemple :** `feat(CC-12): add user competency validation`

### Types autorisés

| Type | Description |
| --- | --- |
| **feat** | Ajout d'une nouvelle fonctionnalité |
| **fix** | Correction d'un bug |
| **docs** | Modification de la documentation |
| **style** | Formatage, point-virgule manquant (aucun changement logique) |
| **refactor** | Amélioration du code sans changer le comportement |
| **test** | Ajout ou modification de tests |
| **chore** | Maintenance (build, dépendances, config) |

---

## 🧪 3. Standards de Qualité

Le code doit répondre aux critères suivants pour être accepté :

### 🧼 Code Propre (Clean Code)

* **Zéro `console.log**` : Interdiction de laisser des logs de debug.
* **Lining & Formatting** : Le script de linting (Biome/ESLint) doit passer sans erreur.
* **Commentaires** : Le code doit être auto-explicatif. Les commentaires sont réservés aux cas complexes.

### 📈 Tests & Coverage

* Tous les tests existants doivent passer.
* **Couverture minimale : 70%**. Toute nouvelle fonctionnalité doit être accompagnée de ses tests unitaires ou d'intégration.

---

## 🚀 4. Processus de Pull Request (PR)

Le passage par une PR est obligatoire pour intégrer du code à la branche principale.

1. **Création** : Ouvrez une PR avec un titre clair reprenant le numéro du ticket.
2. **Analyse Automatisée** : Le scan **SonarCloud** se lance automatiquement. Si le "Quality Gate" est rouge, corrigez les points soulevés.
3. **Revue par les pairs** : Au moins **1 approbation (Approve)** d'un collaborateur ayant des droits d'écriture est requise.
4. **Merge** : Une fois tous les checks au vert et l'approbation obtenue, le merge peut être effectué (privilégiez le *Squash and Merge* pour garder un historique propre).

---

## 🛡️ 5. Sécurité

* Ne jamais commiter de fichiers `.env` ou de secrets (clés API, mots de passe).
* Vérifiez que le `.gitignore` à la racine exclut bien les dossiers `node_modules/` et `dist/`.

---

## 💡 Règles Additionnelles

* **Atomicité** : Un commit = une seule tâche.
* **Langue** : Tous les messages de commit et la documentation technique sont rédigés en **Anglais** (standard industrie).
* **Self-Review** : Relisez vos changements sur GitHub avant de solliciter un collègue.

---

### Une question ?

Consultez la documentation technique dans `/docs` ou contactez le lead dev sur Discord. Merci de contribuer à la qualité de **Competency Cluster** ! 🚀