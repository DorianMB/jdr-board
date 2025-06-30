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
import { Download, Edit, Map, Plus, Trash2, Upload, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [data, setData] = useState<AppData>({ zones: [], characters: [] })
  const [showNewZoneDialog, setShowNewZoneDialog] = useState(false)
  const [showNewCharacterDialog, setShowNewCharacterDialog] = useState(false)
  const [showEditCharacterDialog, setShowEditCharacterDialog] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [newZoneName, setNewZoneName] = useState("")
  const [newCharacterName, setNewCharacterName] = useState("")
  const [newCharacterType, setNewCharacterType] = useState<"player" | "ally" | "enemy">("player")
  const [newCharacterImageUrl, setNewCharacterImageUrl] = useState("")

  useEffect(() => {
    setData(loadAppData())
  }, [])

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

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: newCharacterName.trim(),
      type: newCharacterType,
      imageUrl: newCharacterImageUrl.trim(),
    }

    const updatedData = {
      ...data,
      characters: [...data.characters, newCharacter],
    }

    setData(updatedData)
    saveAppData(updatedData)
    setNewCharacterName("")
    setNewCharacterImageUrl("")
    setShowNewCharacterDialog(false)
  }

  const openEditCharacterDialog = (character: Character) => {
    setEditingCharacter(character)
    setNewCharacterName(character.name)
    setNewCharacterType(character.type)
    setNewCharacterImageUrl(character.imageUrl)
    setShowEditCharacterDialog(true)
  }

  const updateCharacter = () => {
    if (!editingCharacter || !newCharacterName.trim()) return

    const updatedCharacter: Character = {
      ...editingCharacter,
      name: newCharacterName.trim(),
      type: newCharacterType,
      imageUrl: newCharacterImageUrl.trim(),
    }

    const updatedData = {
      ...data,
      characters: data.characters.map((character) =>
        character.id === editingCharacter.id ? updatedCharacter : character,
      ),
    }

    setData(updatedData)
    saveAppData(updatedData)
    setNewCharacterName("")
    setNewCharacterImageUrl("")
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
            <h1 className="text-3xl font-bold text-gray-900">JDR Board</h1>
            <p className="text-gray-600 mt-2">Manage your RPG zones and characters</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input id="import-file" type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="zones" className="space-y-6">
          <TabsList>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Combat Zones</h2>
              <Button onClick={() => setShowNewZoneDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Zone
              </Button>
            </div>

            {data.zones.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Map className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No zones yet</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Create your first combat zone to get started with your tabletop sessions.
                  </p>
                  <Button onClick={() => setShowNewZoneDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Zone
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
                        {zone.tokens.length} tokens • {zone.drawings.length} drawings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => router.push(`/zone/${zone.id}`)}
                        >
                          View
                        </Button>
                        <Button className="flex-1" onClick={() => router.push(`/zone/${zone.id}?edit=true`)}>
                          Edit
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
              <h2 className="text-xl font-semibold">Characters</h2>
              <Button onClick={() => setShowNewCharacterDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Character
              </Button>
            </div>

            {data.characters.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No characters yet</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Create characters to use as tokens in your combat zones.
                  </p>
                  <Button onClick={() => setShowNewCharacterDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Character
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.characters.map((character) => (
                  <Card key={character.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold ${character.type === "player"
                              ? "border-green-500 bg-green-600"
                              : character.type === "ally"
                                ? "border-blue-500 bg-blue-600"
                                : "border-red-500 bg-red-600"
                              }`}
                          >
                            {character.imageUrl ? (
                              <img
                                src={character.imageUrl || "/placeholder.svg"}
                                alt={character.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              /^[a-zA-Z]/.test(character.name)
                                ? character.name.charAt(0).toUpperCase() + character.name.replace(/\D/g, "")
                                : character.name.replace(/\D/g, "")
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{character.name}</CardTitle>
                            <CardDescription className="capitalize">{character.type}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditCharacterDialog(character)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteCharacter(character.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* New Zone Dialog */}
      <Dialog open={showNewZoneDialog} onOpenChange={setShowNewZoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Zone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zone-name">Zone Name</Label>
              <Input
                id="zone-name"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Enter zone name"
                onKeyDown={(e) => e.key === "Enter" && createZone()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewZoneDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createZone} disabled={!newZoneName.trim()}>
                Create Zone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Character Dialog */}
      <Dialog open={showNewCharacterDialog} onOpenChange={setShowNewCharacterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Character</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="character-name">Character Name</Label>
              <Input
                id="character-name"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                placeholder="Enter character name"
              />
            </div>
            <div>
              <Label htmlFor="character-type">Character Type</Label>
              <Select
                value={newCharacterType}
                onValueChange={(value: "player" | "ally" | "enemy") => setNewCharacterType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="ally">Ally</SelectItem>
                  <SelectItem value="enemy">Enemy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="character-image">Image URL (optional)</Label>
              <Input
                id="character-image"
                value={newCharacterImageUrl}
                onChange={(e) => setNewCharacterImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCharacterDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createCharacter} disabled={!newCharacterName.trim()}>
                Create Character
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={showEditCharacterDialog} onOpenChange={setShowEditCharacterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-character-name">Character Name</Label>
              <Input
                id="edit-character-name"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                placeholder="Enter character name"
              />
            </div>
            <div>
              <Label htmlFor="edit-character-type">Character Type</Label>
              <Select
                value={newCharacterType}
                onValueChange={(value: "player" | "ally" | "enemy") => setNewCharacterType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="ally">Ally</SelectItem>
                  <SelectItem value="enemy">Enemy</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Button variant="outline" onClick={() => setShowEditCharacterDialog(false)}>
                Cancel
              </Button>
              <Button onClick={updateCharacter} disabled={!newCharacterName.trim()}>
                Update Character
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
