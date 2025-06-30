"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { exportData, importData, loadAppData, saveAppData } from "@/lib/storage"
import type { AppData, Character, Zone } from "@/lib/types"
import { Download, Edit, Map, Plus, Trash2, Upload, Users, Zap, CheckSquare, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { LanguageToggle } from "@/components/language-toggle"

// Liste étendue des ennemis de D&D
const basicDnDEnemies = [
  // Créatures faibles (CR 0-1/2)
  { name: "Gobelin", challenge: "CR 1/4", description: "Petit humanoïde chaotique mauvais", category: "Humanoïdes" },
  { name: "Kobold", challenge: "CR 1/8", description: "Petit humanoïde loyal mauvais", category: "Humanoïdes" },
  { name: "Bandit", challenge: "CR 1/8", description: "Humanoïde moyen chaotique mauvais", category: "Humanoïdes" },
  { name: "Cultiste", challenge: "CR 1/8", description: "Humanoïde moyen chaotique mauvais", category: "Humanoïdes" },
  { name: "Garde", challenge: "CR 1/8", description: "Humanoïde moyen loyal neutre", category: "Humanoïdes" },
  { name: "Orc", challenge: "CR 1/2", description: "Humanoïde moyen chaotique mauvais", category: "Humanoïdes" },
  { name: "Gnoll", challenge: "CR 1/2", description: "Humanoïde moyen chaotique mauvais", category: "Humanoïdes" },
  { name: "Hobgobelin", challenge: "CR 1/2", description: "Humanoïde moyen loyal mauvais", category: "Humanoïdes" },
  { name: "Duergar", challenge: "CR 1", description: "Humanoïde moyen loyal mauvais", category: "Humanoïdes" },
  { name: "Githyanki", challenge: "CR 3", description: "Humanoïde moyen loyal mauvais", category: "Humanoïdes" },

  // Morts-vivants
  { name: "Squelette", challenge: "CR 1/4", description: "Mort-vivant moyen loyal mauvais", category: "Morts-vivants" },
  { name: "Zombie", challenge: "CR 1/4", description: "Mort-vivant moyen neutre mauvais", category: "Morts-vivants" },
  { name: "Goule", challenge: "CR 1", description: "Mort-vivant moyen chaotique mauvais", category: "Morts-vivants" },
  { name: "Spectre", challenge: "CR 1", description: "Mort-vivant moyen chaotique mauvais", category: "Morts-vivants" },
  { name: "Wight", challenge: "CR 3", description: "Mort-vivant moyen neutre mauvais", category: "Morts-vivants" },
  { name: "Momie", challenge: "CR 3", description: "Mort-vivant moyen loyal mauvais", category: "Morts-vivants" },
  { name: "Banshee", challenge: "CR 4", description: "Mort-vivant moyen chaotique mauvais", category: "Morts-vivants" },
  { name: "Ombre", challenge: "CR 1/2", description: "Mort-vivant moyen chaotique mauvais", category: "Morts-vivants" },

  // Bêtes et animaux
  { name: "Loup", challenge: "CR 1/4", description: "Bête moyenne non alignée", category: "Bêtes" },
  { name: "Ours brun", challenge: "CR 1", description: "Grande bête non alignée", category: "Bêtes" },
  { name: "Ours-hibou", challenge: "CR 3", description: "Grande monstruosité non alignée", category: "Bêtes" },
  { name: "Araignée géante", challenge: "CR 1", description: "Grande bête non alignée", category: "Bêtes" },
  { name: "Loup sinistre", challenge: "CR 1/4", description: "Monstruosité moyenne neutre mauvaise", category: "Bêtes" },
  { name: "Sanglier", challenge: "CR 1/4", description: "Bête moyenne non alignée", category: "Bêtes" },
  { name: "Panthère", challenge: "CR 1/4", description: "Bête moyenne non alignée", category: "Bêtes" },

  // Lycanthropes
  { name: "Loup-garou", challenge: "CR 3", description: "Humanoïde moyen chaotique mauvais", category: "Lycanthropes" },
  { name: "Rat-garou", challenge: "CR 2", description: "Humanoïde moyen loyal mauvais", category: "Lycanthropes" },
  { name: "Sanglier-garou", challenge: "CR 4", description: "Humanoïde moyen neutre mauvais", category: "Lycanthropes" },
  { name: "Ours-garou", challenge: "CR 5", description: "Humanoïde moyen neutre", category: "Lycanthropes" },

  // Géants et grandes créatures
  { name: "Ogre", challenge: "CR 2", description: "Grand géant chaotique mauvais", category: "Géants" },
  { name: "Troll", challenge: "CR 5", description: "Grand géant chaotique mauvais", category: "Géants" },
  { name: "Minotaure", challenge: "CR 3", description: "Grande monstruosité chaotique mauvais", category: "Géants" },
  { name: "Géant des collines", challenge: "CR 5", description: "Géant énorme chaotique mauvais", category: "Géants" },
  { name: "Ettin", challenge: "CR 4", description: "Grand géant chaotique mauvais", category: "Géants" },

  // Démons et diables
  { name: "Diablotin", challenge: "CR 1", description: "Petit fiélon loyal mauvais", category: "Fiélons" },
  { name: "Quasit", challenge: "CR 1", description: "Petit fiélon chaotique mauvais", category: "Fiélons" },
  { name: "Barghest", challenge: "CR 4", description: "Grande fiélon neutre mauvaise", category: "Fiélons" },
  { name: "Succube", challenge: "CR 4", description: "Fiélon moyen neutre mauvais", category: "Fiélons" },

  // Dragons et drakes
  { name: "Pseudodragon", challenge: "CR 1/4", description: "Petit dragon neutre bon", category: "Dragons" },
  { name: "Drake de garde", challenge: "CR 2", description: "Dragon moyen non aligné", category: "Dragons" },
  { name: "Wyverne", challenge: "CR 6", description: "Grand dragon non aligné", category: "Dragons" },

  // Élémentaires
  { name: "Élémentaire du feu", challenge: "CR 5", description: "Grand élémentaire neutre", category: "Élémentaires" },
  { name: "Élémentaire de l'eau", challenge: "CR 5", description: "Grand élémentaire neutre", category: "Élémentaires" },
  { name: "Élémentaire de l'air", challenge: "CR 5", description: "Grand élémentaire neutre", category: "Élémentaires" },
  { name: "Élémentaire de terre", challenge: "CR 5", description: "Grand élémentaire neutre", category: "Élémentaires" },

  // Aberrations
  { name: "Bulezau", challenge: "CR 3", description: "Fiélon moyen chaotique mauvais", category: "Aberrations" },
  { name: "Chuul", challenge: "CR 4", description: "Grande aberration chaotique mauvaise", category: "Aberrations" },
  { name: "Otyugh", challenge: "CR 5", description: "Grande aberration neutre", category: "Aberrations" },

  // Constructs
  { name: "Golem de chair", challenge: "CR 5", description: "Construct moyen neutre", category: "Constructs" },
  { name: "Automate", challenge: "CR 1", description: "Construct moyen non aligné", category: "Constructs" },
  { name: "Garde animé", challenge: "CR 2", description: "Construct moyen non aligné", category: "Constructs" }
]

export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [data, setData] = useState<AppData>({ zones: [], characters: [] })
  const [showNewZoneDialog, setShowNewZoneDialog] = useState(false)
  const [showNewCharacterDialog, setShowNewCharacterDialog] = useState(false)
  const [showEditCharacterDialog, setShowEditCharacterDialog] = useState(false)
  const [showGenerateEnemiesDialog, setShowGenerateEnemiesDialog] = useState(false)
  const [selectedEnemies, setSelectedEnemies] = useState<Set<number>>(new Set())
  const [showDeleteCharactersDialog, setShowDeleteCharactersDialog] = useState(false)
  const [selectedCharactersToDelete, setSelectedCharactersToDelete] = useState<Set<string>>(new Set())
  const [duplicateWarning, setDuplicateWarning] = useState<string>("")
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [newZoneName, setNewZoneName] = useState("")
  const [newCharacterName, setNewCharacterName] = useState("")
  const [newCharacterType, setNewCharacterType] = useState<"player" | "ally" | "enemy">("player")
  const [newCharacterImageUrl, setNewCharacterImageUrl] = useState("")

  useEffect(() => {
    setData(loadAppData())
  }, [])

  // Fonction utilitaire pour vérifier les doublons
  const checkForDuplicate = (name: string, type: "player" | "ally" | "enemy") => {
    return data.characters.find(char => char.name === name && char.type === type)
  }

  // Fonction pour mettre à jour l'avertissement de doublon
  const updateDuplicateWarning = (name: string, type: "player" | "ally" | "enemy") => {
    const existing = checkForDuplicate(name.trim(), type)
    if (existing && name.trim()) {
      setDuplicateWarning(t('duplicateWarning', {
        name,
        type: t(type as any)
      }))
    } else {
      setDuplicateWarning("")
    }
  }

  // Fonction pour mettre à jour l'avertissement de doublon lors de l'édition (exclut le personnage en cours d'édition)
  const updateDuplicateWarningForEdit = (name: string, type: "player" | "ally" | "enemy", excludeId: string) => {
    const existing = data.characters.find(char => char.name === name.trim() && char.type === type && char.id !== excludeId)
    if (existing && name.trim()) {
      setDuplicateWarning(t('duplicateWarningMerge', {
        name,
        type: t(type as any)
      }))
    } else {
      setDuplicateWarning("")
    }
  }

  const createZone = () => {
    if (!newZoneName.trim()) return

    const newZone: Zone = {
      id: Date.now().toString(),
      name: newZoneName.trim(),
      gridSize: 50,
      gridColor: "#000000",
      gridOpacity: 0.3,
      backgroundColor: "#ffffff",
      backgroundImage: null,
      tokens: [],
      drawings: [],
    }

    const updatedData = {
      ...data,
      zones: [...data.zones, newZone],
    }

    setData(updatedData)
    saveAppData(updatedData)
    setNewZoneName("")
    setShowNewZoneDialog(false)
  }

  const createCharacter = () => {
    if (!newCharacterName.trim()) return

    const characterName = newCharacterName.trim()

    // Vérifier si un personnage avec le même nom et type existe déjà
    const existingCharacterIndex = data.characters.findIndex(
      char => char.name === characterName && char.type === newCharacterType
    )

    const updatedCharacters = [...data.characters]

    const characterData: Character = {
      id: existingCharacterIndex >= 0 ? updatedCharacters[existingCharacterIndex].id : Date.now().toString(),
      name: characterName,
      type: newCharacterType,
      imageUrl: newCharacterImageUrl.trim(),
    }

    if (existingCharacterIndex >= 0) {
      // Mettre à jour le personnage existant
      updatedCharacters[existingCharacterIndex] = characterData
    } else {
      // Ajouter nouveau personnage
      updatedCharacters.push(characterData)
    }

    const updatedData = {
      ...data,
      characters: updatedCharacters,
    }

    setData(updatedData)
    saveAppData(updatedData)
    setNewCharacterName("")
    setNewCharacterImageUrl("")
    setDuplicateWarning("")
    setShowNewCharacterDialog(false)
  }

  const openEditCharacterDialog = (character: Character) => {
    setEditingCharacter(character)
    setNewCharacterName(character.name)
    setNewCharacterType(character.type)
    setNewCharacterImageUrl(character.imageUrl)
    setDuplicateWarning("")
    setShowEditCharacterDialog(true)
  }

  const updateCharacter = () => {
    if (!editingCharacter || !newCharacterName.trim()) return

    const characterName = newCharacterName.trim()

    // Vérifier si un autre personnage avec le même nom et type existe déjà (excluant le personnage en cours d'édition)
    const existingCharacterIndex = data.characters.findIndex(
      char => char.name === characterName && char.type === newCharacterType && char.id !== editingCharacter.id
    )

    const updatedCharacters = [...data.characters]

    if (existingCharacterIndex >= 0) {
      // Fusionner avec le personnage existant (remplacer l'existant par les nouvelles données et supprimer l'ancien)
      const updatedCharacter: Character = {
        id: updatedCharacters[existingCharacterIndex].id, // Garder l'ID du personnage existant
        name: characterName,
        type: newCharacterType,
        imageUrl: newCharacterImageUrl.trim(),
      }

      // Remplacer le personnage existant et supprimer l'ancien personnage en cours d'édition
      updatedCharacters[existingCharacterIndex] = updatedCharacter
      const editingIndex = updatedCharacters.findIndex(char => char.id === editingCharacter.id)
      if (editingIndex >= 0) {
        updatedCharacters.splice(editingIndex, 1)
      }
    } else {
      // Mise à jour normale du personnage
      const updatedCharacter: Character = {
        ...editingCharacter,
        name: characterName,
        type: newCharacterType,
        imageUrl: newCharacterImageUrl.trim(),
      }

      const editingIndex = updatedCharacters.findIndex(char => char.id === editingCharacter.id)
      if (editingIndex >= 0) {
        updatedCharacters[editingIndex] = updatedCharacter
      }
    }

    const updatedData = {
      ...data,
      characters: updatedCharacters,
    }

    setData(updatedData)
    saveAppData(updatedData)
    setNewCharacterName("")
    setNewCharacterImageUrl("")
    setDuplicateWarning("")
    setEditingCharacter(null)
    setShowEditCharacterDialog(false)
  }

  const deleteZone = (zoneId: string) => {
    const updatedData = {
      ...data,
      zones: data.zones.filter((zone) => zone.id !== zoneId),
    }
    setData(updatedData)
    saveAppData(updatedData)
  }

  const deleteCharacter = (characterId: string) => {
    const updatedData = {
      ...data,
      characters: data.characters.filter((character) => character.id !== characterId),
    }
    setData(updatedData)
    saveAppData(updatedData)
  }

  const generateBasicEnemies = () => {
    const selectedEnemiesArray = Array.from(selectedEnemies).map(index => basicDnDEnemies[index])

    const newEnemies: Character[] = []
    const updatedCharacters = [...data.characters]

    selectedEnemiesArray.forEach((enemy, index) => {
      // Vérifier si un personnage avec le même nom et type existe déjà
      const existingCharacterIndex = updatedCharacters.findIndex(
        char => char.name === enemy.name && char.type === "enemy"
      )

      const characterData: Character = {
        id: existingCharacterIndex >= 0 ? updatedCharacters[existingCharacterIndex].id : `enemy_${Date.now()}_${index}`,
        name: enemy.name,
        type: "enemy" as const,
        imageUrl: "",
      }

      if (existingCharacterIndex >= 0) {
        // Mettre à jour le personnage existant
        updatedCharacters[existingCharacterIndex] = characterData
      } else {
        // Ajouter nouveau personnage
        updatedCharacters.push(characterData)
      }
    })

    const updatedData = {
      ...data,
      characters: updatedCharacters,
    }

    setData(updatedData)
    saveAppData(updatedData)
    setShowGenerateEnemiesDialog(false)
    setSelectedEnemies(new Set()) // Réinitialiser la sélection
  }

  const toggleEnemySelection = (index: number) => {
    const newSelected = new Set(selectedEnemies)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedEnemies(newSelected)
  }

  const selectAllEnemies = () => {
    setSelectedEnemies(new Set(Array.from({ length: basicDnDEnemies.length }, (_, i) => i)))
  }

  const deselectAllEnemies = () => {
    setSelectedEnemies(new Set())
  }

  const toggleCharacterSelection = (characterId: string) => {
    const newSelected = new Set(selectedCharactersToDelete)
    if (newSelected.has(characterId)) {
      newSelected.delete(characterId)
    } else {
      newSelected.add(characterId)
    }
    setSelectedCharactersToDelete(newSelected)
  }

  const selectAllCharacters = () => {
    setSelectedCharactersToDelete(new Set(data.characters.map(c => c.id)))
  }

  const deselectAllCharacters = () => {
    setSelectedCharactersToDelete(new Set())
  }

  const deleteSelectedCharacters = () => {
    const updatedData = {
      ...data,
      characters: data.characters.filter((character) => !selectedCharactersToDelete.has(character.id)),
    }
    setData(updatedData)
    saveAppData(updatedData)
    setShowDeleteCharactersDialog(false)
    setSelectedCharactersToDelete(new Set()) // Réinitialiser la sélection
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      importData(file, (importedData) => {
        setData(importedData)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-2">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              {t('import')}
            </Button>
            <input id="import-file" type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="zones" className="space-y-6">
          <TabsList>
            <TabsTrigger value="zones">{t('zones')}</TabsTrigger>
            <TabsTrigger value="characters">{t('characters')}</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('zones')}</h2>
              <Button onClick={() => setShowNewZoneDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('newZone')}
              </Button>
            </div>

            {data.zones.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Map className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noZones')}</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Create your first combat zone to get started with your tabletop sessions.
                  </p>
                  <Button onClick={() => setShowNewZoneDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('createZone')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.zones.map((zone) => (
                  <Card key={zone.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteZone(zone.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {zone.tokens.length} {t('tokens')} • {zone.drawings.length} drawings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => router.push(`/zone/${zone.id}`)}
                        >
                          {t('openZone')}
                        </Button>
                        <Button className="flex-1" onClick={() => router.push(`/zone/${zone.id}?edit=true`)}>
                          {t('edit')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('characters')}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => {
                  // Présélectionner tous les ennemis la première fois
                  if (selectedEnemies.size === 0) {
                    setSelectedEnemies(new Set(Array.from({ length: basicDnDEnemies.length }, (_, i) => i)))
                  }
                  setShowGenerateEnemiesDialog(true)
                }}>
                  <Zap className="w-4 h-4 mr-2" />
                  {t('generateEnemies')}
                </Button>
                {data.characters.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCharactersToDelete(new Set())
                      setShowDeleteCharactersDialog(true)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('deleteSelected')}
                  </Button>
                )}
                <Button onClick={() => {
                  setNewCharacterName("")
                  setNewCharacterImageUrl("")
                  setNewCharacterType("player")
                  setDuplicateWarning("")
                  setShowNewCharacterDialog(true)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('newCharacter')}
                </Button>
              </div>
            </div>

            {data.characters.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noCharacters')}</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Create characters to use as tokens in your combat zones.
                  </p>
                  <Button onClick={() => {
                    setNewCharacterName("")
                    setNewCharacterImageUrl("")
                    setNewCharacterType("player")
                    setDuplicateWarning("")
                    setShowNewCharacterDialog(true)
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('createCharacter')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Players Section */}
                {data.characters.filter(c => c.type === "player").length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <h3 className="text-lg font-semibold text-green-700">{t('player')}</h3>
                      <div className="flex-1 h-px bg-green-200"></div>
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {data.characters.filter(c => c.type === "player").length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {data.characters.filter(c => c.type === "player").map((character) => (
                        <Card key={character.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-green-500 bg-green-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                  {character.imageUrl ? (
                                    <img
                                      src={character.imageUrl || "/placeholder.svg"}
                                      alt={character.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    character.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <CardTitle className="text-base font-medium">{character.name}</CardTitle>
                                  <CardDescription className="text-xs text-green-600 font-medium">{t('player')}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openEditCharacterDialog(character)} className="h-8 w-8 p-0 hover:bg-green-100">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteCharacter(character.id)} className="h-8 w-8 p-0 hover:bg-red-100">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allies Section */}
                {data.characters.filter(c => c.type === "ally").length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <h3 className="text-lg font-semibold text-blue-700">{t('ally')}</h3>
                      <div className="flex-1 h-px bg-blue-200"></div>
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {data.characters.filter(c => c.type === "ally").length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {data.characters.filter(c => c.type === "ally").map((character) => (
                        <Card key={character.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                  {character.imageUrl ? (
                                    <img
                                      src={character.imageUrl || "/placeholder.svg"}
                                      alt={character.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    character.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <CardTitle className="text-base font-medium">{character.name}</CardTitle>
                                  <CardDescription className="text-xs text-blue-600 font-medium">{t('ally')}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openEditCharacterDialog(character)} className="h-8 w-8 p-0 hover:bg-blue-100">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteCharacter(character.id)} className="h-8 w-8 p-0 hover:bg-red-100">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enemies Section */}
                {data.characters.filter(c => c.type === "enemy").length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <h3 className="text-lg font-semibold text-red-700">Ennemis</h3>
                      <div className="flex-1 h-px bg-red-200"></div>
                      <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        {data.characters.filter(c => c.type === "enemy").length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {data.characters.filter(c => c.type === "enemy").map((character) => (
                        <Card key={character.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-red-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                  {character.imageUrl ? (
                                    <img
                                      src={character.imageUrl || "/placeholder.svg"}
                                      alt={character.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    character.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <CardTitle className="text-base font-medium">{character.name}</CardTitle>
                                  <CardDescription className="text-xs text-red-600 font-medium">{t('enemy')}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openEditCharacterDialog(character)} className="h-8 w-8 p-0 hover:bg-red-100">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteCharacter(character.id)} className="h-8 w-8 p-0 hover:bg-red-100">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* New Zone Dialog */}
      <Dialog open={showNewZoneDialog} onOpenChange={setShowNewZoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createZone')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zone-name">{t('zoneName')}</Label>
              <Input
                id="zone-name"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder={t('zoneName')}
                onKeyDown={(e) => e.key === "Enter" && createZone()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewZoneDialog(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={createZone} disabled={!newZoneName.trim()}>
                {t('createZone')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Character Dialog */}
      <Dialog open={showNewCharacterDialog} onOpenChange={setShowNewCharacterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createCharacter')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="character-name">{t('characterName')}</Label>
              <Input
                id="character-name"
                value={newCharacterName}
                onChange={(e) => {
                  setNewCharacterName(e.target.value)
                  updateDuplicateWarning(e.target.value, newCharacterType)
                }}
                placeholder={t('characterName')}
              />
            </div>
            <div>
              <Label htmlFor="character-type">{t('characterType')}</Label>
              <Select
                value={newCharacterType}
                onValueChange={(value: "player" | "ally" | "enemy") => {
                  setNewCharacterType(value)
                  updateDuplicateWarning(newCharacterName, value)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">{t('player')}</SelectItem>
                  <SelectItem value="ally">{t('ally')}</SelectItem>
                  <SelectItem value="enemy">{t('enemy')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {duplicateWarning && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-700">{duplicateWarning}</p>
              </div>
            )}
            <div>
              <Label htmlFor="character-image">{t('imageUrl')}</Label>
              <Input
                id="character-image"
                value={newCharacterImageUrl}
                onChange={(e) => setNewCharacterImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowNewCharacterDialog(false)
                setDuplicateWarning("")
              }}>
                {t('cancel')}
              </Button>
              <Button onClick={createCharacter} disabled={!newCharacterName.trim()}>
                {checkForDuplicate(newCharacterName.trim(), newCharacterType) ? t('update') : t('create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={showEditCharacterDialog} onOpenChange={setShowEditCharacterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editCharacter')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-character-name">Character Name</Label>
              <Input
                id="edit-character-name"
                value={newCharacterName}
                onChange={(e) => {
                  setNewCharacterName(e.target.value)
                  if (editingCharacter) {
                    updateDuplicateWarningForEdit(e.target.value, newCharacterType, editingCharacter.id)
                  }
                }}
                placeholder="Enter character name"
              />
            </div>
            <div>
              <Label htmlFor="edit-character-type">Character Type</Label>
              <Select
                value={newCharacterType}
                onValueChange={(value: "player" | "ally" | "enemy") => {
                  setNewCharacterType(value)
                  if (editingCharacter) {
                    updateDuplicateWarningForEdit(newCharacterName, value, editingCharacter.id)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Joueur</SelectItem>
                  <SelectItem value="ally">Allié</SelectItem>
                  <SelectItem value="enemy">Ennemi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {duplicateWarning && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-700">{duplicateWarning}</p>
              </div>
            )}
            <div>
              <Label htmlFor="edit-character-image">Image URL (optional)</Label>
              <Input
                id="edit-character-image"
                value={newCharacterImageUrl}
                onChange={(e) => setNewCharacterImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowEditCharacterDialog(false)
                setDuplicateWarning("")
              }}>
                Cancel
              </Button>
              <Button onClick={updateCharacter} disabled={!newCharacterName.trim()}>
                {editingCharacter && data.characters.find(char => char.name === newCharacterName.trim() && char.type === newCharacterType && char.id !== editingCharacter.id)
                  ? "Merge Characters"
                  : "Update Character"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Enemies Confirmation Dialog */}
      <Dialog open={showGenerateEnemiesDialog} onOpenChange={setShowGenerateEnemiesDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate D&D Enemies</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Select the enemies you want to add to your collection ({selectedEnemies.size} selected):
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllEnemies}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllEnemies}>
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Grouper les ennemis par catégorie */}
              {Array.from(new Set(basicDnDEnemies.map(enemy => enemy.category))).map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-700 border-b pb-1">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {basicDnDEnemies
                      .map((enemy, index) => ({ enemy, index }))
                      .filter(({ enemy }) => enemy.category === category)
                      .map(({ enemy, index }) => {
                        const isSelected = selectedEnemies.has(index)
                        const existingCharacter = data.characters.find(
                          char => char.name === enemy.name && char.type === "enemy"
                        )

                        return (
                          <div
                            key={index}
                            className={`flex items-center p-2 rounded-md border cursor-pointer transition-all ${isSelected
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            onClick={() => toggleEnemySelection(index)}
                          >
                            <div className="mr-3">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                  {enemy.name}
                                  {existingCharacter && (
                                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1 py-0.5 rounded">
                                      Update
                                    </span>
                                  )}
                                </span>
                                <span className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                  {enemy.challenge}
                                </span>
                              </div>
                              <p className={`text-xs mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                {enemy.description}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowGenerateEnemiesDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={generateBasicEnemies}
                disabled={selectedEnemies.size === 0}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate {selectedEnemies.size} Enemies
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Characters Confirmation Dialog */}
      <Dialog open={showDeleteCharactersDialog} onOpenChange={setShowDeleteCharactersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delete Characters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Select the characters you want to delete ({selectedCharactersToDelete.size} selected):
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllCharacters}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllCharacters}>
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Grouper les personnages par type */}
              {(["player", "ally", "enemy"] as const).map(type => {
                const charactersOfType = data.characters.filter(char => char.type === type)
                if (charactersOfType.length === 0) return null

                const typeLabels = {
                  player: "Joueurs",
                  ally: "Alliés",
                  enemy: "Ennemis"
                }

                const typeColors = {
                  player: "text-green-700 border-green-200",
                  ally: "text-blue-700 border-blue-200",
                  enemy: "text-red-700 border-red-200"
                }

                return (
                  <div key={type} className="space-y-2">
                    <h3 className={`font-medium text-sm ${typeColors[type]} border-b pb-1`}>
                      {typeLabels[type]} ({charactersOfType.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {charactersOfType.map((character) => {
                        const isSelected = selectedCharactersToDelete.has(character.id)

                        return (
                          <div
                            key={character.id}
                            className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${isSelected
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            onClick={() => toggleCharacterSelection(character.id)}
                          >
                            <div className="mr-3">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-red-600" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-1">
                              {character.imageUrl ? (
                                <img
                                  src={character.imageUrl}
                                  alt={character.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${character.type === "player" ? "bg-green-500" :
                                  character.type === "ally" ? "bg-blue-500" : "bg-red-500"
                                  }`}>
                                  {character.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1">
                                <span className={`font-medium text-sm ${isSelected ? 'text-red-900' : 'text-gray-900'}`}>
                                  {character.name}
                                </span>
                                <p className={`text-xs mt-1 capitalize ${isSelected ? 'text-red-700' : 'text-gray-600'}`}>
                                  {character.type === "player" ? "Joueur" :
                                    character.type === "ally" ? "Allié" : "Ennemi"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDeleteCharactersDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={deleteSelectedCharacters}
                disabled={selectedCharactersToDelete.size === 0}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedCharactersToDelete.size} Characters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language Toggle Button */}
      <LanguageToggle />
    </div>
  )
}
