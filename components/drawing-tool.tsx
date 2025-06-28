"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import type { Drawing } from "@/lib/types"

interface DrawingToolProps {
  isActive: boolean
  mode: "brush" | "eraser"
  color: string
  thickness: number
  onDrawingComplete: (drawing: Drawing) => void
  onDrawingsUpdate: (drawings: Drawing[]) => void
  drawings: Drawing[]
  gridSize: number
  zoom: number
  panOffset: { x: number; y: number }
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
  zoom,
  panOffset,
}: DrawingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()

      // Get the raw mouse coordinates relative to the canvas
      const rawX = e.clientX - rect.left
      const rawY = e.clientY - rect.top

      // Convert to world coordinates by accounting for zoom and pan
      const x = (rawX - panOffset.x) / zoom
      const y = (rawY - panOffset.y) / zoom

      return { x, y }
    },
    [zoom, panOffset],
  )

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
      if (!isActive) return

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

      const coords = getCanvasCoordinates(e)

      if (mode === "eraser") {
        eraseAtPoint(coords)
        return
      }

      if (!isDrawing) return

      setCurrentPath((prev) => [...prev, coords])
    },
    [isActive, mode, isDrawing, getCanvasCoordinates, eraseAtPoint],
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

  // Redraw canvas when drawings, zoom, or pan changes
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

      // Apply zoom and pan transformations
      ctx.save()
      ctx.scale(zoom, zoom)
      ctx.translate(panOffset.x / zoom, panOffset.y / zoom)

      // Draw all existing drawings
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

      // Draw current path if drawing
      if (isDrawing && currentPath.length > 0) {
        ctx.strokeStyle = color
        ctx.lineWidth = thickness
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        currentPath.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }

      ctx.restore()
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [drawings, zoom, panOffset, isDrawing, currentPath, color, thickness])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30"
      style={{
        pointerEvents: isActive ? "auto" : "none",
        cursor: isActive ? (mode === "eraser" ? "crosshair" : "crosshair") : "default",
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  )
}
