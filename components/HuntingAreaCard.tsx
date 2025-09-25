'use client'

import { HuntingArea } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHydrated } from '@/hooks/useHydrated'

interface HuntingAreaCardProps {
  area: HuntingArea
  isSelected: boolean
  onSelect: () => void
  onIncrement: () => void
  onReset: () => void
  onRemove?: () => void
}

export default function HuntingAreaCard({
  area,
  isSelected,
  onSelect,
  onIncrement,
  onReset,
  onRemove
}: HuntingAreaCardProps) {
  const hydrated = useHydrated()
  return (
    <Card
      className={cn(
        "group relative cursor-pointer transition-all duration-200 hover:border-accent-foreground/20",
        "border-border bg-card hover:bg-accent/50",
        isSelected && "border-primary bg-accent ring-1 ring-primary/20"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-base font-semibold leading-none tracking-tight">
              {area.name}
            </div>
            {area.category === 'custom' && (
              <Badge variant="secondary" className="h-5 text-xs font-medium">
                커스텀
              </Badge>
            )}
          </div>

          {area.category === 'custom' && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                if (!hydrated) return
                if (window.confirm(`"${area.name}" 사냥터를 삭제하시겠습니까?`)) {
                  onRemove()
                }
              }}
              className="h-6 w-6 p-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">현재 세션</span>
            <span className="text-2xl font-bold tabular-nums">{area.count}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">총 런 수</span>
            <span className="font-medium tabular-nums">{area.totalRuns}</span>
          </div>

          {area.loot.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">전리품</span>
              <Badge variant="outline" className="h-5 border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20">
                {area.loot.length}개
              </Badge>
            </div>
          )}
        </div>

        {isSelected && (
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={onIncrement}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              런 추가
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                if (!hydrated) return
                if (window.confirm(`"${area.name}"의 현재 세션 카운트를 초기화하시겠습니까?`)) {
                  onReset()
                }
              }}
              className="h-9 w-9 p-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}