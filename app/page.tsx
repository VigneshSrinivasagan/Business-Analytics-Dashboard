"use client"

import { useState, useEffect } from "react"
import { RevenueModule } from "@/components/revenue-module"
import { OpportunitiesModule } from "@/components/opportunities-module"
import { WorkForceDemandModule } from "@/components/workforce-demand-module"
import { OpenRequirementsModule } from "@/components/open-requirements-module"
import { FulfilmentsModule } from "@/components/fulfilments-module"
import { RevenueOutlookModule } from "@/components/revenue-outlook-module"
import { ThemeToggle } from "@/components/theme-toggle"
import { WorkflowFlowchart } from "@/components/workflow-flowchart"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MarginModule } from "@/components/margin-module"
import { TalentMarketOutlookModule } from "@/components/talent-market-outlook-module"

const ACCOUNTS = ["Equitable Holdings", "Prudential Insurance", "AIG", "NYL", "GenWok"]
const SERVICE_LINES = ["Cloud", "AI", "TI", "ESU", "CBO"]
const QUARTERS = [
  "Year 2024 - 2025",
  "Apr 2025 - Jun 2025",
  "Jul 2025 - Sep 2025",
  "Oct 2025 - Dec 2025",
  "Jan 2026 - Mar 2026",
  "Year 2025 - 2026",
]

export default function DashboardPage() {
  const [selectedAccount, setSelectedAccount] = useState("All")
  const [selectedQuarter, setSelectedQuarter] = useState("")

  useEffect(() => {
    const now = new Date("2026-01-04") // Using current date from instructions
    const month = now.getMonth() // 0-indexed, so 0 is Jan
    const year = now.getFullYear()

    let currentQ = "Year 2025 - 2026"

    if (year === 2025) {
      if (month >= 3 && month <= 5) currentQ = "Apr 2025 - Jun 2025"
      else if (month >= 6 && month <= 8) currentQ = "Jul 2025 - Sep 2025"
      else if (month >= 9 && month <= 11) currentQ = "Oct 2025 - Dec 2025"
    } else if (year === 2026) {
      if (month >= 0 && month <= 2) currentQ = "Jan 2026 - Mar 2026"
    }

    setSelectedQuarter(currentQ)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-[1600px] px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-semibold text-foreground">Operations Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Real-time insights of revenue, opportunities, and staffing as on Date
              </p>
            </div>

            <div className="flex items-center gap-6 flex-grow justify-end">
              <div className="flex items-center gap-3">
                <Label htmlFor="account-select" className="text-sm font-medium whitespace-nowrap">
                  Account
                </Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger id="account-select" className="w-[180px]">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {ACCOUNTS.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="quarter-select" className="text-sm font-medium whitespace-nowrap">
                  Financial Quarter
                </Label>
                <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                  <SelectTrigger id="quarter-select" className="w-[200px]">
                    <SelectValue placeholder="Select Quarter" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUARTERS.map((quarter) => (
                      <SelectItem key={quarter} value={quarter}>
                        {quarter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pl-2 border-l border-border h-8 flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-[1600px]">
          <WorkflowFlowchart accounts={ACCOUNTS} />
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="space-y-8">
          {/* Revenue Module */}
          <RevenueModule onProjectSelect={() => {}} accounts={ACCOUNTS} serviceLines={SERVICE_LINES} />

          {/* Margin Module */}
          <MarginModule onProjectSelect={() => {}} accounts={ACCOUNTS} serviceLines={SERVICE_LINES} />

          {/* Opportunities Module */}
          <OpportunitiesModule accounts={ACCOUNTS} serviceLines={SERVICE_LINES} />

          {/* Work Force Demand Module */}
          <WorkForceDemandModule />

          {/* Open Requirements Module */}
          <OpenRequirementsModule />

          {/* Fulfilments Module */}
          <FulfilmentsModule />

          {/* Revenue Outlook Module */}
          <RevenueOutlookModule />

          {/* Talent Market Outlook Module */}
          <TalentMarketOutlookModule />
        </div>
      </main>
    </div>
  )
}
