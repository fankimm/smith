'use client'

import { useCallback } from 'react'
import { HuntingArea } from '@/types'
import { getUserStats, clearAllData } from '@/lib/storage'
import { useHydrated } from '@/hooks/useHydrated'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trash2 } from 'lucide-react'

interface StatsPanelProps {
  areas: HuntingArea[]
  onDataCleared: () => void
}

export default function StatsPanel({ areas, onDataCleared }: StatsPanelProps) {
  const hydrated = useHydrated()

  const stats = hydrated ? getUserStats() : {
    totalRuns: 0,
    totalLoot: 0,
    favoriteArea: '',
    sessionStart: Date.now(),
    lastVisit: Date.now()
  }

  const totalSessionRuns = areas.reduce((sum, area) => sum + area.count, 0)
  const totalLootItems = areas.reduce((sum, area) => sum + area.loot.length, 0)

  const mostActiveArea = areas.length > 0 ? areas.reduce((prev, current) =>
    (current.totalRuns > prev.totalRuns) ? current : prev
  ) : null

  const handleClearData = useCallback(() => {
    if (!hydrated) return
    if (window.confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      clearAllData()
      onDataCleared()
      window.location.reload()
    }
  }, [hydrated, onDataCleared])

  return (
    <Card className="border-border">
      <CardHeader className="pb-6">
        <CardTitle className="text-lg font-semibold tracking-tight">통계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hydrated ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold tabular-nums">{totalSessionRuns}</div>
              <div className="text-xs text-muted-foreground">현재 세션 런</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold tabular-nums text-green-600">{totalLootItems}</div>
              <div className="text-xs text-muted-foreground">전리품 총 개수</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold tabular-nums">{stats.totalRuns}</div>
              <div className="text-xs text-muted-foreground">총 런 수</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold tabular-nums">{areas.length}</div>
              <div className="text-xs text-muted-foreground">등록된 사냥터</div>
            </div>
          </div>
        )}

        {hydrated && mostActiveArea && (
          <>
            <Separator className="bg-border" />
            <div className="space-y-3">
              <div className="text-sm font-medium leading-none">가장 많이 간 사냥터</div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{mostActiveArea.name}</span>
                <Badge variant="secondary" className="h-5 text-xs">
                  {mostActiveArea.totalRuns}회
                </Badge>
              </div>
            </div>
          </>
        )}

        {hydrated && (
          <>
            <Separator className="bg-border" />

            <div className="text-xs text-muted-foreground text-center">
              마지막 방문: {new Date(stats.lastVisit).toLocaleDateString()}
            </div>

            <Button
              variant="destructive"
              onClick={handleClearData}
              className="w-full h-9"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              모든 데이터 초기화
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}