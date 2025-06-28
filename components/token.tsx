"use client"

import type { Character, Token as TokenType } from "@/lib/types"
import type React from "react"
import { useEffect, useRef, useState } from "react"

interface TokenProps {
  token: TokenType
  character: Character
  gridSize: number
  isEditMode: boolean
  onUpdate: (updates: Partial<TokenType>) => void
  onDelete: () => void
}

export default function Token({ token, character, gridSize, isEditMode, onUpdate, onDelete }: TokenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const tokenRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; startTokenX: number; startTokenY: number }>()

  const getBorderColor = () => {
    switch (character.type) {
      case "player":
        return "border-green-500"
      case "ally":
        return "border-blue-500"
      case "enemy":
        return "border-red-500"
      default:
        return "border-gray-500"
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return

    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTokenX: token.x,
      startTokenY: token.y,
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current || !isEditMode) return

    const deltaX = e.clientX - dragRef.current.startX
    const deltaY = e.clientY - dragRef.current.startY

    const newX = dragRef.current.startTokenX + deltaX
    const newY = dragRef.current.startTokenY + deltaY

    // Snap to grid center instead of corners
    const gridX = Math.round(newX / gridSize)
    const gridY = Math.round(newY / gridSize)
    const snappedX = gridX * gridSize + gridSize / 2 // Center in grid cell
    const snappedY = gridY * gridSize + gridSize / 2 // Center in grid cell

    onUpdate({
      x: snappedX,
      y: snappedY,
      gridX,
      gridY,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    dragRef.current = undefined
  }

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div
      ref={tokenRef}
      className={`absolute w-12 h-12 rounded-full border-4 ${getBorderColor()} bg-white shadow-lg cursor-pointer select-none z-40 flex items-center justify-center overflow-hidden ${token.isDead ? "grayscale-[0.7] opacity-50" : ""
        }`}
      style={{
        left: token.x,
        top: token.y,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
    >
      {character.imageUrl ? (
        <img
          src={character.imageUrl || "/placeholder.svg"}
          alt={character.name}
          className="w-full h-full object-cover rounded-full"
          draggable={false}
        />
      ) : (
        <span className="text-lg font-bold text-gray-700">{character.name.charAt(0).toUpperCase()}</span>
      )}

      {/* {isEditMode && !isDragging && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <Button
            size="sm"
            variant="destructive"
            className="w-6 h-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )} */}
    </div>
  )
}
