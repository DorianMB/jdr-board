import type { AppData } from "./types"

const STORAGE_KEY = "virtual-tabletop-data"

export function loadAppData(): AppData {
  if (typeof window === "undefined") {
    return { zones: [], characters: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error)
  }

  return { zones: [], characters: [] }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving data to localStorage:", error)
  }
}

export function exportData(): void {
  const data = loadAppData()
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(dataBlob)
  link.download = `virtual-tabletop-export-${new Date().toISOString().split("T")[0]}.json`
  link.click()
}

export function importData(file: File, onSuccess: (data: AppData) => void): void {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      saveAppData(data)
      onSuccess(data)
    } catch (error) {
      console.error("Error importing data:", error)
      alert("Error importing data. Please check the file format.")
    }
  }
  reader.readAsText(file)
}
