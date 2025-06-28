"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Eye, Plus, Download, Upload, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Zone, Character } from "@/lib/types"
import { loadAppData, saveAppData, exportData, importData } from "@/lib/storage"

export default function HomePage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [showNewZoneDialog, setShowNewZoneDialog] = useState(false)
  const [showNewCharacterDialog, setShowNewCharacterDialog] = useState(false)
  const [newZoneName, setNewZoneName] = useState("")
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    type: "player",
    imageUrl: "",
  })
  const router = useRouter()

  useEffect(() => {
    const data = loadAppData()
    setZones(data.zones)
    setCharacters(data.characters)
  }, [])

  const createZone = () => {
    if (!newZoneName.trim()) return

    const newZone: Zone = {
      id: Date.now().toString(),
      name: newZoneName,
      gridSize: 50,
      gridColor: "#000000",
      gridOpacity: 0.3,
      backgroundColor: "#ffffff",
      backgroundImage: null,
      tokens: [],
      drawings: [],
    }

    const updatedZones = [...zones, newZone]
    setZones(updatedZones)
    saveAppData({ zones: updatedZones, characters })
    setNewZoneName("")
    setShowNewZoneDialog(false)
  }

  const deleteZone = (id: string) => {
    const updatedZones = zones.filter((zone) => zone.id !== id)
    setZones(updatedZones)
    saveAppData({ zones: updatedZones, characters })
  }

  const createCharacter = () => {
    if (!newCharacter.name?.trim()) return

    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name,
      type: newCharacter.type as "player" | "ally" | "enemy",
      imageUrl: newCharacter.imageUrl || "",
    }

    const updatedCharacters = [...characters, character]
    setCharacters(updatedCharacters)
    saveAppData({ zones, characters: updatedCharacters })
    setNewCharacter({ name: "", type: "player", imageUrl: "" })
    setShowNewCharacterDialog(false)
  }

  const deleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter((char) => char.id !== id)
    setCharacters(updatedCharacters)
    saveAppData({ zones, characters: updatedCharacters })
  }

  const handleExport = () => {
    exportData()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      importData(file, (data) => {
        setZones(data.zones)
        setCharacters(data.characters)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Virtual Tabletop</h1>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </span>
              </Button>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Zones Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Combat Zones</h2>
              <Dialog open={showNewZoneDialog} onOpenChange={setShowNewZoneDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Zone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Zone</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="zoneName">Zone Name</Label>
                      <Input
                        id="zoneName"
                        value={newZoneName}
                        onChange={(e) => setNewZoneName(e.target.value)}
                        placeholder="Enter zone name"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewZoneDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createZone}>Create Zone</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {zones.map((zone) => (
                <Card key={zone.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{zone.name}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/zone/${zone.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => router.push(`/zone/${zone.id}?edit=true`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteZone(zone.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {zones.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No zones created yet. Create your first zone to get started!
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Characters Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Characters</h2>
              <Dialog open={showNewCharacterDialog} onOpenChange={setShowNewCharacterDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    New Character
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Character</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="charName">Character Name</Label>
                      <Input
                        id="charName"
                        value={newCharacter.name || ""}
                        onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                        placeholder="Enter character name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="charType">Type</Label>
                      <Select
                        value={newCharacter.type}
                        onValueChange={(value) => setNewCharacter({ ...newCharacter, type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="player">Player</SelectItem>
                          <SelectItem value="ally">Ally</SelectItem>
                          <SelectItem value="enemy">Enemy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="charImage">Image URL (optional)</Label>
                      <Input
                        id="charImage"
                        value={newCharacter.imageUrl || ""}
                        onChange={(e) => setNewCharacter({ ...newCharacter, imageUrl: e.target.value })}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewCharacterDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createCharacter}>Create Character</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {characters.map((character) => (
                <Card key={character.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            character.type === "player"
                              ? "border-green-500 bg-green-100 text-green-700"
                              : character.type === "ally"
                                ? "border-blue-500 bg-blue-100 text-blue-700"
                                : "border-red-500 bg-red-100 text-red-700"
                          }`}
                        >
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
                          <h3 className="font-medium">{character.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{character.type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => deleteCharacter(character.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {characters.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No characters created yet. Add characters to use in your zones!
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
