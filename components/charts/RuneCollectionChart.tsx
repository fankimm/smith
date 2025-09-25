'use client'

import { HuntingArea } from '@/types'
import { RUNES } from '@/lib/constants'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RuneCollectionChartProps {
  areas: HuntingArea[]
}

export function RuneCollectionChart({ areas }: RuneCollectionChartProps) {
  // 모든 룬의 드롭 수를 계산
  const runeData = RUNES.map(rune => {
    const count = areas
      .flatMap(area => area.loot)
      .filter(loot => loot.type === 'rune' && loot.runeLevel === rune.level)
      .length

    return {
      name: rune.name,
      level: rune.level,
      count,
      isHighRune: rune.level >= 22
    }
  }).filter(rune => rune.count > 0) // 드롭된 룬만 표시

  if (runeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm text-muted-foreground">
            아직 획득한 룬이 없습니다
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            룬을 기록하면 여기에 통계가 표시됩니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={runeData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'calc(var(--radius) - 2px)',
              color: 'hsl(var(--popover-foreground))',
            }}
            formatter={(value, name) => [
              `${value}개`,
              '획득 수량'
            ]}
            labelFormatter={(label) => {
              const rune = runeData.find(r => r.name === label)
              return `${label} (${rune?.level}번 룬)`
            }}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}