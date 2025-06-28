"use client"

import { useMemo } from "react"

interface GridOverlayProps {
  gridSize: number
  color: string
  opacity: number
}

export default function GridOverlay({ gridSize, color, opacity }: GridOverlayProps) {
  const gridStyle = useMemo(() => {
    return {
      backgroundImage: `
        linear-gradient(to right, ${color} 1px, transparent 1px),
        linear-gradient(to bottom, ${color} 1px, transparent 1px)
      `,
      backgroundSize: `${gridSize}px ${gridSize}px`,
      opacity,
    }
  }, [gridSize, color, opacity])

  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{
        ...gridStyle,
        left: -10000,
        top: -10000,
        width: 20000,
        height: 20000,
      }}
    />
  )
}
