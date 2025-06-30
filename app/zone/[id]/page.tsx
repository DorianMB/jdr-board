"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { loadAppData } from "@/lib/storage"
import ZoneEditor from "@/components/zone-editor"
import type { Zone } from "@/lib/types"
import { useLanguage } from "@/hooks/use-language"
import { LanguageToggle } from "@/components/language-toggle"

export default function ZonePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [zone, setZone] = useState<Zone | null>(null)
  const [loading, setLoading] = useState(true)

  const isEditMode = searchParams.get("edit") === "true"

  useEffect(() => {
    const data = loadAppData()
    const foundZone = data.zones.find((z) => z.id === params.id)

    if (foundZone) {
      // Ensure zone has all required properties with defaults
      const normalizedZone: Zone = {
        id: foundZone.id,
        name: foundZone.name,
        gridSize: foundZone.gridSize || 50,
        gridColor: foundZone.gridColor || "#000000",
        gridOpacity: foundZone.gridOpacity ?? 0.3,
        backgroundColor: foundZone.backgroundColor || "#ffffff",
        backgroundImage: foundZone.backgroundImage
          ? {
            url: foundZone.backgroundImage.url,
            x: foundZone.backgroundImage.x || 0,
            y: foundZone.backgroundImage.y || 0,
            width: foundZone.backgroundImage.width || 800,
            height: foundZone.backgroundImage.height || 600,
            rotation: foundZone.backgroundImage.rotation || 0,
          }
          : null,
        tokens: foundZone.tokens || [],
        drawings: foundZone.drawings || [],
      }
      setZone(normalizedZone)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>{t('loadingZone')}</p>
        </div>
        <LanguageToggle />
      </div>
    )
  }

  if (!zone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('zoneNotFound')}</h1>
          <p className="text-gray-600">{t('zoneNotFoundMessage')}</p>
        </div>
        <LanguageToggle />
      </div>
    )
  }

  return (
    <>
      <ZoneEditor zone={zone} editMode={isEditMode} />
      <LanguageToggle />
    </>
  )
}
