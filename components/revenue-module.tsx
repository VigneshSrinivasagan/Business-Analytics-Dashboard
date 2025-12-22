"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { ChevronRight } from "lucide-react"

const revenueData = [
  { name: "Cloud", value: 25, color: "var(--chart-1)" },
  { name: "AI", value: 20, color: "var(--chart-2)" },
  { name: "TI", value: 20, color: "var(--chart-3)" },
  { name: "ESU", value: 15, color: "var(--chart-4)" },
  { name: "CBO", value: 20, color: "var(--chart-5)" },
]

interface RevenueModuleProps {
  onProjectSelect: (project: string) => void
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

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

export function RevenueModule({ onProjectSelect }: RevenueModuleProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const handleClick = (index: number) => {
    onProjectSelect(revenueData[index].name)
  }

  return (
    <Card id="revenue-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Total Target: INR 100 Cr</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">₹100 Cr</div>
            <div className="text-sm text-muted-foreground">Total Revenue Target</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Pie Chart with Legend */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  onClick={(_, index) => handleClick(index)}
                  className="cursor-pointer"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with drill-down */}
          <div className="flex flex-col justify-center space-y-3">
            {revenueData.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleClick(index)}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-card-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-card-foreground">₹{item.value} Cr</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
