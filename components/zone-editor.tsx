"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { loadAppData, saveAppData } from "@/lib/storage"
import type { Character, Drawing, HistoryState, Token, Zone } from "@/lib/types"
import {
  Brush,
  Check,
  CheckCircle,
  Edit,
  Eraser,
  EyeOff,
  Home,
  Palette,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  Settings,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import DrawingTool from "./drawing-tool"
import GridOverlay from "./grid-overlay"
import TokenComponent from "./token"

interface ZoneEditorProps {
  zone: Zone
  editMode: boolean
}

export default function ZoneEditor({ zone: initialZone, editMode }: ZoneEditorProps) {
  // Ensure zone is properly initialized with defaults
  const [zone, setZone] = useState<Zone>(() => ({
    id: initialZone?.id || "",
    name: initialZone?.name || "Untitled Zone",
    gridSize: initialZone?.gridSize || 50,
    gridColor: initialZone?.gridColor || "#000000",
    gridOpacity: initialZone?.gridOpacity ?? 0.3,
    backgroundColor: initialZone?.backgroundColor || "#ffffff",
    backgroundImage: initialZone?.backgroundImage
      ? {
        ...initialZone.backgroundImage,
        rotation: initialZone.backgroundImage.rotation || 0,
      }
      : null,
    tokens: initialZone?.tokens || [],
    drawings: initialZone?.drawings || [],
  }))

  const [characters, setCharacters] = useState<Character[]>([])
  const [showUI, setShowUI] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddToken, setShowAddToken] = useState(false)
  const [showBrushMenu, setShowBrushMenu] = useState(false)
  const [showCharacterMenu, setShowCharacterMenu] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string>("")
  const [characterSearchTerm, setCharacterSearchTerm] = useState("")
  const [characterTypeFilter, setCharacterTypeFilter] = useState<"all" | "player" | "ally" | "enemy">("all")
  const [drawingMode, setDrawingMode] = useState<"brush" | "eraser" | null>(null)
  const [drawColor, setDrawColor] = useState("#ff0000")
  const [drawThickness, setDrawThickness] = useState(3)
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(zone.backgroundImage?.url || "")
  const [isEditingBackground, setIsEditingBackground] = useState(false)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const data = loadAppData()
      setCharacters(data.characters || [])
    } catch (error) {
      console.error("Error loading characters:", error)
      setCharacters([])
    }
  }, [])

  // Initialize history with current state
  useEffect(() => {
    if (zone && zone.drawings !== undefined && zone.tokens !== undefined) {
      const initialState: HistoryState = {
        drawings: [...zone.drawings],
        tokens: [...zone.tokens],
      }
      setHistory([initialState])
      setHistoryIndex(0)
    }
  }, []) // Only run once on mount

  // Track changes to mark as unsaved
  useEffect(() => {
    if (editMode) {
      setHasUnsavedChanges(true)
    }
  }, [zone, editMode])

  // Manual save function
  const saveZoneManually = useCallback(async () => {
    if (!zone || !zone.id) return false

    setIsSaving(true)
    try {
      const data = loadAppData()
      const updatedZones = data.zones.map((z) => (z.id === zone.id ? { ...zone } : z))
      saveAppData({ zones: updatedZones, characters: data.characters || [] })

      console.log("Zone saved manually:", zone.name, {
        tokensCount: zone.tokens?.length || 0,
        drawingsCount: zone.drawings?.length || 0,
        hasBackgroundImage: !!zone.backgroundImage,
      })

      setHasUnsavedChanges(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      return true
    } catch (error) {
      console.error("Error saving zone:", error)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [zone])

  // Auto-save function (debounced)
  const autoSaveZone = useCallback(() => {
    if (!zone || !zone.id || !editMode) return

    try {
      const data = loadAppData()
      const updatedZones = data.zones.map((z) => (z.id === zone.id ? { ...zone } : z))
      saveAppData({ zones: updatedZones, characters: data.characters || [] })
      console.log("Zone auto-saved:", zone.name)
    } catch (error) {
      console.error("Error auto-saving zone:", error)
    }
  }, [zone, editMode])

  // Auto-save with debounce
  useEffect(() => {
    if (editMode && zone && zone.id && hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        autoSaveZone()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [zone, editMode, hasUnsavedChanges, autoSaveZone])

  // Save to history when drawings or tokens change
  const saveToHistory = useCallback(() => {
    if (!zone || zone.drawings === undefined || zone.tokens === undefined) return

    const newState: HistoryState = {
      drawings: [...zone.drawings],
      tokens: [...zone.tokens],
    }

    // Don't save duplicate states
    const currentState = history[historyIndex]
    if (
      currentState &&
      JSON.stringify(currentState.drawings) === JSON.stringify(newState.drawings) &&
      JSON.stringify(currentState.tokens) === JSON.stringify(newState.tokens)
    ) {
      return
    }

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      setHistoryIndex((prev) => prev + 1)
    }

    setHistory(newHistory)
  }, [zone, history, historyIndex])

  const undo = () => {
    if (historyIndex > 0 && history[historyIndex - 1]) {
      const prevState = history[historyIndex - 1]
      setZone((prev) => ({
        ...prev,
        drawings: prevState.drawings || [],
        tokens: prevState.tokens || [],
      }))
      setHistoryIndex((prev) => prev - 1)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1 && history[historyIndex + 1]) {
      const nextState = history[historyIndex + 1]
      setZone((prev) => ({
        ...prev,
        drawings: nextState.drawings || [],
        tokens: nextState.tokens || [],
      }))
      setHistoryIndex((prev) => prev + 1)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault()
          undo()
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault()
          redo()
        } else if (e.key === "s") {
          e.preventDefault()
          saveZoneManually()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [historyIndex, history, saveZoneManually])

  // Handle navigation with unsaved changes
  const handleNavigation = useCallback(
    (navigationFn: () => void) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(() => navigationFn)
        setShowExitConfirmation(true)
      } else {
        navigationFn()
      }
    },
    [hasUnsavedChanges],
  )

  const confirmExit = async () => {
    if (pendingNavigation) {
      await saveZoneManually()
      pendingNavigation()
      setPendingNavigation(null)
    }
    setShowExitConfirmation(false)
  }

  const cancelExit = () => {
    setPendingNavigation(null)
    setShowExitConfirmation(false)
  }

  // Mouse wheel panning
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        // Middle mouse button
        e.preventDefault()
        setIsPanning(true)
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          panX: panOffset.x,
          panY: panOffset.y,
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && panStartRef.current) {
        const deltaX = e.clientX - panStartRef.current.x
        const deltaY = e.clientY - panStartRef.current.y
        setPanOffset({
          x: panStartRef.current.panX + deltaX,
          y: panStartRef.current.panY + deltaY,
        })
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        setIsPanning(false)
        panStartRef.current = null
      }
    }

    container.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      container.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isPanning, panOffset, zoom])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3))
  }

  const handleGridOpacityChange = (value: number[]) => {
    setZone((prev) => ({ ...prev, gridOpacity: value[0] }))
  }

  const handleGridColorChange = (color: string) => {
    setZone((prev) => ({ ...prev, gridColor: color }))
  }

  const handleBackgroundColorChange = (color: string) => {
    setZone((prev) => ({
      ...prev,
      backgroundColor: color,
      backgroundImage: null,
    }))
  }

  const handleBackgroundImageUrlChange = (url: string) => {
    if (url.trim()) {
      setZone((prev) => ({
        ...prev,
        backgroundImage: {
          url: url.trim(),
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
        },
      }))
      setBackgroundImageUrl(url.trim())
      setIsEditingBackground(true)
    } else {
      setZone((prev) => ({ ...prev, backgroundImage: null }))
      setBackgroundImageUrl("")
    }
  }

  const rotateBackgroundImage = (degrees: number) => {
    if (!zone.backgroundImage) return

    setZone((prev) => ({
      ...prev,
      backgroundImage: prev.backgroundImage
        ? {
          ...prev.backgroundImage,
          rotation: (prev.backgroundImage.rotation + degrees) % 360,
        }
        : null,
    }))
  }

  const addToken = () => {
    if (!selectedCharacter) return

    const character = characters.find((c) => c.id === selectedCharacter)
    if (!character) return

    // Position token in center of grid cell
    const initialGridX = 2 // Start at grid position 2,2
    const initialGridY = 2
    const centerX = initialGridX * zone.gridSize + zone.gridSize / 2
    const centerY = initialGridY * zone.gridSize + zone.gridSize / 2

    const newToken: Token = {
      id: Date.now().toString(),
      characterId: character.id,
      x: centerX,
      y: centerY,
      gridX: initialGridX,
      gridY: initialGridY,
      isDead: false,
    }

    setZone((prev) => ({
      ...prev,
      tokens: [...(prev.tokens || []), newToken],
    }))
    saveToHistory()
    setSelectedCharacter("")
    setCharacterSearchTerm("")
    setCharacterTypeFilter("all")
    setShowAddToken(false)
  }

  const updateToken = (tokenId: string, updates: Partial<Token>) => {
    setZone((prev) => ({
      ...prev,
      tokens: (prev.tokens || []).map((token) => (token.id === tokenId ? { ...token, ...updates } : token)),
    }))
    saveToHistory()
  }

  const deleteToken = (tokenId: string) => {
    setZone((prev) => ({
      ...prev,
      tokens: (prev.tokens || []).filter((token) => token.id !== tokenId),
    }))
    saveToHistory()
  }

  const toggleTokenDead = (tokenId: string) => {
    setZone((prev) => ({
      ...prev,
      tokens: (prev.tokens || []).map((token) =>
        token.id === tokenId ? { ...token, isDead: !token.isDead } : token
      ),
    }))
    saveToHistory()
  }

  const addDrawing = (drawing: Drawing) => {
    setZone((prev) => {
      const newZone = {
        ...prev,
        drawings: [...(prev.drawings || []), drawing],
      }
      return newZone
    })
    // Save to history after state update
    setTimeout(() => saveToHistory(), 0)
  }

  const updateDrawings = (newDrawings: Drawing[]) => {
    setZone((prev) => {
      const newZone = {
        ...prev,
        drawings: newDrawings || [],
      }
      return newZone
    })
    // Save to history after state update
    setTimeout(() => saveToHistory(), 0)
  }

  const clearDrawings = () => {
    setZone((prev) => ({
      ...prev,
      drawings: [],
    }))
    saveToHistory()
  }

  // Filter characters based on search term and type filter
  const filteredCharacters = characters.filter((character) => {
    const matchesSearchTerm = character.name.toLowerCase().includes(characterSearchTerm.toLowerCase())
    const matchesTypeFilter = characterTypeFilter === "all" || character.type === characterTypeFilter
    return matchesSearchTerm && matchesTypeFilter
  })

  // Get characters that are currently on the board
  const charactersOnBoard = (zone.tokens || []).map((token) => {
    const character = characters.find((c) => c.id === token.characterId)
    return character ? { token, character } : null
  }).filter((item): item is { token: Token; character: Character } => item !== null)

  const [backgroundImageDrag, setBackgroundImageDrag] = useState<{
    isDragging: boolean
    isResizing: boolean
    startX: number
    startY: number
    startImageX: number
    startImageY: number
    startImageWidth: number
    startImageHeight: number
  } | null>(null)

  const handleBackgroundImageMouseDown = (e: React.MouseEvent) => {
    if (!editMode || !zone.backgroundImage || !isEditingBackground) return

    e.preventDefault()
    e.stopPropagation()

    setBackgroundImageDrag({
      isDragging: true,
      isResizing: false,
      startX: e.clientX,
      startY: e.clientY,
      startImageX: zone.backgroundImage.x,
      startImageY: zone.backgroundImage.y,
      startImageWidth: zone.backgroundImage.width,
      startImageHeight: zone.backgroundImage.height,
    })
  }

  const handleBackgroundImageResizeMouseDown = (e: React.MouseEvent) => {
    if (!editMode || !zone.backgroundImage || !isEditingBackground) return

    e.preventDefault()
    e.stopPropagation()

    setBackgroundImageDrag({
      isDragging: false,
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startImageX: zone.backgroundImage.x,
      startImageY: zone.backgroundImage.y,
      startImageWidth: zone.backgroundImage.width,
      startImageHeight: zone.backgroundImage.height,
    })
  }

  useEffect(() => {
    if (!backgroundImageDrag) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundImageDrag || !zone.backgroundImage) return

      const deltaX = e.clientX - backgroundImageDrag.startX
      const deltaY = e.clientY - backgroundImageDrag.startY

      if (backgroundImageDrag.isDragging) {
        setZone((prev) => ({
          ...prev,
          backgroundImage: prev.backgroundImage
            ? {
              ...prev.backgroundImage,
              x: backgroundImageDrag.startImageX + deltaX,
              y: backgroundImageDrag.startImageY + deltaY,
            }
            : null,
        }))
      } else if (backgroundImageDrag.isResizing) {
        setZone((prev) => ({
          ...prev,
          backgroundImage: prev.backgroundImage
            ? {
              ...prev.backgroundImage,
              width: Math.max(100, backgroundImageDrag.startImageWidth + deltaX),
              height: Math.max(100, backgroundImageDrag.startImageHeight + deltaY),
            }
            : null,
        }))
      }
    }

    const handleMouseUp = () => {
      setBackgroundImageDrag(null)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [backgroundImageDrag, zone.backgroundImage])

  // Prevent navigation without saving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Don't render if zone is not properly loaded
  if (!zone || !zone.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Loading Zone...</h1>
          <p className="text-gray-400">Please wait while we load your zone.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in this zone. Would you like to save before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelExit}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit}>Save & Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Zone Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Grid Opacity</Label>
              <Slider
                value={[zone.gridOpacity]}
                onValueChange={handleGridOpacityChange}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Grid Color</Label>
              <input
                type="color"
                value={zone.gridColor}
                onChange={(e) => handleGridColorChange(e.target.value)}
                className="mt-2 w-full h-10 rounded border"
              />
            </div>

            <div>
              <Label>Background Color</Label>
              <input
                type="color"
                value={zone.backgroundColor}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="mt-2 w-full h-10 rounded border"
              />
            </div>

            <div>
              <Label>Background Image URL</Label>
              <Input
                type="url"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={backgroundImageUrl}
                onChange={(e) => {
                  setBackgroundImageUrl(e.target.value)
                  handleBackgroundImageUrlChange(e.target.value)
                }}
                className="mt-2 w-full"
              />
            </div>

            {zone.backgroundImage && (
              <div>
                <Label>Image Rotation</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rotateBackgroundImage(-90)}
                    title="Rotate 90° counter-clockwise"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <span className="text-sm min-w-[60px] text-center">{zone.backgroundImage.rotation}°</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rotateBackgroundImage(90)}
                    title="Rotate 90° clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Token Dialog */}
      <Dialog open={showAddToken} onOpenChange={setShowAddToken}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Search and Filter Controls */}
            <div className="space-y-3 border-b pb-4">
              <div>
                <Label htmlFor="character-search">Search Characters</Label>
                <Input
                  id="character-search"
                  value={characterSearchTerm}
                  onChange={(e) => setCharacterSearchTerm(e.target.value)}
                  placeholder="Search by character name..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Filter by Type</Label>
                <Select value={characterTypeFilter} onValueChange={(value: "all" | "player" | "ally" | "enemy") => setCharacterTypeFilter(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="ally">Ally</SelectItem>
                    <SelectItem value="enemy">Enemy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Character Selection */}
            <div>
              <Label>Select Character ({filteredCharacters.length} found)</Label>
              {filteredCharacters.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No characters found matching your criteria.
                  {characterSearchTerm && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCharacterSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-h-64 overflow-y-auto">
                  {filteredCharacters.map((character) => (
                    <div
                      key={character.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedCharacter === character.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                        }`}
                      onClick={() => setSelectedCharacter(character.id)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm ${character.type === "player"
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
                      <div className="flex-1">
                        <div className="font-medium text-sm">{character.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{character.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowAddToken(false)
              setCharacterSearchTerm("")
              setCharacterTypeFilter("all")
              setSelectedCharacter("")
            }}>
              Cancel
            </Button>
            <Button onClick={addToken} disabled={!selectedCharacter}>
              Add Token
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Left Character Sidebar */}
      {showUI && (
        <Sheet open={showCharacterMenu} onOpenChange={setShowCharacterMenu}>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Characters on Board</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              {charactersOnBoard.map(({ token, character }) => {
                const tokensCount = charactersOnBoard.length
                const isDead = token.isDead || false
                return (
                  <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${character.type === "player"
                          ? "border-green-500 bg-green-100 text-green-700"
                          : character.type === "ally"
                            ? "border-blue-500 bg-blue-100 text-blue-700"
                            : "border-red-500 bg-red-100 text-red-700"
                          } ${isDead ? "grayscale opacity-50" : ""}`}
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
                      <div className="flex-1">
                        <h3 className={`font-medium text-sm ${isDead ? "line-through text-gray-500" : ""}`}>
                          {character.name}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {character.type} • {tokensCount} token{tokensCount !== 1 ? "s" : ""}
                          {isDead && " • DEAD"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Label htmlFor={`dead-${token.id}`} className="text-xs">
                            Dead
                          </Label>
                          <Switch
                            id={`dead-${token.id}`}
                            checked={isDead}
                            onCheckedChange={() => toggleTokenDead(token.id)}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteToken(token.id)}
                      className="h-8 w-8 p-0 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
              {charactersOnBoard.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No characters on the board yet.
                  <br />
                  Add tokens to see them here.
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Character Menu Trigger */}
      {showUI && (
        <Button
          variant="outline"
          size="sm"
          className="fixed left-4 top-20 z-50 bg-white hover:text-white hover:bg-black"
          onClick={() => setShowCharacterMenu(true)}
        >
          Characters ({charactersOnBoard.length})
        </Button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        {showUI && (
          <div className="bg-white border-b p-2 flex items-center justify-between z-50">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleNavigation(() => router.push("/"))}>
                <Home className="w-4 h-4" />
              </Button>
              <h1 className="font-semibold">{zone.name}</h1>
              {hasUnsavedChanges && (
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Unsaved changes</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <Button
                variant={hasUnsavedChanges ? "default" : "outline"}
                size="sm"
                onClick={saveZoneManually}
                disabled={isSaving}
                title="Save (Ctrl+S)"
                className="relative"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : saveSuccess ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {!isSaving && !saveSuccess && "Save"}
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <Button variant="outline" size="sm" onClick={() => setShowAddToken(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Token
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowUI(false)}>
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden"
          style={{
            backgroundColor: zone.backgroundColor,
            cursor: isPanning ? "grabbing" : drawingMode ? "crosshair" : "default",
          }}
        >
          <div
            className="absolute inset-0 origin-top-left transition-transform"
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
            }}
          >
            {/* Background Image */}
            {zone.backgroundImage && (
              <div
                className={`absolute ${isEditingBackground ? "border-2 border-dashed border-blue-500" : ""}`}
                style={{
                  left: zone.backgroundImage.x,
                  top: zone.backgroundImage.y,
                  width: zone.backgroundImage.width,
                  height: zone.backgroundImage.height,
                  cursor: isEditingBackground ? "move" : "default",
                  transform: `rotate(${zone.backgroundImage.rotation}deg)`,
                  transformOrigin: "center center",
                }}
                onMouseDown={editMode ? handleBackgroundImageMouseDown : undefined}
              >
                <img
                  src={zone.backgroundImage.url || "/placeholder.svg"}
                  alt="Background"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {editMode && isEditingBackground && (
                  <>
                    {/* Resize handle */}
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                      onMouseDown={handleBackgroundImageResizeMouseDown}
                    />
                    {/* Control buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-6 h-6 p-0 bg-white"
                        onClick={() => rotateBackgroundImage(-90)}
                        title="Rotate 90° counter-clockwise"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-6 h-6 p-0 bg-white"
                        onClick={() => rotateBackgroundImage(90)}
                        title="Rotate 90° clockwise"
                      >
                        <RotateCw className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-6 h-6 p-0 bg-green-500 hover:bg-green-600"
                        onClick={() => setIsEditingBackground(false)}
                        title="Validate changes"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-6 h-6 p-0"
                        onClick={() => setZone((prev) => ({ ...prev, backgroundImage: null }))}
                        title="Delete image"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
                {editMode && !isEditingBackground && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 w-6 h-6 p-0 bg-white"
                    onClick={() => setIsEditingBackground(true)}
                    title="Edit image"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Drawing Layer */}
            <DrawingTool
              isActive={!!drawingMode && !isPanning}
              mode={drawingMode || "brush"}
              color={drawColor}
              thickness={drawThickness}
              onDrawingComplete={addDrawing}
              onDrawingsUpdate={updateDrawings}
              drawings={zone.drawings || []}
            />

            {/* Tokens */}
            {(zone.tokens || []).map((token) => {
              const character = characters.find((c) => c.id === token.characterId)
              if (!character) return null

              return (
                <TokenComponent
                  key={token.id}
                  token={token}
                  character={character}
                  gridSize={zone.gridSize}
                  onUpdate={(updates) => updateToken(token.id, updates)}
                  onDelete={() => deleteToken(token.id)}
                  isEditMode={editMode && !isPanning}
                />
              )
            })}

            {/* Grid Overlay - Always on top */}
            <GridOverlay gridSize={zone.gridSize} color={zone.gridColor} opacity={zone.gridOpacity} />
          </div>

          {/* Pan instruction */}
          {zoom > 1 && showUI && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              Middle-click and drag to pan • Use +/- buttons to zoom
            </div>
          )}
        </div>
      </div>

      {/* Right Drawing Tools Sidebar */}
      {showUI && (
        <Sheet open={showBrushMenu} onOpenChange={setShowBrushMenu}>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Drawing Tools</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Back Button */}
              <Button variant="outline" onClick={() => handleNavigation(() => router.push("/"))} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>

              {/* Tool Selection */}
              <div>
                <Label className="text-sm font-medium">Tool</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={drawingMode === "brush" ? "default" : "outline"}
                    onClick={() => setDrawingMode(drawingMode === "brush" ? null : "brush")}
                    className="flex items-center gap-2"
                  >
                    <Brush className="w-4 h-4" />
                    Brush
                  </Button>
                  <Button
                    variant={drawingMode === "eraser" ? "default" : "outline"}
                    onClick={() => setDrawingMode(drawingMode === "eraser" ? null : "eraser")}
                    className="flex items-center gap-2"
                  >
                    <Eraser className="w-4 h-4" />
                    Eraser
                  </Button>
                </div>
              </div>

              {/* Color Selection (only for brush) */}
              {drawingMode === "brush" && (
                <div>
                  <Label className="text-sm font-medium">Color</Label>
                  <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="mt-2 w-full h-12 rounded border"
                  />
                </div>
              )}

              {/* Thickness */}
              <div>
                <Label className="text-sm font-medium">
                  {drawingMode === "eraser" ? "Eraser Size" : "Brush Size"}: {drawThickness}px
                </Label>
                <Slider
                  value={[drawThickness]}
                  onValueChange={(value) => setDrawThickness(value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" onClick={undo} className="w-full bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Undo Last Action
                </Button>
                <Button variant="outline" onClick={clearDrawings} className="w-full bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Clear All Drawings
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Drawing Tools Trigger */}
      {showUI && (
        <Button
          variant={drawingMode ? "outline" : "outline"}
          size="sm"
          className={`fixed right-4 top-20 z-50 [&_svg]:hover:stroke-white hover:bg-black ${!drawingMode ? "bg-white" : "bg-black"}`}
          onClick={() => setShowBrushMenu(true)}
        >
          <Palette className="w-4 h-4" color={!drawingMode ? "black" : "white"} />
        </Button>
      )}

      {/* Hidden UI Toggle */}
      {!showUI && (
        <Button className="fixed top-4 right-4 z-50 hover:text-white" onClick={() => setShowUI(true)}>
          Show UI
        </Button>
      )}
    </div>
  )
}
