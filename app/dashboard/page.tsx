'use client'

import { useHuntingAreas } from '@/hooks/useHuntingAreas'
import { useHydrated } from '@/hooks/useHydrated'
import { getUserStats } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AreaRunsChart } from '@/components/charts/AreaRunsChart'
import { LootTypeChart } from '@/components/charts/LootTypeChart'
import { RuneCollectionChart } from '@/components/charts/RuneCollectionChart'
import {
  Activity,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Timer,
  Gift,
  Zap
} from 'lucide-react'

export default function Dashboard() {
  const hydrated = useHydrated()
  const { areas } = useHuntingAreas()

  if (!hydrated) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = getUserStats()

  const totalSessionRuns = areas.reduce((sum, area) => sum + area.count, 0)
  const totalLootItems = areas.reduce((sum, area) => sum + area.loot.length, 0)
  const totalAreas = areas.length
  const customAreas = areas.filter(area => area.category === 'custom').length

  const mostActiveArea = areas.reduce((prev, current) =>
    (current.totalRuns > prev.totalRuns) ? current : prev
  , areas[0] || null)

  const mostRecentLoot = areas
    .flatMap(area => area.loot
      .filter(loot => loot.type === 'rune')
      .map(loot => ({ ...loot, areaName: area.name }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)

  const highestRunArea = areas.reduce((prev, current) =>
    (current.count > prev.count) ? current : prev
  , areas[0] || null)

  const totalRunes = areas.flatMap(area => area.loot).filter(item => item.type === 'rune').length
  const highRunes = areas.flatMap(area => area.loot).filter(item =>
    item.type === 'rune' && item.runeLevel && item.runeLevel >= 22
  ).length

  return (
    <div className="flex-1 space-y-8 p-6 pt-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          통계 대시보드
        </h1>
        <p className="text-muted-foreground">
          사냥터별 활동 현황과 전리품 통계를 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium tracking-tight">현재 세션 런</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{totalSessionRuns}</div>
            <p className="text-xs text-muted-foreground mt-1">
              이번 세션에서 진행한 런 수
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium tracking-tight">총 런 수</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{stats.totalRuns}</div>
            <p className="text-xs text-muted-foreground mt-1">
              지금까지 진행한 모든 런 수
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium tracking-tight">전리품 총합</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums text-green-600">{totalLootItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              획득한 모든 전리품 개수
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium tracking-tight">등록된 사냥터</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{totalAreas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              커스텀 {customAreas}개 포함
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold tracking-tight">사냥터별 런 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaRunsChart areas={areas} />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold tracking-tight">전리품 타입 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <LootTypeChart areas={areas} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">획득한 룬 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <RuneCollectionChart areas={areas} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Trophy className="h-5 w-5" />
              주요 통계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mostActiveArea && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">가장 많이 간 사냥터</span>
                <div className="text-right space-y-1">
                  <div className="font-semibold text-sm">{mostActiveArea.name}</div>
                  <Badge variant="secondary" className="h-5 text-xs">
                    {mostActiveArea.totalRuns}회
                  </Badge>
                </div>
              </div>
            )}

            <Separator className="bg-border" />

            {highestRunArea && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">현재 세션 최고</span>
                <div className="text-right space-y-1">
                  <div className="font-semibold text-sm">{highestRunArea.name}</div>
                  <Badge variant="outline" className="h-5 text-xs">
                    {highestRunArea.count}회
                  </Badge>
                </div>
              </div>
            )}

            <Separator className="bg-border" />

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold tabular-nums text-amber-600">{totalRunes}</div>
                <div className="text-xs text-muted-foreground">총 룬 개수</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold tabular-nums text-orange-600">{highRunes}</div>
                <div className="text-xs text-muted-foreground">고급 룬</div>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              마지막 방문: {new Date(stats.lastVisit).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Timer className="h-5 w-5" />
              최근 룬
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostRecentLoot.length > 0 ? (
                mostRecentLoot.map((loot) => (
                  <div
                    key={loot.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={loot.type === 'rune' ? 'default' : 'outline'}
                        className="h-5 text-xs font-medium"
                      >
                        {loot.type === 'rune' ? '룬' : '아이템'}
                      </Badge>
                      <div className="space-y-1">
                        <div className="font-medium text-sm leading-none">{loot.name}</div>
                        <div className="text-xs text-muted-foreground">{loot.areaName}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {new Date(loot.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Zap className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    아직 기록된 룬이 없습니다
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    사냥터를 선택하고 룬을 추가해보세요
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}