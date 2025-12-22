"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

const requirementsChartData = [
  { name: "MOT", value: 385, color: "var(--chart-1)" },
  { name: "NON-MOT", value: 465, color: "var(--chart-2)" },
]

const requirementsData = [
  { month: "Jan", MOT: 120, "NON-MOT": 160 },
  { month: "Feb", MOT: 140, "NON-MOT": 180 },
  { month: "Mar", MOT: 125, "NON-MOT": 125 },
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

export function OpenRequirementsModule() {
  const totalRequirements = 850

  return (
    <Card id="requirements-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Open Requirements</CardTitle>
            <CardDescription>MOT vs NON-MOT breakdown by month</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">850</div>
            <div className="text-sm text-muted-foreground">Total Requirements</div>
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
                  data={requirementsChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {requirementsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Breakdown */}
          <div className="flex flex-col justify-center space-y-3">
            {requirementsData.map((item) => (
              <div key={item.month} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 font-semibold text-card-foreground">{item.month}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">MOT</div>
                    <div className="text-2xl font-bold" style={{ color: "var(--chart-1)" }}>
                      {item.MOT}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">NON-MOT</div>
                    <div className="text-2xl font-bold" style={{ color: "var(--chart-2)" }}>
                      {item["NON-MOT"]}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Total: {item.MOT + item["NON-MOT"]}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
