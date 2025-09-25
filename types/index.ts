export interface HuntingArea {
  id: string
  name: string
  category: 'popular' | 'custom'
  count: number
  totalRuns: number
  loot: LootRecord[]
}

export interface RuneData {
  id: number
  name: string
  level: number
  englishName?: string
}

export interface LootRecord {
  id: string
  type: 'rune' | 'key' | 'item'
  name: string
  runeLevel?: number
  keyType?: 'terror' | 'hate' | 'destruction'
  timestamp: number
  areaId: string
}

export interface UserStats {
  totalRuns: number
  totalLoot: number
  favoriteArea: string
  sessionStart: number
  lastVisit: number
}

export interface AppState {
  huntingAreas: HuntingArea[]
  selectedAreaId: string | null
  userStats: UserStats
  customAreas: string[]
}