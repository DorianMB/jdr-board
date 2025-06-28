"use client"

import React from "react"

import { useState, useRef } from "react"
import type { Character, Token } from "@/lib/types"
import { X } from "lucide-react"

interface TokenProps {
  token: Token
  character: Character
  gridSize: number
  onUpdate: (updates: Partial<Token>) => void
  editMode: boolean
}

export default function TokenComponent({ token, character, gridSize, onUpdate, editMode }: TokenProps) {
  const [isDragging, setIsDragging] = useState(false)
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
    if (!editMode) return

    e.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTokenX: token.x,
      startTokenY: token.y,
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current || !editMode) return

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
  React.useEffect(() => {
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
      className={`absolute w-12 h-12 rounded-full border-4 ${getBorderColor()} bg-white shadow-lg cursor-pointer select-none z-40 flex items-center justify-center overflow-hidden ${
        token.isDead ? "grayscale opacity-70" : ""
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

      {/* Dead overlay */}
      {token.isDead && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <X className="w-6 h-6 text-red-500" strokeWidth={3} />
        </div>
      )}
    </div>
  )
}
