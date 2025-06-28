"use client"

import type React from "react"

import type { Drawing } from "@/lib/types"
import { useCallback, useEffect, useRef, useState } from "react"

interface DrawingToolProps {
  isActive: boolean
  mode: "brush" | "eraser"
  color: string
  thickness: number
  onDrawingComplete: (drawing: Drawing) => void
  onDrawingsUpdate: (drawings: Drawing[]) => void
  drawings: Drawing[]
  gridSize: number
}

export default function DrawingTool({
  isActive,
  mode,
  color,
  thickness,
  onDrawingComplete,
  onDrawingsUpdate,
  drawings,
  gridSize,
}: DrawingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Get coordinates relative to canvas
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    return { x, y }
  }, [])

  const eraseAtPoint = useCallback(
    (point: { x: number; y: number }) => {
      const eraseRadius = thickness * 2
      const updatedDrawings = drawings.filter((drawing) => {
        // Check if any point in the drawing is within the erase radius
        const isWithinEraseArea = drawing.points.some((drawPoint) => {
          const distance = Math.sqrt(Math.pow(drawPoint.x - point.x, 2) + Math.pow(drawPoint.y - point.y, 2))
          return distance <= eraseRadius
        })

        // Keep the drawing only if it's NOT within the erase area
        return !isWithinEraseArea
      })

      // Only update if something was actually erased
      if (updatedDrawings.length !== drawings.length) {
        onDrawingsUpdate(updatedDrawings)
      }
    },
    [drawings, thickness, onDrawingsUpdate],
  )

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isActive || e.button !== 0) return // ← ajouté e.button !== 0

      e.preventDefault()
      e.stopPropagation()
      const coords = getCanvasCoordinates(e)

      if (mode === "eraser") {
        eraseAtPoint(coords)
      } else {
        setIsDrawing(true)
        setCurrentPath([coords])
      }
    },
    [isActive, mode, getCanvasCoordinates, eraseAtPoint],
  )


  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isActive) return

      if (mode === "eraser") {
        if (!(e.buttons & 1)) return // ← ne gomme que si clic gauche maintenu
        const coords = getCanvasCoordinates(e)
        eraseAtPoint(coords)
        return
      }

      if (!isDrawing) return

      const coords = getCanvasCoordinates(e)
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const newPath = [...currentPath, coords]
      setCurrentPath(newPath)

      ctx.strokeStyle = color
      ctx.lineWidth = thickness
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      if (currentPath.length > 0) {
        const lastPoint = currentPath[currentPath.length - 1]
        ctx.beginPath()
        ctx.moveTo(lastPoint.x, lastPoint.y)
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
      }
    },
    [isActive, mode, isDrawing, currentPath, color, thickness, getCanvasCoordinates, eraseAtPoint],
  )


  const stopDrawing = useCallback(() => {
    if (!isDrawing || currentPath.length === 0 || mode === "eraser") {
      setIsDrawing(false)
      setCurrentPath([])
      return
    }

    const newDrawing: Drawing = {
      id: Date.now().toString(),
      points: currentPath,
      color,
      thickness,
    }

    onDrawingComplete(newDrawing)
    setIsDrawing(false)
    setCurrentPath([])
  }, [isDrawing, currentPath, color, thickness, onDrawingComplete, mode])

  // Redraw canvas when drawings change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (!container) return

      // Set canvas size to match container
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Redraw all existing drawings
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw all saved drawings
      drawings.forEach((drawing) => {
        if (drawing.points.length < 2) return

        ctx.strokeStyle = drawing.color
        ctx.lineWidth = drawing.thickness
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        drawing.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      })
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [drawings])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30"
      style={{
        pointerEvents: isActive ? "auto" : "none",
        cursor: isActive ? (mode === "eraser" ? "url('/icons8-eraser-30.png') 4 4, auto" : "url('/icons8-brush-24.png') 8 20, auto") : "default",
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  )
}
