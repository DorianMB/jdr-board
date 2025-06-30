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
  type?: "freehand" | "rectangle" | "circle" | "line"
  fillColor?: string
  hasFill?: boolean
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
}

export interface AppData {
  zones: Zone[]
  characters: Character[]
}

export interface HistoryState {
  drawings: Drawing[]
  tokens: Token[]
}

// Fonction utilitaire pour calculer le numéro des tokens dupliqués
export function getTokenNumber(tokens: Token[], currentToken: Token, characters: Character[]): number | null {
  // Récupérer le personnage du token actuel
  const currentCharacter = characters.find(c => c.id === currentToken.characterId)
  if (!currentCharacter) return null

  // Filtrer les tokens ayant le même personnage
  const sameCharacterTokens = tokens.filter(token => {
    const character = characters.find(c => c.id === token.characterId)
    return character && character.name === currentCharacter.name && character.type === currentCharacter.type
  })

  // Si il n'y a qu'un seul token de ce personnage, pas besoin de numéro
  if (sameCharacterTokens.length <= 1) return null

  // Trier les tokens par ordre de création (id) pour avoir une numérotation cohérente
  sameCharacterTokens.sort((a, b) => parseInt(a.id) - parseInt(b.id))

  // Retourner la position (index + 1) du token actuel
  return sameCharacterTokens.findIndex(token => token.id === currentToken.id) + 1
}

// Fonction utilitaire pour obtenir le nom d'affichage d'un token
export function getTokenDisplayName(token: Token, characters: Character[], allTokens: Token[]): string {
  const character = characters.find(c => c.id === token.characterId)
  if (!character) return "Unknown"

  const tokenNumber = getTokenNumber(allTokens, token, characters)
  return tokenNumber ? `${character.name} (${tokenNumber})` : character.name
}
