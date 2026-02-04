# 🧪 Guide des Tests - Competency Cluster

Nous utilisons **Vitest** pour tester l'application. L'objectif est de vérifier la logique métier simplement, sans complexité inutile.

## 1. Philosophie des tests

* **Simplicité avant tout** : On teste les fonctions, les utilitaires et les composants de base.
* **Pas de MSW** : Pour les appels API, on utilise des **Mocks simples** (on remplace la fonction par une version factice) pour ne pas perdre de temps.
* **Coverage** : On vise **70% de couverture** minimum pour assurer la robustesse du CDA.

---

## 2. Commandes de base

À lancer depuis le dossier `backend` ou `frontend` :

| Commande | Action |
| --- | --- |
| `npm run test` | Lance tous les tests une seule fois. |
| `npm run test:watch` | Lance les tests en mode "live" (re-scanne à chaque modif). |
| `npm run test:ui` | Ouvre une interface stylée dans le navigateur pour voir les tests. |
| `npm run test:cov` | Génère le rapport de couverture (Coverage). |

---

## 3. Comment écrire un test simple ?

Crée un fichier finissant par `.spec.ts` ou `.test.ts`.

### Exemple : Tester une fonction de calcul

```typescript
import { expect, test } from 'vitest'
import { calculateScore } from './competency.utils'

test('devrait calculer le score correctement', () => {
  const result = calculateScore(10, 5)
  expect(result).toBe(15)
})

```

### Exemple : Simuler (Mocker) un service sans se prendre la tête

Pas besoin de MSW, on utilise `vi.fn()` ou `vi.mock()` :

```typescript
import { vi, test, expect } from 'vitest'
import { userService } from './user.service'

test('devrait simuler un appel API', async () => {
  // On force le service à renvoyer ce qu'on veut
  userService.getUser = vi.fn().mockResolvedValue({ id: 1, name: 'Ilias' })

  const user = await userService.getUser(1)
  expect(user.name).toBe('Ilias')
})

```

---

## 4. Seuil de Couverture (Coverage)

Le projet est configuré pour exiger **70% de coverage**.
Si tu tombes en dessous, le scan **SonarCloud** passera au rouge et bloquera la Pull Request.

### Comment voir ce qui n'est pas testé ?

Lance `npm run test:cov`.
Un dossier `/coverage` est généré. Ouvre le fichier `coverage/index.html` dans ton navigateur : il te montre ligne par ligne ce que tu as oublié de tester (en rouge).

---

## 5. Règles d'or

1. **Nommage** : Les tests doivent être clairs (ex: `devrait afficher une erreur si le champ est vide`).
2. **Localisation** : Place tes fichiers `.spec.ts` juste à côté du fichier qu'ils testent.
3. **Clean** : Ne laisse pas de tests qui "fail" en poussant ton code.
