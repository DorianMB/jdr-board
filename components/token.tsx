"use client"

import type { Character, Token } from "@/lib/types"
import { getTokenNumber } from "@/lib/types"
import { useEffect, useRef, useState } from "react"

interface TokenProps {
  token: Token
  character: Character
  gridSize: number
  onUpdate: (updates: Partial<Token>) => void
  onDelete: () => void
  isEditMode: boolean
  allTokens: Token[]
  allCharacters: Character[]
  isDrawingMode?: boolean
  zoom?: number
  panOffset?: { x: number; y: number }
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export default function TokenComponent({
  token,
  character,
  gridSize,
  onUpdate,
  isEditMode,
  allTokens,
  allCharacters,
  isDrawingMode = false,
  zoom = 1,
  panOffset = { x: 0, y: 0 },
  containerRef
}: TokenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const tokenRef = useRef<HTMLDivElement>(null)

  // Calculer le numéro du token s'il y en a plusieurs identiques
  const tokenNumber = getTokenNumber(allTokens, token, allCharacters)

  // Fonction pour convertir les coordonnées écran en coordonnées de la grille
  const screenToGridCoordinates = (screenX: number, screenY: number) => {
    if (!containerRef?.current) return { x: screenX, y: screenY }

    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculer les coordonnées relatives au conteneur
    const relativeX = screenX - containerRect.left
    const relativeY = screenY - containerRect.top

    // Appliquer la transformation inverse (zoom et pan)
    const gridX = (relativeX / zoom) - (panOffset.x / zoom)
    const gridY = (relativeY / zoom) - (panOffset.y / zoom)

    return { x: gridX, y: gridY }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)

    // Convertir la position de la souris en coordonnées de grille
    const gridCoords = screenToGridCoordinates(e.clientX, e.clientY)

    // Calculer l'offset par rapport au centre du token
    setDragOffset({
      x: gridCoords.x - token.x,
      y: gridCoords.y - token.y,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      // Convertir la position de la souris en coordonnées de grille
      const gridCoords = screenToGridCoordinates(e.clientX, e.clientY)

      // Calculer la nouvelle position en soustrayant l'offset
      const newX = gridCoords.x - dragOffset.x
      const newY = gridCoords.y - dragOffset.y

      // Snap to grid
      const gridX = Math.round(newX / gridSize)
      const gridY = Math.round(newY / gridSize)
      const snappedX = gridX * gridSize + gridSize / 2
      const snappedY = gridY * gridSize + gridSize / 2

      onUpdate({
        x: snappedX,
        y: snappedY,
        gridX,
        gridY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, gridSize, onUpdate, zoom, panOffset, containerRef])

  return (
    <div
      ref={tokenRef}
      className={`absolute w-8 h-8 scale-[1.2] rounded-full border-2 flex items-center justify-center text-xs font-bold select-none z-50 ${character.type === "player"
        ? "border-green-500 bg-green-100 text-green-700"
        : character.type === "ally"
          ? "border-blue-500 bg-blue-100 text-blue-700"
          : "border-red-500 bg-red-100 text-red-700"
        } ${token.isDead ? "grayscale-[0.7] opacity-70" : ""} ${isDragging ? "scale-110 shadow-lg" : ""}`}
      style={{
        left: token.x - 16,
        top: token.y - 16,
        cursor: isDrawingMode ? "crosshair" : isEditMode ? (isDragging ? "grabbing" : "grab") : "default",
        pointerEvents: isDrawingMode ? "none" : "auto",
      }}
      onMouseDown={handleMouseDown}
      title={`${character.name}${tokenNumber ? ` (${tokenNumber})` : ""} (${character.type === "player" ? "Joueur" :
        character.type === "ally" ? "Allié" : "Ennemi"
        })`}
    >
      <div className="relative w-full h-full">
        {character.imageUrl && (
          <img
            src={character.imageUrl || "/placeholder.svg"}
            alt={character.name}
            className="w-full h-full rounded-full object-cover"
            draggable={false}
          />
        )}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none ${character.imageUrl ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" : ""}`}
        >
          {/^[a-zA-Z]/.test(character.name)
            ? character.name.charAt(0).toUpperCase() + character.name.replace(/\D/g, "")
            : character.name.replace(/\D/g, "")}
        </div>
        {/* Afficher le numéro en petit en bas à droite si nécessaire */}
        {tokenNumber && (
          <div className="absolute -bottom-1 -right-1 bg-white border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold text-gray-700">
            {tokenNumber}
          </div>
        )}
      </div>
    </div>
  )
}
