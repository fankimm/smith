'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HuntingArea } from '@/types'

interface RuneLevelChartProps {
  areas: HuntingArea[]
}

export function RuneLevelChart({ areas }: RuneLevelChartProps) {
  const allRunes = areas.flatMap(area =>
    area.loot.filter(item => item.type === 'rune' && item.runeLevel)
  )

  const runeLevelCounts = allRunes.reduce((acc, rune) => {
    const level = rune.runeLevel!
    const tier = level <= 15 ? '기본 (1-15)' :
                level <= 25 ? '중급 (16-25)' :
                '고급 (26-33)'
    acc[tier] = (acc[tier] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(runeLevelCounts).map(([tier, count]) => ({
    tier,
    count
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="tier" fontSize={12} className="text-muted-foreground" />
        <YAxis fontSize={12} className="text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Bar dataKey="count" fill="#f59e0b" name="룬 개수" />
      </BarChart>
    </ResponsiveContainer>
  )
}