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
        deleteSelected: "Supprimer la sélection",
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

        // Enemy Generation
        selectEnemies: "Sélectionner les ennemis à générer",
        selectedCount: "{count} ennemis sélectionnés",

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
        deleteSelected: "Delete selected",
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

        // Enemy Generation
        selectEnemies: "Select enemies to generate",
        selectedCount: "{count} enemies selected",

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
    }
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.fr
