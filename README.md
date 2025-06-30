# JDR-BOARD

*Application web moderne pour les jeux de rôle sur table*

![Last Commit](https://img.shields.io/github/last-commit/DorianMB/jdr-board?label=last%20commit&color=blue&style=flat)
![TypeScript](https://img.shields.io/badge/typescript-97.8%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)

## Technologies utilisées

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=flat&logo=radixui&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide-F56565?style=flat&logo=lucide&logoColor=white)

---

## 📋 Description

JDR-Board est une application web moderne et complète dédiée aux jeux de rôle sur table (JDR). Elle offre un environnement collaboratif permettant aux maîtres de jeu et aux joueurs de créer, gérer et partager leurs aventures avec des outils interactifs avancés.

### ✨ Fonctionnalités principales

#### 🗺️ **Gestion de zones de combat**
- Création et modification de cartes interactives
- Grille personnalisable (taille, couleur, opacité)
- Arrière-plans personnalisés (couleur unie ou image)
- Rotation, redimensionnement et positionnement d'images
- Zoom et navigation fluides (souris et tactile)
- Mode navigation dédié pour mobiles

#### 🎨 **Outils de dessin avancés**
- **Pinceau** : Dessin à main levée avec épaisseur réglable
- **Gomme** : Effacement précis avec taille variable
- **Formes géométriques** : Rectangles, cercles et lignes
- Couleurs personnalisables pour contours et remplissage
- Historique avec annulation/rétablissement (Ctrl+Z/Y)
- Superposition transparente sur la carte

#### 👤 **Système de personnages et tokens**
- Création de personnages avec images personnalisées
- Types : Joueurs (verts), Alliés (bleus), Ennemis (rouges)
- Placement et déplacement par glisser-déposer
- Accrochage automatique à la grille
- Gestion des états (vivant/mort) avec indicateurs visuels
- Numérotation automatique des tokens multiples
- Générateur d'ennemis D&D intégré (40+ créatures)

#### 🎯 **Interface utilisateur intuitive**
- Menus latéraux coulissants et contextuels
- Barres d'outils flottantes et repliables
- Recherche et filtrage de personnages par type
- Raccourcis clavier (Ctrl+S pour sauvegarder)
- Mode plein écran avec masquage de l'interface
- Support multilingue (Français/Anglais)

#### 💾 **Gestion des données**
- Sauvegarde automatique en temps réel
- Import/Export de données au format JSON
- Stockage local dans le navigateur
- Gestion des conflits et doublons
- Détection des modifications non sauvegardées

---

## 🚀 Installation

### Prérequis

Assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) ou un autre gestionnaire de paquets

### Installation locale

1. **Clonez le repository**
   ```bash
   git clone https://github.com/DorianMB/jdr-board.git
   cd jdr-board
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur**
   
   Rendez-vous sur [http://localhost:3000](http://localhost:3000) pour voir l'application.

---

## 🎮 Guide d'utilisation

### Démarrage rapide

1. **Page d'accueil** : Gérez vos zones et personnages depuis l'interface principale
2. **Créez une zone** : Utilisez l'onglet "Zones" pour créer votre première carte
3. **Ajoutez des personnages** : Créez des fiches dans l'onglet "Personnages"
4. **Ouvrez une zone** : Cliquez sur "Ouvrir" ou "Modifier" pour accéder à l'éditeur

### 🎯 Interface principale

#### Navigation par onglets
- **Zones** : Gestion des cartes de combat
- **Personnages** : Création et édition des personnages

#### Fonctionnalités avancées
- **Import/Export** : Sauvegardez et partagez vos données
- **Générateur d'ennemis** : Créez rapidement des adversaires D&D
- **Suppression en lot** : Gérez plusieurs personnages simultanément

### 🗺️ Éditeur de zones

#### Navigation et zoom
- **Zoom** : Molette de souris ou boutons +/-
- **Déplacement** : Clic-milieu + glisser ou mode navigation mobile
- **Raccourcis** : Espace + clic pour déplacer la vue

#### Configuration de la grille
- Accédez aux **Paramètres** depuis la barre d'outils
- Ajustez la **taille**, **couleur** et **opacité** de la grille
- Configurez l'**arrière-plan** (couleur ou image URL)

#### Gestion de l'arrière-plan
- **Images** : Ajoutez des cartes via URL
- **Manipulation** : Glissez, redimensionnez et faites pivoter les images
- **Rotation** : Boutons de rotation par incréments de 90°

### 🎨 Outils de dessin

#### Modes de dessin
1. **Pinceau** : Dessin libre à main levée
2. **Gomme** : Effacement précis avec taille variable
3. **Formes** : Rectangles, cercles et lignes droites

#### Paramètres avancés
- **Couleurs** : Personnalisez contours et remplissage
- **Épaisseur** : Ajustez la taille du pinceau/gomme (1-20px)
- **Remplissage** : Activez pour les formes géométriques

#### Gestion des dessins
- **Annuler/Rétablir** : Ctrl+Z et Ctrl+Y
- **Effacer tout** : Bouton de suppression totale
- **Historique** : Conserve 50 actions

### 👤 Système de tokens

#### Ajout de personnages
1. Cliquez sur **"Ajouter Token"**
2. **Recherchez** ou **filtrez** les personnages par type
3. **Sélectionnez** et validez pour placer sur la grille

#### Types de personnages
- **🟢 Joueurs** : Personnages contrôlés par les joueurs
- **🔵 Alliés** : PNJ amicaux et compagnons
- **🔴 Ennemis** : Adversaires et créatures hostiles

#### Gestion des tokens
- **Déplacement** : Glisser-déposer avec accrochage à la grille
- **États** : Marquer comme mort/vivant avec indicateurs visuels
- **Numérotation** : Gestion automatique des doublons (Gobelin 1, 2, 3...)
- **Informations** : Survol pour voir les détails du personnage

### 📱 Optimisations mobiles

#### Mode navigation (mobiles/tablettes)
- **Activation** : Bouton "Nav/Edit" sur petits écrans
- **Gestes** : 1 doigt pour déplacer, 2 doigts pour zoomer
- **Indicateur** : Notification visible du mode actuel

#### Interface adaptative
- **Menus** : Conversion en overlays plein écran
- **Boutons** : Tailles optimisées pour le tactile
- **Zones de clic** : Élargies pour une meilleure précision

---

## 🛠️ Développement

### Scripts disponibles

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Compile l'application pour la production
npm run start    # Lance l'application en mode production
npm run lint     # Vérifie la qualité du code
```

### Structure du projet

```
jdr-board/
├── app/                    # Pages et layouts Next.js App Router
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── zone/[id]/         # Pages dynamiques des zones
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI (Radix + Tailwind)
│   ├── zone-editor.tsx   # Éditeur principal de zones
│   ├── drawing-tool.tsx  # Outils de dessin
│   ├── token.tsx         # Composant des tokens
│   └── ...
├── hooks/                # Hooks React personnalisés
│   ├── use-language.tsx  # Gestion multilingue
│   └── use-mobile.tsx    # Détection mobile
├── lib/                  # Utilitaires et configuration
│   ├── types.ts          # Types TypeScript
│   ├── storage.ts        # Gestion du stockage local
│   ├── translations.ts   # Fichiers de traduction
│   └── utils.ts          # Fonctions utilitaires
└── public/               # Assets statiques
```

### Technologies du stack

#### Frontend & Framework
- **[Next.js 15](https://nextjs.org/)** : Framework React avec App Router
- **[React 19](https://reactjs.org/)** : Bibliothèque UI avec les dernières fonctionnalités
- **[TypeScript](https://www.typescriptlang.org/)** : Typage statique pour JavaScript

#### Interface utilisateur
- **[Tailwind CSS](https://tailwindcss.com/)** : Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** : Composants accessibles et personnalisables
- **[Lucide React](https://lucide.dev/)** : Icônes SVG optimisées
- **[Class Variance Authority](https://cva.style/)** : Gestion des variantes de composants

#### Gestion d'état et données
- **React Hooks** : État local avec useState, useEffect, useCallback
- **Local Storage** : Persistance des données côté client
- **Context API** : Partage d'état global (langues, thèmes)

#### Fonctionnalités avancées
- **Canvas API** : Rendu des outils de dessin
- **Drag & Drop** : Manipulation des tokens et images
- **Touch Events** : Support tactile pour mobiles/tablettes
- **File API** : Import/export de données JSON

### Architecture des composants

#### Composants principaux
- **`ZoneEditor`** : Éditeur principal avec gestion des layers
- **`DrawingTool`** : Canvas de dessin avec modes brush/eraser/shapes
- **`TokenComponent`** : Représentation draggable des personnages
- **`GridOverlay`** : Grille superposée avec CSS Grid

#### Patterns utilisés
- **Compound Components** : Composants UI modulaires (Dialog, Select...)
- **Render Props** : Partage de logique entre composants
- **Custom Hooks** : Extraction de logique réutilisable
- **Event Delegation** : Gestion optimisée des événements

### Gestion des données

#### Types principaux
```typescript
interface Zone {
  id: string
  name: string
  gridSize: number
  gridColor: string
  gridOpacity: number
  backgroundColor: string
  backgroundImage: BackgroundImage | null
  tokens: Token[]
  drawings: Drawing[]
}

interface Character {
  id: string
  name: string
  type: "player" | "ally" | "enemy"
  imageUrl: string
}

interface Token {
  id: string
  characterId: string
  x: number
  y: number
  gridX: number
  gridY: number
  isDead?: boolean
}
```

#### Stockage local
- **Auto-sauvegarde** : Toutes les 2 secondes d'inactivité
- **Historique** : 50 états conservés pour undo/redo
- **Import/Export** : Format JSON standardisé
- **Gestion des conflits** : Détection et fusion des doublons

---

## 🔧 Raccourcis clavier

### Navigation globale
- `Ctrl/Cmd + S` : Sauvegarder la zone
- `Ctrl/Cmd + Z` : Annuler la dernière action
- `Ctrl/Cmd + Y` ou `Ctrl/Cmd + Shift + Z` : Rétablir

### Navigation dans l'éditeur
- `Molette souris` : Zoomer/dézoomer
- `Clic milieu + glisser` : Déplacer la vue
- `Espace + clic` : Mode déplacement temporaire

### Outils de dessin
- Clic gauche : Dessiner/placer forme
- Maintenir + glisser : Dessiner en continu
- `Échap` : Désactiver l'outil actuel

---

## 📊 Fonctionnalités détaillées

### Générateur d'ennemis D&D

L'application inclut une base de données de **40+ créatures** organisées par catégories :

- **Humanoïdes** : Gobelins, Orcs, Hobgobelins, Gnolls...
- **Morts-vivants** : Squelettes, Zombies, Goules, Spectres...
- **Bêtes** : Loups, Ours, Araignées géantes...
- **Lycanthropes** : Loups-garous, Ours-garous...
- **Géants** : Géants des collines, des pierres...
- **Fiélons** : Diables, Démons...
- **Dragons** : Jeunes dragons colorés...
- **Et plus encore...**

Chaque créature inclut :
- **Nom** et **Type**
- **Challenge Rating (CR)**
- **Description** complète
- **Détection automatique** des doublons

### Système de coordonnées

#### Grille intelligente
- **Accrochage automatique** : Les tokens se placent au centre des cases
- **Coordonnées multiples** : Pixels (x, y) et grille (gridX, gridY)
- **Taille personnalisable** : De 20px à 100px par case
- **Affichage conditionnel** : Masquage possible de la grille

#### Positionnement précis
- **Transformations** : Support des zooms et déplacements
- **Calcul de collision** : Évitement des superpositions
- **Conversion d'espaces** : Écran ↔ Grille ↔ Canvas

### Gestion des états

#### Tokens et personnages
- **États persistants** : Mort/vivant sauvegardé
- **Indicateurs visuels** : Grayscale + opacité pour les morts
- **Numérotation dynamique** : Recalcul automatique lors des ajouts/suppressions
- **Types colorés** : Vert (joueur), Bleu (allié), Rouge (ennemi)

#### Interface utilisateur
- **Masquage complet** : Mode plein écran pour présentation
- **Menus contextuels** : Ouverture/fermeture fluide
- **États de focus** : Highlighting des éléments actifs
- **Feedback visuel** : Animations et transitions

### Optimisations techniques

#### Performance
- **Debouncing** : Sauvegarde automatique optimisée
- **Event delegation** : Gestion efficace des événements
- **Lazy loading** : Chargement conditionnel des composants
- **Memoization** : Optimisation des re-rendus React

#### Stockage et données
- **Compression** : Structure JSON optimisée
- **Versioning** : Gestion des migrations de données
- **Validation** : Vérification des types à l'import
- **Récupération** : Gestion des erreurs de stockage

#### Compatibilité
- **Cross-browser** : Support des navigateurs modernes
- **Progressive Enhancement** : Fonctionnalités dégradées gracieusement
- **Touch-first** : Optimisation prioritaire pour le tactile
- **Responsive Design** : Adaptation fluide aux écrans

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines de développement

- Respectez la structure de fichiers existante
- Utilisez TypeScript pour le typage strict
- Suivez les conventions de nommage (camelCase, PascalCase)
- Ajoutez des commentaires pour les fonctions complexes
- Testez sur mobile et desktop

---

## 🚀 Roadmap

Le projet est actuellement en phase de stabilisation et d'amélioration continue. 

Des fonctionnalités supplémentaires sont en cours de réflexion, mais aucune roadmap officielle n'est définie pour le moment. Les retours de la communauté sont les bienvenus pour orienter les futures évolutions.

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📧 Contact

- **Issues** : [GitHub Issues](https://github.com/DorianMB/jdr-board/issues)
- **Discussions** : [GitHub Discussions](https://github.com/DorianMB/jdr-board/discussions)

---

## 🙏 Remerciements

- **[Radix UI](https://www.radix-ui.com/)** pour les composants accessibles
- **[Lucide](https://lucide.dev/)** pour les icônes élégantes
- **[Tailwind CSS](https://tailwindcss.com/)** pour le système de design
- **[Next.js](https://nextjs.org/)** pour le framework robuste
- **Communauté JDR** pour l'inspiration et les retours

---

<div align="center">

**Fait avec ❤️ pour la communauté JDR**

![JDR Board Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=JDR+Board+-+Your+Digital+Tabletop)

*Transformez vos sessions de jeu de rôle avec un outil moderne et intuitif*

[![GitHub stars](https://img.shields.io/github/stars/DorianMB/jdr-board?style=social)](https://github.com/DorianMB/jdr-board/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DorianMB/jdr-board?style=social)](https://github.com/DorianMB/jdr-board/network/members)

</div>
