"use client"

import { useState } from "react"
import { DetailViewSlide } from "./detail-view-slide"
import { RequirementsSplitView } from "./requirements-split-view"
import {
  generateRevenueRecords,
  generateOpportunities,
  generateRequirements,
  generateFulfilments,
} from "@/lib/synthetic-data"

interface FlowchartStep {
  label: string
  value: string
  description: string
  color: string
  scrollId: string
  dataType: "revenue" | "opportunities-open" | "opportunities-closed" | "requirements" | "fulfilments" | "margin" | "requirements-split"
}

const flowSteps: FlowchartStep[] = [
  {
    label: "Revenue",
    value: "₹100 Cr",
    description: "(Target)",
    color: "var(--chart-1)",
    scrollId: "revenue-module",
    dataType: "revenue",
  },
  {
    label: "Revenue",
    value: "₹80 Cr",
    description: "(Current Outlook)",
    color: "var(--chart-2)",
    scrollId: "revenue-module",
    dataType: "revenue",
  },
  {
    label: "Margin",
    value: "200",
    description: "(Target)",
    color: "var(--chart-3)",
    scrollId: "opportunities-module",
    dataType: "margin",
  },
  {
    label: "Margin",
    value: "180",
    description: "(Current Outlook - As per MIP)",
    color: "var(--chart-4)",
    scrollId: "opportunities-module",
    dataType: "margin",
  },
  {
    label: "Opportunities",
    value: "850",
    description: "Total Opps",
    color: "var(--chart-5)",
    scrollId: "opportunities-module",
    dataType: "opportunities-open",
  },
  {
    label: "Requirements",
    value: "250",
    description: "Open",
    color: "var(--chart-6)",
    scrollId: "requirements-module",
    dataType: "requirements-split",
  },
  {
    label: "Requirements",
    value: "600",
    description: "Closed",
    color: "var(--chart-7)",
    scrollId: "fulfilments-module",
    dataType: "fulfilments",
  },
]

interface WorkflowFlowchartProps {
  accounts: string[]
}

export function WorkflowFlowchart({ accounts }: WorkflowFlowchartProps) {
  const [detailView, setDetailView] = useState<{
    isOpen: boolean
    title: string
    data: any[]
    columns: any[]
  }>({
    isOpen: false,
    title: "",
    data: [],
    columns: [],
  })

  const [showRequirementsSplit, setShowRequirementsSplit] = useState(false)

  const handleStepClick = (step: FlowchartStep) => {
    let data: any[] = []
    let columns: any[] = []
    let title = ""

    switch (step.dataType) {
      case "revenue":
        title = "Revenue Details - All Divisions"
        data = generateRevenueRecords("Total", 100)
        columns = [
          { key: "id", label: "Project ID" },
          { key: "projectName", label: "Project Name" },
          { key: "client", label: "Client" },
          { key: "value", label: "Value (Cr)" },
          { key: "status", label: "Status" },
          { key: "projectManager", label: "Manager" },
        ]
        break
      case "opportunities-open":
      case "opportunities-closed":
        const status = step.dataType === "opportunities-closed" ? "Closed" : "Open"
        title = `${status} Opportunities Details`
        data = generateOpportunities(50, status)
        columns = [
          { key: "id", label: "ID" },
          { key: "name", label: "Opportunity Name" },
          { key: "client", label: "Client" },
          { key: "value", label: "Value (Cr)" },
          { key: "division", label: "Division" },
          { key: "owner", label: "Owner" },
        ]
        break
      case "requirements":
        title = "Open Requirements Details"
        data = generateRequirements(40, "MOT")
        columns = [
          { key: "id", label: "REQ ID" },
          { key: "positionTitle", label: "Position" },
          { key: "division", label: "Division" },
          { key: "location", label: "Location" },
          { key: "priority", label: "Priority" },
          { key: "openedDate", label: "Opened Date" },
        ]
        break
      case "requirements-split":
        setShowRequirementsSplit(true)
        return
      case "fulfilments":
        title = "Fulfilment Details"
        data = generateFulfilments(40, "MOT", "Closed")
        columns = [
          { key: "id", label: "ID" },
          { key: "positionTitle", label: "Position" },
          { key: "candidateName", label: "Candidate" },
          { key: "division", label: "Division" },
          { key: "status", label: "Status" },
          { key: "joinDate", label: "Join Date" },
        ]
        break
      case "margin":
        title = "Margin Details"
        data = generateOpportunities(30, "Closed") // Using closed opps as a proxy for margin data
        columns = [
          { key: "id", label: "Project ID" },
          { key: "name", label: "Project" },
          { key: "division", label: "Division" },
          { key: "value", label: "Revenue (Cr)" },
          { key: "owner", label: "Manager" },
        ]
        break
    }

    setDetailView({
      isOpen: true,
      title,
      data,
      columns,
    })
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-3 p-6 min-w-max">
        {flowSteps.map((step, index) => (
          <div key={`${step.label}-${index}`} className="flex items-center gap-3">
            {/* Flow Step Card */}
            <button
              onClick={() => handleStepClick(step)}
              className="relative rounded-xl border-2 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 cursor-pointer text-left"
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
          </div>
        ))}
      </div>

      <DetailViewSlide
        isOpen={detailView.isOpen}
        onClose={() => setDetailView({ ...detailView, isOpen: false })}
        title={detailView.title}
        data={detailView.data}
        columns={detailView.columns}
      />

      <RequirementsSplitView
        isOpen={showRequirementsSplit}
        onClose={() => setShowRequirementsSplit(false)}
        accounts={accounts}
      />
    </div>
  )
}
