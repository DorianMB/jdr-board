"use client"

import type { Drawing } from "@/lib/types"
import { useCallback, useEffect, useRef, useState } from "react"

interface DrawingToolProps {
  isActive: boolean
  mode: "brush" | "eraser" | "shapes"
  shapeType?: "rectangle" | "circle" | "line"
  color: string
  fillColor?: string
  hasFill?: boolean
  thickness: number
  onDrawingComplete: (drawing: Drawing) => void
  onDrawingsUpdate: (drawings: Drawing[]) => void
  drawings: Drawing[]
}

export default function DrawingTool({
  isActive,
  mode,
  shapeType = "rectangle",
  color,
  fillColor,
  hasFill = false,
  thickness,
  onDrawingComplete,
  onDrawingsUpdate,
  drawings,
}: DrawingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [isDrawingShape, setIsDrawingShape] = useState(false)
  const [shapeStartPoint, setShapeStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [previewShape, setPreviewShape] = useState<{ start: { x: number; y: number }, end: { x: number; y: number } } | null>(null)

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    console.log("Canvas rect:", rect)
    console.log("Canvas size:", canvas.width, canvas.height)

    // Get coordinates relative to canvas
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    return { x, y }
  }, [])

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }, type: string, strokeColor: string, fillColor: string | undefined, thickness: number, fill: boolean) => {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = thickness
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (fill && fillColor) {
      ctx.fillStyle = fillColor
    }

    switch (type) {
      case "rectangle":
        const width = end.x - start.x
        const height = end.y - start.y
        if (fill && fillColor) {
          ctx.fillRect(start.x, start.y, width, height)
        }
        ctx.strokeRect(start.x, start.y, width, height)
        break

      case "circle":
        const centerX = (start.x + end.x) / 2
        const centerY = (start.y + end.y) / 2
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) / 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        if (fill && fillColor) {
          ctx.fill()
        }
        ctx.stroke()
        break

      case "line":
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        break
    }
  }, [])

  const eraseAtPoint = useCallback(
    (point: { x: number; y: number }) => {
      const eraseRadius = thickness * 2
      const updatedDrawings = drawings.filter((drawing) => {
        if (drawing.type === "freehand" || !drawing.type) {
          // Original logic for freehand drawings
          const isWithinEraseArea = drawing.points.some((drawPoint) => {
            const distance = Math.sqrt(Math.pow(drawPoint.x - point.x, 2) + Math.pow(drawPoint.y - point.y, 2))
            return distance <= eraseRadius
          })
          return !isWithinEraseArea
        } else if (drawing.startPoint && drawing.endPoint) {
          // Logic for geometric shapes
          const { startPoint, endPoint } = drawing

          switch (drawing.type) {
            case "rectangle":
              // Check if point is within rectangle bounds
              const minX = Math.min(startPoint.x, endPoint.x)
              const maxX = Math.max(startPoint.x, endPoint.x)
              const minY = Math.min(startPoint.y, endPoint.y)
              const maxY = Math.max(startPoint.y, endPoint.y)
              return !(point.x >= minX - eraseRadius && point.x <= maxX + eraseRadius &&
                point.y >= minY - eraseRadius && point.y <= maxY + eraseRadius)

            case "circle":
              // Check if point is within circle
              const centerX = (startPoint.x + endPoint.x) / 2
              const centerY = (startPoint.y + endPoint.y) / 2
              const radius = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)) / 2
              const distanceToCenter = Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2))
              return !(distanceToCenter <= radius + eraseRadius)

            case "line":
              // Check if point is close to line
              const A = endPoint.y - startPoint.y
              const B = startPoint.x - endPoint.x
              const C = A * startPoint.x + B * startPoint.y
              const distance = Math.abs(A * point.x + B * point.y - C) / Math.sqrt(A * A + B * B)
              return !(distance <= eraseRadius)

            default:
              return true
          }
        }
        return true
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
      } else if (mode === "shapes") {
        setIsDrawingShape(true)
        setShapeStartPoint(coords)
        setPreviewShape({ start: coords, end: coords })
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

      if (mode === "shapes" && isDrawingShape && shapeStartPoint) {
        const coords = getCanvasCoordinates(e)
        setPreviewShape({ start: shapeStartPoint, end: coords })
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
    [isActive, mode, isDrawing, isDrawingShape, shapeStartPoint, currentPath, color, thickness, getCanvasCoordinates, eraseAtPoint],
  )


  const stopDrawing = useCallback(() => {
    if (mode === "eraser") {
      return
    }

    if (mode === "shapes" && isDrawingShape && shapeStartPoint && previewShape) {
      const newDrawing: Drawing = {
        id: Date.now().toString(),
        points: [], // Les formes n'utilisent pas de points
        color,
        thickness,
        type: shapeType,
        fillColor: hasFill ? fillColor : undefined,
        hasFill,
        startPoint: previewShape.start,
        endPoint: previewShape.end,
      }

      onDrawingComplete(newDrawing)
      setIsDrawingShape(false)
      setShapeStartPoint(null)
      setPreviewShape(null)
      return
    }

    if (!isDrawing || currentPath.length === 0) {
      setIsDrawing(false)
      setCurrentPath([])
      return
    }

    const newDrawing: Drawing = {
      id: Date.now().toString(),
      points: currentPath,
      color,
      thickness,
      type: "freehand",
    }

    onDrawingComplete(newDrawing)
    setIsDrawing(false)
    setCurrentPath([])
  }, [isDrawing, isDrawingShape, shapeStartPoint, previewShape, currentPath, color, thickness, shapeType, hasFill, fillColor, onDrawingComplete, mode])

  // Redraw canvas when drawings change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (!container) return

      // Set canvas size to fixed dimensions
      canvas.width = 10000
      canvas.height = 10000

      // Redraw all existing drawings
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw all saved drawings
      drawings.forEach((drawing) => {
        if (drawing.type === "freehand" || !drawing.type) {
          // Traditional freehand drawing
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
        } else if (drawing.startPoint && drawing.endPoint) {
          // Shape drawing
          drawShape(
            ctx,
            drawing.startPoint,
            drawing.endPoint,
            drawing.type,
            drawing.color,
            drawing.fillColor,
            drawing.thickness,
            drawing.hasFill || false
          )
        }
      })

      // Draw preview shape if currently drawing
      if (previewShape && mode === "shapes") {
        ctx.save()
        ctx.globalAlpha = 0.7
        drawShape(
          ctx,
          previewShape.start,
          previewShape.end,
          shapeType,
          color,
          hasFill ? fillColor : undefined,
          thickness,
          hasFill
        )
        ctx.restore()
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [drawings, previewShape, mode, shapeType, color, fillColor, hasFill, thickness, drawShape])

  return (
    <canvas
      ref={canvasRef}
      className="absolute z-30"
      style={{
        top: '-5000px',
        left: '-5000px',
        pointerEvents: isActive ? "auto" : "none",
        cursor: isActive
          ? mode === "eraser"
            ? "url('/icons8-eraser-30.png') 4 4, auto"
            : mode === "shapes"
              ? "crosshair"
              : "url('/icons8-brush-24.png') 8 20, auto"
          : "default",
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  )
}
