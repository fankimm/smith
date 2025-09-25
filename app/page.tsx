'use client'

import { useState } from 'react'
import { useHuntingAreas } from '@/hooks/useHuntingAreas'
import HuntingAreaCard from '@/components/HuntingAreaCard'
import LootRecorder from '@/components/LootRecorder'
import CustomAreaForm from '@/components/CustomAreaForm'
import StatsPanel from '@/components/StatsPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Clock, X } from 'lucide-react'
import { removeLootRecord } from '@/lib/storage'

export default function Home() {
  const {
    areas,
    selectedArea,
    selectArea,
    incrementCount,
    addCustomArea,
    resetAreaCount,
    removeCustomArea,
    refreshAreas
  } = useHuntingAreas()

  const [isAddingCustomArea, setIsAddingCustomArea] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

  const popularAreas = areas.filter(area => area.category === 'popular')
  const customAreas = areas.filter(area => area.category === 'custom')

  const handleAddCustomArea = (name: string) => {
    const newAreaId = addCustomArea(name)
    selectArea(newAreaId)
  }

  const handleLootAdded = () => {
    refreshAreas()
    setForceUpdate(prev => prev + 1)
  }

  const handleDataCleared = () => {
    refreshAreas()
    setForceUpdate(prev => prev + 1)
  }

  return (
    <div className="flex-1 space-y-8 p-6 pt-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            D2R Counter
          </h1>
          <p className="text-muted-foreground">
            디아블로 2 레저렉션 사냥터 카운터
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">인기 사냥터</h2>
              <Badge variant="secondary">{popularAreas.length}개</Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularAreas.map((area) => (
                <HuntingAreaCard
                  key={area.id}
                  area={area}
                  isSelected={selectedArea?.id === area.id}
                  onSelect={() => selectArea(area.id)}
                  onIncrement={() => incrementCount(area.id)}
                  onReset={() => resetAreaCount(area.id)}
                />
              ))}
            </div>
          </div>

          {customAreas.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">커스텀 사냥터</h2>
                <Badge variant="outline">{customAreas.length}개</Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {customAreas.map((area) => (
                  <HuntingAreaCard
                    key={area.id}
                    area={area}
                    isSelected={selectedArea?.id === area.id}
                    onSelect={() => selectArea(area.id)}
                    onIncrement={() => incrementCount(area.id)}
                    onReset={() => resetAreaCount(area.id)}
                    onRemove={() => removeCustomArea(area.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <Button
              onClick={() => setIsAddingCustomArea(true)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              커스텀 사냥터 추가
            </Button>
          </div>

          {selectedArea && (
            <>
              <Separator />
              <LootRecorder
                areaId={selectedArea.id}
                areaName={selectedArea.name}
                onLootAdded={handleLootAdded}
              />
            </>
          )}

          {selectedArea && selectedArea.loot.filter(loot => loot.type === 'rune' || loot.type === 'key').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedArea.name} - 전리품 목록
                  <Badge variant="secondary">{selectedArea.loot.filter(loot => loot.type === 'rune' || loot.type === 'key').length}개</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[...selectedArea.loot]
                    .filter(loot => loot.type === 'rune' || loot.type === 'key')
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((loot) => (
                      <div
                        key={loot.id}
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors group"
                        onClick={() => {
                          removeLootRecord(selectedArea.id, loot.id)
                          handleLootAdded()
                        }}
                        title="클릭하여 삭제"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={loot.type === 'rune' ? 'default' : loot.type === 'key' ? 'destructive' : 'outline'}>
                            {loot.type === 'rune' ? '룬' : loot.type === 'key' ? '열쇠' : '아이템'}
                          </Badge>
                          <span className="font-medium">
                            {loot.name}
                          </span>
                          {loot.type === 'rune' && loot.runeLevel && (
                            <span className="text-xs text-amber-500">
                              ({loot.runeLevel}번)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(loot.timestamp).toLocaleTimeString()}
                          </div>
                          <X className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <StatsPanel areas={areas} onDataCleared={handleDataCleared} />
        </div>
      </div>

      <CustomAreaForm
        isOpen={isAddingCustomArea}
        onClose={() => setIsAddingCustomArea(false)}
        onAdd={handleAddCustomArea}
      />
    </div>
  )
}