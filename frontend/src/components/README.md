Voici une version enrichie et structurée de la documentation, axée sur la catégorisation fonctionnelle et l'usage pratique, sans énumération exhaustive.

---

# Cc Design System | Documentation Technique

Ce Design System est une bibliothèque de composants React fermée, bâtie sur **Mantine v7**. Elle a été conçue pour offrir une interface utilisateur cohérente, centrée sur une typographie géométrique rigoureuse et un système de feedback visuel par gradients dynamiques.

## Principes Fondamentaux

L'écosystème repose sur l'utilisation exclusive de la police **Montserrat**. Le système de navigation et d'affichage utilise des rayons de courbure généreux (Standard `xl`) pour un aspect moderne et organique. La progression logicielle ou utilisateur est représentée par un dégradé allant du **Violet (#8C52FF)** à l'**Orange (#FF914D)**.

## Catégories de Composants

### 1. Composants d'Action
Ces composants gèrent les interactions utilisateurs. Ils intègrent nativement des états de survol (hover) et des variantes de couleurs pleines pour hiérarchiser les appels à l'action. Ils sont capables de s'adapter à la largeur de leur conteneur et peuvent servir de déclencheurs de navigation via `react-router-dom`.

### 2. Composants de Typographie
La typographie est le pilier du système. Elle est divisée en titres hiérarchisés et en blocs de texte textuels. Chaque élément respecte des contraintes strictes de *line-height* (100% pour les titres, 150% pour le corps) pour garantir une lisibilité optimale. Certains titres incluent des indicateurs visuels directionnels pour guider le regard.

### 3. Composants d'Affichage de Données (Data Display)
Cette catégorie regroupe les éléments de visualisation de progression et les conteneurs d'information.
* **Indicateurs de progression** : Qu'ils soient linéaires ou circulaires, ils utilisent une logique de "balayage chromatique" où la couleur évolue selon le score (0-100%).
* **Conteneurs de surface** : Des cartes blanches avec ombres portées subtiles et des badges (tags) à opacité réduite pour segmenter l'information sans surcharger l'interface.

---

## Intégration et Usage

Tous les composants sont exportés via un point d'entrée unique pour simplifier les imports.

### Exemple d'implémentation
Voici comment intégrer un bloc de compétence complet en utilisant une combinaison de composants d'action, de données et de typographie :

```tsx
import { Group, Stack } from '@mantine/core';
import { CcCard, CcTitle, CcCircleProgress, CcTag, CcButton } from '../components';

export function SkillModule() {
  return (
    <CcCard>
      <Group justify="space-between">
        <Stack gap={4}>
          <CcTitle order={2}>Développement Frontend</CcTitle>
          <Group gap="xs">
            <CcTag>React</CcTag>
            <CcTag>TypeScript</CcTag>
          </Group>
        </Stack>
        
        {/* Exemple d'affichage de data circulaire */}
        <CcCircleProgress value={80} label="80%" size={120}>
          MAÎTRISE
        </CcCircleProgress>
      </Group>

      {/* Composant d'action expansible */}
      <CcButton expandable variant="default-gradient">
        Consulter le détail du parcours
      </CcButton>
    </CcCard>
  );
}
```

---

## Le Storybook : Environnement de Développement

Le projet inclut un environnement de visualisation accessible sur la route `/storybook`. Contrairement à une documentation statique, cet espace permet de :

* **Isoler les composants** : Visualiser chaque catégorie (Action, Data, Typo) en dehors du contexte métier de l'application.
* **Tester les limites** : Observer le comportement des composants avec des labels longs, des valeurs de progression extrêmes (0% ou 100%) ou des états désactivés.
* **Validation Design** : S'assurer que le rendu de la police Montserrat et des dégradés coniques est identique aux spécifications Figma sur différentes tailles d'écran.

Il est recommandé de consulter le Storybook avant toute nouvelle implémentation pour comprendre les variations de *props* disponibles (tailles, graisses, variantes de couleurs).
