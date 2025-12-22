"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

const opportunitiesChartData = [
  { name: "Open", value: 100, color: "var(--chart-1)" },
  { name: "Closed", value: 100, color: "var(--chart-2)" },
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

export function OpportunitiesModule() {
  return (
    <Card id="opportunities-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Opportunities</CardTitle>
            <CardDescription>Real-time opportunity tracking</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">200</div>
            <div className="text-sm text-muted-foreground">Total Opportunities</div>
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
                  data={opportunitiesChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {opportunitiesChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-2xl font-bold" style={{ color: "var(--chart-1)" }}>
                100
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Open Opportunities</div>
              <div className="mt-2 text-xs text-muted-foreground">₹100 Cr potential</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-2xl font-bold" style={{ color: "var(--chart-2)" }}>
                100
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Closed Opportunities</div>
              <div className="mt-2 text-xs text-muted-foreground">50% conversion rate</div>
            </div>
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
              <div className="text-sm font-medium text-card-foreground">Pipeline Health</div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-1/2 rounded-full bg-primary" />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">50% closure rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
