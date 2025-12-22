"use client"

import { ArrowRight } from "lucide-react"

interface FlowchartStep {
  label: string
  value: string
  description: string
  color: string
  scrollId: string
}

const flowSteps: FlowchartStep[] = [
  {
    label: "Revenue",
    value: "₹100 Cr",
    description: "Target",
    color: "var(--chart-1)",
    scrollId: "revenue-module",
  },
  {
    label: "Opportunities",
    value: "200",
    description: "Total Opps",
    color: "var(--chart-2)",
    scrollId: "opportunities-module",
  },
  {
    label: "Work Force Demand",
    value: "233",
    description: "Total WFD",
    color: "var(--chart-3)",
    scrollId: "workforce-module",
  },
  {
    label: "Open Requirements",
    value: "850",
    description: "Positions",
    color: "var(--chart-4)",
    scrollId: "requirements-module",
  },
  {
    label: "Fulfilments",
    value: "850",
    description: "Total",
    color: "var(--chart-5)",
    scrollId: "fulfilments-module",
  },
  {
    label: "Revenue Outlook",
    value: "85%",
    description: "Achievement",
    color: "var(--chart-6)",
    scrollId: "outlook-module",
  },
]

export function WorkflowFlowchart() {
  const handleStepClick = (scrollId: string) => {
    const element = document.getElementById(scrollId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-3 p-6 min-w-max">
        {flowSteps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            {/* Flow Step Card */}
            <button
              onClick={() => handleStepClick(step.scrollId)}
              className="relative rounded-xl border-2 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 cursor-pointer"
              style={{ borderColor: step.color }}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">{step.label}</div>
              <div className="text-2xl font-bold" style={{ color: step.color }}>
                {step.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{step.description}</div>

              {/* Color indicator */}
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl" style={{ backgroundColor: step.color }} />
            </button>

            {/* Arrow */}
            {index < flowSteps.length - 1 && <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
