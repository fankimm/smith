import { HuntingArea, UserStats, LootRecord, AppState } from '@/types'
import { STORAGE_KEYS, POPULAR_HUNTING_AREAS } from './constants'

const isClient = typeof window !== 'undefined'

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (!isClient) return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: (key: string, value: unknown): void => {
    if (!isClient) return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove: (key: string): void => {
    if (!isClient) return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }
}

export const getInitialHuntingAreas = (): HuntingArea[] => {
  const saved = storage.get<HuntingArea[]>(STORAGE_KEYS.HUNTING_AREAS, [])

  if (saved.length === 0) {
    return POPULAR_HUNTING_AREAS
  }

  const popularIds = new Set(POPULAR_HUNTING_AREAS.map(area => area.id))
  const customAreas = saved.filter(area => !popularIds.has(area.id))

  const mergedPopular = POPULAR_HUNTING_AREAS.map(popular => {
    const savedArea = saved.find(area => area.id === popular.id)
    return savedArea ? { ...popular, ...savedArea } : popular
  })

  return [...mergedPopular, ...customAreas]
}

export const saveHuntingAreas = (areas: HuntingArea[]): void => {
  storage.set(STORAGE_KEYS.HUNTING_AREAS, areas)
}

export const getCustomAreas = (): string[] => {
  return storage.get<string[]>(STORAGE_KEYS.CUSTOM_AREAS, [])
}

export const saveCustomAreas = (areas: string[]): void => {
  storage.set(STORAGE_KEYS.CUSTOM_AREAS, areas)
}

export const getUserStats = (): UserStats => {
  return storage.get<UserStats>(STORAGE_KEYS.USER_STATS, {
    totalRuns: 0,
    totalLoot: 0,
    favoriteArea: '',
    sessionStart: Date.now(),
    lastVisit: Date.now()
  })
}

export const saveUserStats = (stats: UserStats): void => {
  storage.set(STORAGE_KEYS.USER_STATS, stats)
}

export const getSelectedAreaId = (): string | null => {
  return storage.get<string | null>(STORAGE_KEYS.SELECTED_AREA, null)
}

export const saveSelectedAreaId = (areaId: string | null): void => {
  storage.set(STORAGE_KEYS.SELECTED_AREA, areaId)
}

export const addLootRecord = (areaId: string, loot: Omit<LootRecord, 'id' | 'timestamp' | 'areaId'>): void => {
  const areas = getInitialHuntingAreas()
  const areaIndex = areas.findIndex(area => area.id === areaId)

  if (areaIndex === -1) return

  const newLootRecord: LootRecord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    areaId,
    ...loot
  }

  areas[areaIndex].loot.push(newLootRecord)
  saveHuntingAreas(areas)

  const stats = getUserStats()
  stats.totalLoot += 1
  saveUserStats(stats)
}

export const incrementAreaCount = (areaId: string): void => {
  const areas = getInitialHuntingAreas()
  const areaIndex = areas.findIndex(area => area.id === areaId)

  if (areaIndex === -1) return

  areas[areaIndex].count += 1
  areas[areaIndex].totalRuns += 1
  saveHuntingAreas(areas)

  const stats = getUserStats()
  stats.totalRuns += 1

  const areaCounts = areas.reduce((acc, area) => {
    acc[area.id] = area.totalRuns
    return acc
  }, {} as Record<string, number>)

  const favoriteAreaId = Object.entries(areaCounts).reduce((a, b) =>
    areaCounts[a[0]] > areaCounts[b[0]] ? a : b
  )[0]

  const favoriteArea = areas.find(area => area.id === favoriteAreaId)
  stats.favoriteArea = favoriteArea?.name || ''

  saveUserStats(stats)
}

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    storage.remove(key)
  })
}

// 영문 룬 이름을 한글로 변환하는 매핑
const RUNE_NAME_MIGRATION_MAP: Record<string, string> = {
  // 기존 룬 이름 마이그레이션
  '슐': '주울',
  'El': '엘',
  'Eld': '엘드',
  'Tir': '티르',
  'Nef': '네프',
  'Eth': '에드',
  'Ith': '아이드',
  'Tal': '탈',
  'Ral': '랄',
  'Ort': '오르트',
  'Thul': '주울',
  'Amn': '앰',
  'Sol': '솔',
  'Shael': '샤엘',
  'Dol': '돌',
  'Hel': '헬',
  'Io': '이오',
  'Lum': '룸',
  'Ko': '코',
  'Fal': '팔',
  'Lem': '렘',
  'Pul': '풀',
  'Um': '우움',
  'Mal': '말',
  'Ist': '이스트',
  'Gul': '굴',
  'Vex': '벡스',
  'Ohm': '옴',
  'Lo': '로',
  'Sur': '수르',
  'Ber': '베르',
  'Jah': '자',
  'Cham': '참',
  'Zod': '조드'
}

export const removeLootRecord = (areaId: string, lootId: string): void => {
  const areas = getInitialHuntingAreas()
  const areaIndex = areas.findIndex(area => area.id === areaId)

  if (areaIndex === -1) return

  areas[areaIndex].loot = areas[areaIndex].loot.filter(loot => loot.id !== lootId)
  saveHuntingAreas(areas)

  const stats = getUserStats()
  stats.totalLoot = Math.max(0, stats.totalLoot - 1)
  saveUserStats(stats)
}

export const migrateRuneNamesToKorean = (): void => {
  if (!isClient) return

  try {
    const areas = getInitialHuntingAreas()
    let hasChanges = false

    const updatedAreas = areas.map(area => {
      const updatedLoot = area.loot.map(loot => {
        if (loot.type === 'rune' && loot.name && RUNE_NAME_MIGRATION_MAP[loot.name]) {
          hasChanges = true
          return {
            ...loot,
            name: RUNE_NAME_MIGRATION_MAP[loot.name]
          }
        }
        return loot
      })

      return {
        ...area,
        loot: updatedLoot
      }
    })

    if (hasChanges) {
      console.log('Migrating rune names to Korean...')
      saveHuntingAreas(updatedAreas)
      console.log('Rune name migration completed!')
    }
  } catch (error) {
    console.error('Error during rune name migration:', error)
  }
}

export const exportData = (): string => {
  if (!isClient) return '{}'

  const data = {
    huntingAreas: storage.get(STORAGE_KEYS.HUNTING_AREAS, []),
    customAreas: storage.get(STORAGE_KEYS.CUSTOM_AREAS, []),
    userStats: storage.get(STORAGE_KEYS.USER_STATS, {}),
    selectedArea: storage.get(STORAGE_KEYS.SELECTED_AREA, null),
    exportDate: new Date().toISOString(),
    version: '1.0'
  }

  return JSON.stringify(data, null, 2)
}

export const importData = (jsonData: string): { success: boolean; message: string } => {
  if (!isClient) return { success: false, message: '클라이언트에서만 사용 가능합니다.' }

  try {
    const data = JSON.parse(jsonData)

    // 데이터 유효성 검사
    if (!data.huntingAreas || !Array.isArray(data.huntingAreas)) {
      return { success: false, message: '유효하지 않은 데이터 형식입니다.' }
    }

    // 백업 생성
    const backup = {
      huntingAreas: storage.get(STORAGE_KEYS.HUNTING_AREAS, []),
      customAreas: storage.get(STORAGE_KEYS.CUSTOM_AREAS, []),
      userStats: storage.get(STORAGE_KEYS.USER_STATS, {}),
      selectedArea: storage.get(STORAGE_KEYS.SELECTED_AREA, null)
    }

    storage.set('BACKUP_' + Date.now(), backup)

    // 데이터 가져오기
    if (data.huntingAreas) storage.set(STORAGE_KEYS.HUNTING_AREAS, data.huntingAreas)
    if (data.customAreas) storage.set(STORAGE_KEYS.CUSTOM_AREAS, data.customAreas)
    if (data.userStats) storage.set(STORAGE_KEYS.USER_STATS, data.userStats)
    if (data.selectedArea !== undefined) storage.set(STORAGE_KEYS.SELECTED_AREA, data.selectedArea)

    return { success: true, message: '데이터를 성공적으로 가져왔습니다!' }
  } catch (error) {
    return { success: false, message: 'JSON 파싱 오류: ' + (error as Error).message }
  }
}