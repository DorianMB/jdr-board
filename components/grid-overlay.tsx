"use client"

interface GridOverlayProps {
  gridSize: number
  color: string
  opacity: number
}

export default function GridOverlay({ gridSize, color, opacity }: GridOverlayProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        opacity,
      }}
    />
  )
}
