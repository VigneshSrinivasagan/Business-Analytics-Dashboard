"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

const fulfilmentsChartData = [
  { name: "Closed", value: 400, color: "var(--chart-2)" },
  { name: "Open", value: 450, color: "var(--chart-3)" },
]

const fulfilmentData = [
  { category: "MOT", Open: 185, Closed: 200 },
  { category: "NON-MOT", Open: 265, Closed: 200 },
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

export function FulfilmentsModule() {
  const totalOpen = 450
  const totalClosed = 400
  const totalPositions = 850

  return (
    <Card id="fulfilments-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fulfilments</CardTitle>
            <CardDescription>Position status breakdown</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{totalPositions}</div>
            <div className="text-sm text-muted-foreground">Total Positions</div>
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
                  data={fulfilmentsChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fulfilmentsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats and Breakdown */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-2xl font-bold" style={{ color: "var(--chart-2)" }}>
                  {totalClosed}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Closed Positions</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {((totalClosed / totalPositions) * 100).toFixed(0)}% fulfilled
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-2xl font-bold" style={{ color: "var(--chart-3)" }}>
                  {totalOpen}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Open Positions</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {((totalOpen / totalPositions) * 100).toFixed(0)}% pending
                </div>
              </div>
            </div>

            {fulfilmentData.map((item) => (
              <div key={item.category} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 font-semibold text-card-foreground">{item.category}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Open:</span>
                  <span className="font-bold" style={{ color: "var(--chart-3)" }}>
                    {item.Open}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Closed:</span>
                  <span className="font-bold" style={{ color: "var(--chart-2)" }}>
                    {item.Closed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
