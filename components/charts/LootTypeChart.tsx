'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { HuntingArea } from '@/types'

interface LootTypeChartProps {
  areas: HuntingArea[]
}

export function LootTypeChart({ areas }: LootTypeChartProps) {
  const allLoot = areas.flatMap(area => area.loot)

  const runeCount = allLoot.filter(item => item.type === 'rune').length
  const itemCount = allLoot.filter(item => item.type === 'item').length

  const data = [
    { name: '룬', value: runeCount, color: '#f59e0b' },
    { name: '아이템', value: itemCount, color: '#8b5cf6' }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}