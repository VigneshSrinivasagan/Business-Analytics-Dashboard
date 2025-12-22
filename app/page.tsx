"use client"

import { useState } from "react"
import { RevenueModule } from "@/components/revenue-module"
import { OpportunitiesModule } from "@/components/opportunities-module"
import { WorkForceDemandModule } from "@/components/workforce-demand-module"
import { OpenRequirementsModule } from "@/components/open-requirements-module"
import { FulfilmentsModule } from "@/components/fulfilments-module"
import { RevenueOutlookModule } from "@/components/revenue-outlook-module"
import { ThemeToggle } from "@/components/theme-toggle"
import { WorkflowFlowchart } from "@/components/workflow-flowchart"

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Business Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Real-time insights across revenue, opportunities, and workforce
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-[1600px]">
          <WorkflowFlowchart />
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="space-y-8">
          {/* Revenue Module */}
          <RevenueModule onProjectSelect={setSelectedProject} />

          {/* Opportunities Module */}
          <OpportunitiesModule />

          {/* Work Force Demand Module */}
          <WorkForceDemandModule />

          {/* Open Requirements Module */}
          <OpenRequirementsModule />

          {/* Fulfilments Module */}
          <FulfilmentsModule />

          {/* Revenue Outlook Module */}
          <RevenueOutlookModule />
        </div>
      </main>
    </div>
  )
}
