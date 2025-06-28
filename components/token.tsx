"use client"

import type React from "react"

import type { Character, Token } from "@/lib/types"
import { useEffect, useRef, useState } from "react"

interface TokenProps {
  token: Token
  character: Character
  gridSize: number
  onUpdate: (updates: Partial<Token>) => void
  onDelete: () => void
  isEditMode: boolean
}

export default function TokenComponent({ token, character, gridSize, onUpdate, isEditMode }: TokenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const tokenRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return

    e.preventDefault()
    e.stopPropagation()

    const rect = tokenRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

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
  }, [isDragging, dragOffset, gridSize, onUpdate])

  return (
    <div
      ref={tokenRef}
      className={`absolute w-8 h-8 scale-[1.2] rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer select-none z-20 ${character.type === "player"
        ? "border-green-500 bg-green-100 text-green-700"
        : character.type === "ally"
          ? "border-blue-500 bg-blue-100 text-blue-700"
          : "border-red-500 bg-red-100 text-red-700"
        } ${token.isDead ? "grayscale-[0.7] opacity-70" : ""} ${isDragging ? "scale-110 shadow-lg" : ""}`}
      style={{
        left: token.x - 16,
        top: token.y - 16,
        cursor: isEditMode ? (isDragging ? "grabbing" : "grab") : "default",
      }}
      onMouseDown={handleMouseDown}
      title={`${character.name} (${character.type})`}
    >
      {character.imageUrl ? (
        <img
          src={character.imageUrl || "/placeholder.svg"}
          alt={character.name}
          className="w-full h-full rounded-full object-cover"
          draggable={false}
        />
      ) : (
        character.name.charAt(0).toUpperCase()
      )}
    </div>
  )
}
