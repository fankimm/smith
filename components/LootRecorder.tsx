'use client'

import { useState } from 'react'
import { RUNES } from '@/lib/constants'
import { addLootRecord } from '@/lib/storage'
import { analytics } from '@/lib/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Gem, Diamond, Star, Crown, Sparkles } from 'lucide-react'

interface LootRecorderProps {
  areaId: string
  areaName: string
  onLootAdded: () => void
}

export default function LootRecorder({ areaId, areaName, onLootAdded }: LootRecorderProps) {
  const [clickedRune, setClickedRune] = useState<number | null>(null)

  const basicRunes = RUNES.slice(0, 21)
  const highRunes = RUNES.slice(21)

  const getRuneIcon = (level: number) => {
    if (level >= 30) return Crown // 최고급 룬 (30-33번)
    if (level >= 26) return Sparkles // 고급 룬 (26-29번)
    if (level >= 22) return Diamond // 중급 고급 룬 (22-25번)
    if (level >= 16) return Star // 중급 룬 (16-21번)
    return Gem // 기본 룬 (1-15번)
  }

  const handleRuneClick = (rune: typeof RUNES[0]) => {
    // 클릭된 룬 피드백 표시
    setClickedRune(rune.id)

    addLootRecord(areaId, {
      type: 'rune',
      name: rune.name,
      runeLevel: rune.level
    })

    analytics.trackLootRecord('rune', rune.name, areaName)
    onLootAdded()

    // 500ms 후 피드백 상태 초기화
    setTimeout(() => {
      setClickedRune(null)
    }, 500)
  }



  return (
    <Card className="border-border">
      <CardHeader className="pb-6">
        <CardTitle className="text-lg font-semibold tracking-tight">
          전리품 기록 - {areaName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium leading-none">기본 룬 (1-21번)</h4>
            <p className="text-xs text-muted-foreground">
              클릭하여 룬을 추가하세요
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {basicRunes.map((rune) => {
              const isClicked = clickedRune === rune.id
              const IconComponent = getRuneIcon(rune.level)
              return (
                <Button
                  key={rune.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRuneClick(rune)}
                  className={`h-10 font-medium transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-1 px-1 ${
                    isClicked
                      ? 'border-green-500/40 bg-green-500/20 text-green-700 hover:bg-green-500/25'
                      : 'border-amber-500/20 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 hover:border-amber-500/40'
                  }`}
                  title={`${rune.name} (${rune.englishName}) - ${rune.level}번 룬`}
                >
                  <IconComponent className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs leading-none">{rune.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium leading-none">고급 룬 (22-33번)</h4>
            <p className="text-xs text-muted-foreground">
              클릭하여 룬을 추가하세요
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {highRunes.map((rune) => {
              const isClicked = clickedRune === rune.id
              const IconComponent = getRuneIcon(rune.level)
              return (
                <Button
                  key={rune.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRuneClick(rune)}
                  className={`h-10 font-medium transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-1 px-1 ${
                    isClicked
                      ? 'border-green-500/40 bg-green-500/20 text-green-700 hover:bg-green-500/25'
                      : 'border-purple-500/20 bg-purple-500/5 text-purple-600 hover:bg-purple-500/10 hover:border-purple-500/40'
                  }`}
                  title={`${rune.name} (${rune.englishName}) - ${rune.level}번 룬`}
                >
                  <IconComponent className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs leading-none">{rune.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}