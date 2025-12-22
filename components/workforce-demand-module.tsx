"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

const workforceData = [
  { name: "Onshore", value: 60, color: "var(--chart-1)" },
  { name: "Nearshore", value: 32, color: "var(--chart-2)" },
  { name: "Offshore", value: 141, color: "var(--chart-3)" },
]

const renderLegend = (props: any) => {
  const { payload } = props
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function WorkForceDemandModule() {
  const total = workforceData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card id="workforce-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work Force Demand</CardTitle>
            <CardDescription>Distribution across locations aligned to open opportunities</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{total}</div>
            <div className="text-sm text-muted-foreground">Total WFD</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={workforceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {workforceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center space-y-3">
            {workforceData.map((item) => (
              <div key={item.name} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-card-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-card-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {((item.value / total) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
