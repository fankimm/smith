import { HuntingArea, RuneData } from '@/types'

export const POPULAR_HUNTING_AREAS: HuntingArea[] = [
  {
    id: 'ancient-tunnels',
    name: '고대의 터널',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'mephisto',
    name: '메피스토',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'diablo',
    name: '디아블로',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'baal',
    name: '바알',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'chaos-sanctuary',
    name: '혼돈의 성역',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'worldstone-keep',
    name: '세계석 요새',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'countess',
    name: '백작부인',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'andariel',
    name: '안다리엘',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'cow-level',
    name: '소 레벨',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  },
  {
    id: 'pindleskin',
    name: '핀들스킨',
    category: 'popular',
    count: 0,
    totalRuns: 0,
    loot: []
  }
]

export const RUNES: RuneData[] = [
  { id: 1, name: '엘', level: 1, englishName: 'El' },
  { id: 2, name: '엘드', level: 2, englishName: 'Eld' },
  { id: 3, name: '티르', level: 3, englishName: 'Tir' },
  { id: 4, name: '네프', level: 4, englishName: 'Nef' },
  { id: 5, name: '에드', level: 5, englishName: 'Eth' },
  { id: 6, name: '아이드', level: 6, englishName: 'Ith' },
  { id: 7, name: '탈', level: 7, englishName: 'Tal' },
  { id: 8, name: '랄', level: 8, englishName: 'Ral' },
  { id: 9, name: '오르트', level: 9, englishName: 'Ort' },
  { id: 10, name: '주울', level: 10, englishName: 'Thul' },
  { id: 11, name: '앰', level: 11, englishName: 'Amn' },
  { id: 12, name: '솔', level: 12, englishName: 'Sol' },
  { id: 13, name: '샤엘', level: 13, englishName: 'Shael' },
  { id: 14, name: '돌', level: 14, englishName: 'Dol' },
  { id: 15, name: '헬', level: 15, englishName: 'Hel' },
  { id: 16, name: '이오', level: 16, englishName: 'Io' },
  { id: 17, name: '룸', level: 17, englishName: 'Lum' },
  { id: 18, name: '코', level: 18, englishName: 'Ko' },
  { id: 19, name: '팔', level: 19, englishName: 'Fal' },
  { id: 20, name: '렘', level: 20, englishName: 'Lem' },
  { id: 21, name: '풀', level: 21, englishName: 'Pul' },
  { id: 22, name: '우움', level: 22, englishName: 'Um' },
  { id: 23, name: '말', level: 23, englishName: 'Mal' },
  { id: 24, name: '이스트', level: 24, englishName: 'Ist' },
  { id: 25, name: '굴', level: 25, englishName: 'Gul' },
  { id: 26, name: '벡스', level: 26, englishName: 'Vex' },
  { id: 27, name: '옴', level: 27, englishName: 'Ohm' },
  { id: 28, name: '로', level: 28, englishName: 'Lo' },
  { id: 29, name: '수르', level: 29, englishName: 'Sur' },
  { id: 30, name: '베르', level: 30, englishName: 'Ber' },
  { id: 31, name: '자', level: 31, englishName: 'Jah' },
  { id: 32, name: '참', level: 32, englishName: 'Cham' },
  { id: 33, name: '조드', level: 33, englishName: 'Zod' }
]

export const STORAGE_KEYS = {
  HUNTING_AREAS: 'D2R_HUNTING_AREAS',
  CUSTOM_AREAS: 'D2R_CUSTOM_AREAS',
  USER_STATS: 'D2R_USER_STATS',
  SELECTED_AREA: 'D2R_SELECTED_AREA'
} as const