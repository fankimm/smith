'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HuntingArea } from '@/types'

interface AreaRunsChartProps {
  areas: HuntingArea[]
}

export function AreaRunsChart({ areas }: AreaRunsChartProps) {
  const data = areas
    .filter(area => area.totalRuns > 0)
    .sort((a, b) => b.totalRuns - a.totalRuns)
    .slice(0, 10)
    .map(area => ({
      name: area.name,
      totalRuns: area.totalRuns,
      sessionRuns: area.count
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="name"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
          className="text-muted-foreground"
        />
        <YAxis fontSize={12} className="text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Bar dataKey="totalRuns" fill="hsl(var(--primary))" name="총 런" />
        <Bar dataKey="sessionRuns" fill="hsl(var(--secondary))" name="현재 세션" />
      </BarChart>
    </ResponsiveContainer>
  )
}