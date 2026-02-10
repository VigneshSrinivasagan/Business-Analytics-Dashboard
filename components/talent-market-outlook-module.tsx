"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { TalentDashboardView } from "./talent-dashboard-view"

const talentOutlookData = {
  availableRequirements: 125,
  releaseCount: 98,
  applicationCount: 87,
  successfulMappings: 76,
}

// Successful associate mappings data for visualization
const mappingsData = [
  { division: "Cloud", mapped: 18, unmapped: 4 },
  { division: "AI", mapped: 12, unmapped: 3 },
  { division: "TI", mapped: 15, unmapped: 2 },
  { division: "ESU", mapped: 14, unmapped: 3 },
  { division: "CBO", mapped: 10, unmapped: 2 },
  { division: "ADM", mapped: 7, unmapped: 1 },
]

const mappingSuccessRate = (talentOutlookData.successfulMappings / talentOutlookData.releaseCount) * 100

export function TalentMarketOutlookModule() {
  const [showDashboardView, setShowDashboardView] = useState(false)

  return (
    <>
      <Card id="talent-outlook-module" className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Talent Market Outlook</CardTitle>
              <CardDescription>Associate Release & Internal Mapping Performance</CardDescription>
            </div>
            <button
              onClick={() => setShowDashboardView(true)}
              className="rounded-full bg-primary/10 p-3 hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Top Section: Three Info Boxes */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Available Requirements */}
              <div className="rounded-lg border-2 border-border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">Available Requirements</div>
                <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-4)" }}>
                  {talentOutlookData.availableRequirements}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Total open positions</div>
              </div>

              {/* Release Count */}
              <div className="rounded-lg border-2 border-border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">Release Count</div>
                <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-2)" }}>
                  {talentOutlookData.releaseCount}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Associates being released</div>
              </div>

              {/* Application Count */}
              <div className="rounded-lg border-2 border-border bg-card p-6">
                <div className="text-sm font-medium text-muted-foreground">Application Count</div>
                <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-5)" }}>
                  {talentOutlookData.applicationCount}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Internal applications received</div>
              </div>
            </div>

            {/* Bottom Section: Successful Mappings Chart */}
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Successful Associate Mappings</h3>
                  <p className="text-sm text-muted-foreground mt-1">Division-wise mapping success and pending assignments</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{talentOutlookData.successfulMappings}</div>
                  <div className="text-sm text-muted-foreground">{mappingSuccessRate.toFixed(1)}% mapped</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mappingsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="division" stroke="var(--border)" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis stroke="var(--border)" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.375rem",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => <span style={{ fontSize: "12px" }}>{value}</span>}
                  />
                  <Bar dataKey="mapped" fill="#A8E6CF" name="Successfully Mapped" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="unmapped" fill="#FFB6C1" name="Pending Assignment" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Overall Performance Summary */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-background/50 p-4 border border-border">
                  <div className="text-xs font-medium text-muted-foreground">Mapping Efficiency</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{mappingSuccessRate.toFixed(1)}%</span>
                    <span className="text-sm text-muted-foreground">of releases matched</span>
                  </div>
                </div>
                <div className="rounded-lg bg-background/50 p-4 border border-border">
                  <div className="text-xs font-medium text-muted-foreground">Pending Placements</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: "var(--chart-2)" }}>
                      {talentOutlookData.releaseCount - talentOutlookData.successfulMappings}
                    </span>
                    <span className="text-sm text-muted-foreground">awaiting assignment</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <TalentDashboardView isOpen={showDashboardView} onClose={() => setShowDashboardView(false)} />
      </>
  )
}
