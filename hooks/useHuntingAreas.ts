import { useState, useCallback, useEffect } from 'react'
import { HuntingArea } from '@/types'
import {
  getInitialHuntingAreas,
  saveHuntingAreas,
  getSelectedAreaId,
  saveSelectedAreaId,
  incrementAreaCount,
  migrateRuneNamesToKorean
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
    const updatedAreas = areas.map(area => {
      if (area.id === areaId) {
        const updated = {
          ...area,
          count: area.count + 1,
          totalRuns: area.totalRuns + 1
        }
        analytics.trackAreaIncrement(area.name)
        return updated
      }
      return area
    })

    updateAreas(updatedAreas)
    incrementAreaCount(areaId)
  }, [areas, updateAreas])

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
    refreshAreas
  }
}