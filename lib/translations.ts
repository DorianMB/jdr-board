import DrawingTool from "@/components/drawing-tool"

export const translations = {
    fr: {
        // Header
        title: "JDR Board",
        subtitle: "Gérez vos zones JDR et personnages",

        // Navigation
        zones: "Zones",
        characters: "Personnages",

        // Buttons
        newZone: "Nouvelle Zone",
        newCharacter: "Nouveau Personnage",
        edit: "Modifier",
        delete: "Supprimer",
        cancel: "Annuler",
        save: "Sauvegarder",
        create: "Créer",
        update: "Mettre à jour",
        export: "Exporter",
        import: "Importer",
        exit: "Quitter",

        // Character Types
        player: "Joueur",
        ally: "Allié",
        enemy: "Ennemi",

        // Character Management
        characterName: "Nom du personnage",
        characterType: "Type de personnage",
        imageUrl: "URL de l'image",
        createCharacter: "Créer un personnage",
        editCharacter: "Modifier le personnage",
        deleteCharacter: "Supprimer le personnage",
        deleteSelected: "Supprimer plusieurs personnages",
        generateEnemies: "Générer des ennemis",

        // Zone Management
        zoneName: "Nom de la zone",
        zoneWidth: "Largeur",
        zoneHeight: "Hauteur",
        backgroundColor: "Couleur de fond",
        createZone: "Créer une zone",
        editZone: "Modifier la zone",
        deleteZone: "Supprimer la zone",
        openZone: "Ouvrir la zone",

        // Warnings and Messages
        duplicateWarning: 'Un personnage "{name}" de type "{type}" existe déjà et sera mis à jour.',
        duplicateWarningMerge: 'Un personnage "{name}" de type "{type}" existe déjà et sera fusionné.',
        noZones: "Aucune zone créée",
        noCharacters: "Aucun personnage créé",

        // Tokens
        tokens: "tokens",
        addToken: "Ajouter un token",

        // Select All / Deselect All
        selectAll: "Tout sélectionner",
        deselectAll: "Tout désélectionner",

        // Enemy Generation
        selectEnemies: "Sélectionner les ennemis à générer",
        selectedCount: "{count} ennemis sélectionnés",
        generateEnemiesModalTitle: "Générer des ennemis D&D",
        generateEnemiesModalDescription: "Sélectionnez les ennemis à ajouter à votre collection ({count} sélectionné(s)) :",
        generateEnemiesModalLoading: "Chargement des monstres...",
        generateEnemiesModalValidation: "Générez {count} Ennemis",
        generateEnemiesModalCancel: "Annuler",

        // Delete Multiple Characters
        deleteMultipleCharactersModalTitle: "Supprimer plusieurs personnages",
        deleteMultipleCharactersModalDescription: "Sélectionnez les personnages à supprimer ({count} sélectionné(s)) :",
        deleteMultipleCharactersModalValidation: "Supprimer {count} Personnages",
        deleteMultipleCharactersModalCancel: "Annuler",

        // Categories
        humanoids: "Humanoïdes",
        undead: "Morts-vivants",
        beasts: "Bêtes",
        lycanthropes: "Lycanthropes",
        giants: "Géants",
        fiends: "Fiélons",
        dragons: "Dragons",
        elementals: "Élémentaires",
        aberrations: "Aberrations",

        // Status
        dead: "MORT",
        alive: "Vivant",

        // Actions
        markAsDead: "Marquer comme mort",
        markAsAlive: "Marquer comme vivant",
        removeToken: "Supprimer le token",

        // Drawing Tools
        brush: "Pinceau",
        eraser: "Gomme",

        // Grid
        showGrid: "Afficher la grille",
        hideGrid: "Masquer la grille",

        // Language
        language: "Langue",
        french: "Français",
        english: "English",

        // Zone Page
        loadingZone: "Chargement de la zone...",
        zoneNotFound: "Zone introuvable",
        zoneNotFoundMessage: "La zone demandée n'a pas pu être trouvée.",

        // Zone Editor
        createNewCharacter: "Créer un nouveau personnage",
        addTokensMessage: "Ajoutez des tokens pour les voir ici.",
        unsavedChanges: "Modifications non sauvegardées",
        unsavedChangesMessage: "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter sans sauvegarder ?",
        discardChanges: "Ignorer les modifications",
        keepEditing: "Continuer l'édition",
        searchCharacters: "Rechercher des personnages",
        searchByCharacterName: "Rechercher par nom de personnage...",
        filterByType: "Filtrer par type",
        all: "Tous",
        selectCharacter: "Sélectionner un personnage",
        found: "trouvé(s)",
        createNew: "Créer nouveau"
        ,
        // Create Character Form
        optional: "optionnel",
        preview: "Aperçu:",
        characterPreviewAlt: "Aperçu du personnage",
        creating: "Création..."
        ,
        // Monster Search
        monsterSearchPlaceholder: "Rechercher un monstre...",
        monsterSearchLoading: "Chargement...",
        monsterSearchNoResult: "Aucun monstre trouvé",
        monsterSearchName: "Nom",
        monsterSearchCR: "CR",
        monsterSearchType: "Type",
        monsterSearchSource: "Source",
        monsterSearchHP: "PV",
        monsterSearchError: "Erreur lors de la récupération des données",
        monsterSearchUnknownError: "Erreur inconnue",

        // Zone Editor Character Menu
        characterMenuTitle: "Personnages sur le plateau",
        characterMenuDead: "Mort",

        // Zone Editor Drawing Tools
        drawingToolsMenuTitle: "Outils de dessin",
        drawingToolsMenuBrush: "Pinceau",
        drawingToolsMenuEraser: "Gomme",
        drawingToolsMenuShapes: "Formes",
        drawingToolsMenuTool: "Outil",
        drawingToolsMenuBrushSize: "Taille du pinceau",
        drawingToolsMenuEraserSize: "Taille de la gomme",
        drawingToolsMenuBorderColor: "Couleur de la bordure",
        drawingToolsMenuBorderThickness: "Épaisseur de la bordure",
        drawingToolsMenuShapeType: "Type de forme",
        drawingToolsMenuFillShape: "Remplir la forme",
        drawingToolsMenuFillColor: "Couleur de remplissage",
        drawingToolsMenuShapeRectangle: "Rectangle",
        drawingToolsMenuShapeCircle: "Cercle",
        drawingToolsMenuShapeLine: "Ligne",
        drawingToolsMenuUndo: "Annuler la dernière action",
        drawingToolsMenuClear: "Supprimer tous les dessins",

        // Zone Settings
        zoneSettingsModalTitle: "Paramètres de la zone",
        zoneSettingsModalGridOpacity: "Opacité de la grille",
        zoneSettingsModalGridColor: "Couleur de la grille",
        zoneSettingsModalBackgroundColor: "Couleur de fond",
        zoneSettingsModalBackgroundImageUrl: "URL de l'image de fond",
        zoneSettingsModalBackgroundImageUrlPlaceholder: "Entrez l'URL de l'image de fond (optionnel)",
        zoneSettingsModalBackgroundImageRotation: "Rotation de l'image de fond",
    },
    en: {
        // Header
        title: "JDR Board",
        subtitle: "Manage your RPG zones and characters",

        // Navigation
        zones: "Zones",
        characters: "Characters",

        // Buttons
        newZone: "New Zone",
        newCharacter: "New Character",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        save: "Save",
        create: "Create",
        update: "Update",
        export: "Export",
        import: "Import",
        exit: "Exit",

        // Character Types
        player: "Player",
        ally: "Ally",
        enemy: "Enemy",

        // Character Management
        characterName: "Character name",
        characterType: "Character type",
        imageUrl: "Image URL",
        createCharacter: "Create character",
        editCharacter: "Edit character",
        deleteCharacter: "Delete character",
        deleteSelected: "Delete multiple characters",
        generateEnemies: "Generate enemies",

        // Zone Management
        zoneName: "Zone name",
        zoneWidth: "Width",
        zoneHeight: "Height",
        backgroundColor: "Background color",
        createZone: "Create zone",
        editZone: "Edit zone",
        deleteZone: "Delete zone",
        openZone: "Open zone",

        // Warnings and Messages
        duplicateWarning: 'A character "{name}" of type "{type}" already exists and will be updated.',
        duplicateWarningMerge: 'A character "{name}" of type "{type}" already exists and will be merged.',
        noZones: "No zones created",
        noCharacters: "No characters created",

        // Tokens
        tokens: "tokens",
        addToken: "Add token",

        // Select All / Deselect All
        selectAll: "Select All",
        deselectAll: "Deselect All",

        // Enemy Generation
        selectEnemies: "Select enemies to generate",
        selectedCount: "{count} enemies selected",
        generateEnemiesModalTitle: "Generate D&D Enemies",
        generateEnemiesModalDescription: "Select the enemies you want to add to your collection ({count} selected):",
        generateEnemiesModalLoading: "Loading monsters...",
        generateEnemiesModalValidation: "Generate {count} Enemies",
        generateEnemiesModalCancel: "Cancel",

        // Delete Multiple Characters
        deleteMultipleCharactersModalTitle: "Delete Multiple Characters",
        deleteMultipleCharactersModalDescription: "Select the characters to delete ({count} selected):",
        deleteMultipleCharactersModalValidation: "Delete {count} Characters",
        deleteMultipleCharactersModalCancel: "Cancel",

        // Categories
        humanoids: "Humanoids",
        undead: "Undead",
        beasts: "Beasts",
        lycanthropes: "Lycanthropes",
        giants: "Giants",
        fiends: "Fiends",
        dragons: "Dragons",
        elementals: "Elementals",
        aberrations: "Aberrations",

        // Status
        dead: "DEAD",
        alive: "Alive",

        // Actions
        markAsDead: "Mark as dead",
        markAsAlive: "Mark as alive",
        removeToken: "Remove token",

        // Drawing Tools
        brush: "Brush",
        eraser: "Eraser",

        // Grid
        showGrid: "Show grid",
        hideGrid: "Hide grid",

        // Language
        language: "Language",
        french: "Français",
        english: "English",

        // Zone Page
        loadingZone: "Loading zone...",
        zoneNotFound: "Zone not found",
        zoneNotFoundMessage: "The requested zone could not be found.",

        // Zone Editor
        createNewCharacter: "Create new character",
        addTokensMessage: "Add tokens to see them here.",
        unsavedChanges: "Unsaved changes",
        unsavedChangesMessage: "You have unsaved changes. Do you really want to leave without saving?",
        discardChanges: "Discard changes",
        keepEditing: "Keep editing",
        searchCharacters: "Search Characters",
        searchByCharacterName: "Search by character name...",
        filterByType: "Filter by Type",
        all: "All",
        selectCharacter: "Select a character",
        found: "found",
        createNew: "Create new"
        ,
        // Create Character Form
        optional: "optional",
        preview: "Preview:",
        characterPreviewAlt: "Character preview",
        creating: "Creating..."
        ,
        // Monster Search
        monsterSearchPlaceholder: "Search a monster...",
        monsterSearchLoading: "Loading...",
        monsterSearchNoResult: "No monster found",
        monsterSearchName: "Name",
        monsterSearchCR: "CR",
        monsterSearchType: "Type",
        monsterSearchSource: "Source",
        monsterSearchHP: "HP",
        monsterSearchError: "Error while fetching data",
        monsterSearchUnknownError: "Unknown error",

        // Zone Editor Character Menu
        characterMenuTitle: "Characters on the board",
        characterMenuDead: "Dead",

        // Zone Editor Drawing Tools
        drawingToolsMenuTitle: "Drawing Tools",
        drawingToolsMenuBrush: "Brush",
        drawingToolsMenuEraser: "Eraser",
        drawingToolsMenuShapes: "Shapes",
        drawingToolsMenuTool: "Tool",
        drawingToolsMenuBrushSize: "Brush Size",
        drawingToolsMenuEraserSize: "Eraser Size",
        drawingToolsMenuBorderColor: "Border Color",
        drawingToolsMenuBorderThickness: "Border Thickness",
        drawingToolsMenuShapeType: "Shape Type",
        drawingToolsMenuFillShape: "Fill Shape",
        drawingToolsMenuFillColor: "Fill Color",
        drawingToolsMenuShapeRectangle: "Rectangle",
        drawingToolsMenuShapeCircle: "Circle",
        drawingToolsMenuShapeLine: "Line",
        drawingToolsMenuUndo: "Undo Last Action",
        drawingToolsMenuClear: "Clear All Drawings",

        // Zone Settings
        zoneSettingsModalTitle: "Zone Settings",
        zoneSettingsModalGridOpacity: "Grid Opacity",
        zoneSettingsModalGridColor: "Grid Color",
        zoneSettingsModalBackgroundColor: "Background Color",
        zoneSettingsModalBackgroundImageUrl: "Background Image URL",
        zoneSettingsModalBackgroundImageUrlPlaceholder: "Enter the background image URL (optional)",
        zoneSettingsModalBackgroundImageRotation: "Background Image Rotation",
    }
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.fr
