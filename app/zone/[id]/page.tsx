"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import ZoneEditor from "@/components/zone-editor"
import type { Zone } from "@/lib/types"
import { loadAppData } from "@/lib/storage"

export default function ZonePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [zone, setZone] = useState<Zone | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = searchParams.get("edit") === "true"

  useEffect(() => {
    try {
      const data = loadAppData()
      const foundZone = data.zones.find((z) => z.id === params.id)

      if (foundZone) {
        // Ensure the zone has all required properties with defaults
        const normalizedZone: Zone = {
          id: foundZone.id,
          name: foundZone.name || "Untitled Zone",
          gridSize: foundZone.gridSize || 50,
          gridColor: foundZone.gridColor || "#000000",
          gridOpacity: foundZone.gridOpacity ?? 0.3,
          backgroundColor: foundZone.backgroundColor || "#ffffff",
          backgroundImage: foundZone.backgroundImage || null,
          tokens: foundZone.tokens || [],
          drawings: foundZone.drawings || [],
        }
        setZone(normalizedZone)
      } else {
        setError("Zone not found")
      }
    } catch (err) {
      console.error("Error loading zone:", err)
      setError("Error loading zone data")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-white mb-2">Loading Zone...</h1>
          <p className="text-gray-400">Please wait while we load your zone.</p>
        </div>
      </div>
    )
  }

  if (error || !zone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Zone Not Found</h1>
          <p className="text-gray-400 mb-4">{error || "The requested zone could not be found."}</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return <ZoneEditor zone={zone} editMode={isEditMode} />
}
