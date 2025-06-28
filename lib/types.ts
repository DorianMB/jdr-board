export interface Zone {
  id: string
  name: string
  gridSize: number
  gridColor: string
  gridOpacity: number
  backgroundColor: string
  backgroundImage: {
    url: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
  } | null
  tokens: Token[]
  drawings: Drawing[]
}

export interface Character {
  id: string
  name: string
  type: "player" | "ally" | "enemy"
  imageUrl: string
}

export interface Token {
  id: string
  characterId: string
  x: number
  y: number
  gridX: number
  gridY: number
  isDead?: boolean
}

export interface Drawing {
  id: string
  points: { x: number; y: number }[]
  color: string
  thickness: number
}

export interface AppData {
  zones: Zone[]
  characters: Character[]
}

export interface HistoryState {
  drawings: Drawing[]
  tokens: Token[]
}
