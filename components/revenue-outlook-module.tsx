"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const outlookData = {
  systemRevenue: 15,
  closureRevenue: 85,
  total: 100,
}

export function RevenueOutlookModule() {
  const achievementRate = (outlookData.closureRevenue / outlookData.total) * 100

  return (
    <Card id="outlook-module" className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Revenue Outlook</CardTitle>
            <CardDescription>System vs Closure Revenue Achievement</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* System Revenue (Open) */}
          <div className="rounded-lg border-2 border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">System Revenue (Open)</div>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-3)" }}>
              ₹{outlookData.systemRevenue} Cr
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {((outlookData.systemRevenue / outlookData.total) * 100).toFixed(0)}% of total
            </div>
          </div>

          {/* Closure Revenue (Closed) */}
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">Closure Revenue (Closed)</div>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-4xl font-bold text-primary">₹{outlookData.closureRevenue} Cr</div>
            <div className="mt-2 text-sm text-muted-foreground">{achievementRate.toFixed(0)}% achieved</div>
          </div>

          {/* Total Target */}
          <div className="rounded-lg border-2 border-border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Revenue Target</div>
            <div className="mt-3 text-4xl font-bold text-foreground">₹{outlookData.total} Cr</div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{achievementRate.toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${achievementRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overall Outlook Summary */}
        <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-6">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Overall Revenue Outlook</div>
            <div className="mt-2 text-5xl font-bold text-primary">{achievementRate.toFixed(1)}%</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Strong performance with ₹{outlookData.closureRevenue} Cr closed revenue
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
