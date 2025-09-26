import { useState, useCallback, useEffect } from 'react'
import { HuntingArea } from '@/types'
import {
  getInitialHuntingAreas,
  saveHuntingAreas,
  getSelectedAreaId,
  saveSelectedAreaId,
  incrementAreaCount,
  migrateRuneNamesToKorean,
  addLootRecord
} from '@/lib/storage'
import { analytics } from '@/lib/analytics'
import { useHydrated } from './useHydrated'
import { POPULAR_HUNTING_AREAS } from '@/lib/constants'

export const useHuntingAreas = () => {
  const hydrated = useHydrated()
  const [areas, setAreas] = useState<HuntingArea[]>(POPULAR_HUNTING_AREAS)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)

  useEffect(() => {
    if (hydrated) {
      // 기존 데이터를 한글로 마이그레이션
      migrateRuneNamesToKorean()

      const initialAreas = getInitialHuntingAreas()
      const selectedId = getSelectedAreaId()
      setAreas(initialAreas)
      setSelectedAreaId(selectedId)
    }
  }, [hydrated])

  const updateAreas = useCallback((newAreas: HuntingArea[]) => {
    setAreas(newAreas)
    saveHuntingAreas(newAreas)
  }, [])

  const selectArea = useCallback((areaId: string | null) => {
    setSelectedAreaId(areaId)
    saveSelectedAreaId(areaId)

    if (areaId) {
      const area = areas.find(a => a.id === areaId)
      if (area) {
        analytics.trackAreaSelect(area.name)
      }
    }
  }, [areas])

  const incrementCount = useCallback((areaId: string) => {
    console.log('🔄 incrementCount 호출됨 - areaId:', areaId)

    // 먼저 로컬 스토리지를 업데이트
    console.log('💾 incrementAreaCount 호출 전')
    incrementAreaCount(areaId)
    console.log('💾 incrementAreaCount 호출 완료')

    // 그 다음 최신 데이터를 불러와서 로컬 상태 업데이트
    console.log('🔄 최신 데이터로 상태 업데이트 시작')
    const updatedAreas = getInitialHuntingAreas()
    setAreas(updatedAreas)
    console.log('✅ incrementCount 완료')

    // 분석 추적
    const area = updatedAreas.find(a => a.id === areaId)
    if (area) {
      analytics.trackAreaIncrement(area.name)
    }
  }, [hydrated])

  const addCustomArea = useCallback((name: string) => {
    const newArea: HuntingArea = {
      id: `custom-${Date.now()}`,
      name,
      category: 'custom',
      count: 0,
      totalRuns: 0,
      loot: []
    }

    const updatedAreas = [...areas, newArea]
    updateAreas(updatedAreas)
    analytics.trackCustomAreaAdd(name)

    return newArea.id
  }, [areas, updateAreas])

  const resetAreaCount = useCallback((areaId: string) => {
    const updatedAreas = areas.map(area =>
      area.id === areaId ? { ...area, count: 0 } : area
    )
    updateAreas(updatedAreas)
  }, [areas, updateAreas])

  const removeCustomArea = useCallback((areaId: string) => {
    const updatedAreas = areas.filter(area => area.id !== areaId)
    updateAreas(updatedAreas)

    if (selectedAreaId === areaId) {
      selectArea(null)
    }
  }, [areas, selectedAreaId, updateAreas, selectArea])

  const refreshAreas = useCallback(() => {
    if (hydrated) {
      const loadedAreas = getInitialHuntingAreas()
      setAreas(loadedAreas)
    }
  }, [hydrated])

  const addLootToArea = useCallback((areaId: string, loot: { type: 'rune' | 'key' | 'item'; name: string; runeLevel?: number; keyType?: 'terror' | 'hate' | 'destruction' }) => {
    console.log('🎯 addLootToArea 호출됨 - areaId:', areaId, 'loot:', loot)

    // 로컬 스토리지에 저장
    console.log('💾 addLootRecord 호출 전')
    addLootRecord(areaId, loot)
    console.log('💾 addLootRecord 호출 완료')

    // 로컬 상태 업데이트 - 로컬 스토리지 업데이트 후 다시 불러오기
    console.log('🔄 getInitialHuntingAreas 호출 전')
    const updatedAreas = getInitialHuntingAreas()
    console.log('🔄 getInitialHuntingAreas 호출 완료, areas 업데이트 중')
    setAreas(updatedAreas)
    console.log('✅ addLootToArea 완료')
  }, [hydrated])


  const selectedArea = selectedAreaId ? areas.find(area => area.id === selectedAreaId) : null

  return {
    areas,
    selectedArea,
    selectedAreaId,
    selectArea,
    incrementCount,
    addCustomArea,
    resetAreaCount,
    removeCustomArea,
    refreshAreas,
    addLootToArea
  }
}