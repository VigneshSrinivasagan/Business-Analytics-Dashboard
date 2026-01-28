"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"

interface TCVViewProps {
  isOpen: boolean
  onClose: () => void
}

// Pipeline sales stage data
const pipelineStages = [
  { label: "00 - Suspecting", value: 147.1, percentage: 19, count: 96, color: "#A8D5E5" },
  { label: "01 - Prospecting", value: 73.41, percentage: 10, count: 60, color: "#D4A5A5" },
  { label: "02 - EOI/RFI in progress", value: 124.03, percentage: 16, count: 36, color: "#C9A5C2" },
  { label: "03 - EOI/RFI Submitted", value: 45.63, percentage: 6, count: 22, color: "#8B6B47" },
  { label: "04 - RFP/Proposal in progress", value: 34.39, percentage: 5, count: 17, color: "#6B5B95" },
  { label: "05 - RFP Submitted", value: 187.3, percentage: 25, count: 32, color: "#F4D35E" },
  { label: "06 - Short Listed", value: 31.67, percentage: 4, count: 13, color: "#8BA39C" },
  { label: "07 - Selected", value: 79.56, percentage: 11, count: 160, color: "#A8E6CF" },
  { label: "08 - Contract Negotiation", value: 32.61, percentage: 4, count: 42, color: "#52B788" },
  { label: "09 - Closed/WON", value: 0.0, percentage: 0, count: 0, color: "#1B4332" },
]

// Service line wise opportunities
const serviceLineOpportunities = [
  { name: "ADM", value: 194.35, count: 207 },
  { name: "AI", value: 27.66, count: 45 },
  { name: "BPS", value: 82.49, count: 31 },
  { name: "C&SI", value: 2.6, count: 5 },
  { name: "Cloud", value: 159.01, count: 116 },
  { name: "Cyber", value: 16.04, count: 43 },
  { name: "Data", value: 21.03, count: 30 },
  { name: "ESU", value: 104.4, count: 57 },
  { name: "IT IS", value: 116.77, count: 45 },
  { name: "Others", value: 4.0, count: 4 },
  { name: "QET", value: 10.03, count: 24 },
  { name: "TI", value: 19.41, count: 16 },
]

const barColors = {
  blue: "#5B9FBB",
  orange: "#FF9F43",
  green: "#52B788",
  mint: "#A8E6CF",
  peach: "#FFD3B6",
  lavender: "#C9A5C2",
}

export function TCVView({ isOpen, onClose }: TCVViewProps) {
  const [detailView, setDetailView] = useState<{ isOpen: boolean; title: string; data: any[] }>({
    isOpen: false,
    title: "",
    data: [],
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleBarClick = (stageName: string, count: number) => {
    setDetailView({
      isOpen: true,
      title: `${stageName} - Details`,
      data: Array.from({ length: count }, (_, i) => ({
        id: `OPP-${i + 1}`,
        stage: stageName,
        value: Math.random() * 10,
        client: `Client ${i + 1}`,
        status: "Active",
      })),
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  const filteredData = detailView.data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background">
      <div className="min-h-screen">
        <Card className="m-6 rounded-lg border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>TCV (Total Contract Value) Dashboard</CardTitle>
              <Button variant="outline" size="sm" onClick={onClose}>
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!detailView.isOpen ? (
              <div className="space-y-12">
                {/* Pipeline Sales Stage CRM View */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    Pipeline Sales Stage CRM View
                  </h3>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Segmented Bar Chart */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-medium mb-4 text-muted-foreground">Stage-wise Distribution</h4>
                      <div className="space-y-3">
                        {pipelineStages.map((stage) => (
                          <button
                            key={stage.label}
                            onClick={() => handleBarClick(stage.label, stage.count)}
                            className="w-full text-left group hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-foreground truncate">{stage.label}</span>
                              <span className="text-xs font-bold text-muted-foreground ml-2 flex-shrink-0">{stage.percentage}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="relative flex-1 h-8 rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                                <div
                                  className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out flex items-center justify-center"
                                  style={{ backgroundColor: stage.color, width: `${stage.percentage * 3}%` }}
                                >
                                  {stage.percentage > 5 && (
                                    <span className="text-xs font-bold text-foreground">₹{stage.value.toFixed(2)}M</span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-bold text-foreground whitespace-nowrap">{stage.count}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-muted-foreground">Opportunity Distribution</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pipelineStages.filter((s) => s.count > 0)}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ label, percent }) => `${label.split(" - ")[1]}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pipelineStages.map((stage) => (
                              <Cell key={stage.label} fill={stage.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.5rem",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Service Line Wise Open Opportunities */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    Service Line-wise Open Opportunities
                  </h3>

                  <div className="space-y-2">
                    {[{ name: "Total", value: 757.79, count: 626 }, ...serviceLineOpportunities].map((line, idx) => (
                      <button
                        key={line.name}
                        onClick={() => handleBarClick(`${line.name}`, line.count)}
                        className="w-full text-left group hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-${idx === 0 ? "bold" : "medium"} text-foreground`}>
                            {line.name}
                          </span>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="font-bold text-foreground">₹{line.value.toFixed(2)}M</span>
                            <span className="font-bold text-foreground w-12 text-right">{line.count}</span>
                          </div>
                        </div>
                        <div className="relative h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                            style={{
                              backgroundColor: idx === 0 ? barColors.blue : [barColors.mint, barColors.peach, barColors.lavender, barColors.orange, barColors.green][idx % 5],
                              width: `${(line.value / 757.79) * 100}%`,
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{detailView.title}</h3>
                  <Button variant="outline" size="sm" onClick={() => setDetailView({ ...detailView, isOpen: false })}>
                    Back to Chart
                  </Button>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="max-w-sm"
                  />

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-2 font-semibold">ID</th>
                          <th className="text-left px-4 py-2 font-semibold">Stage</th>
                          <th className="text-left px-4 py-2 font-semibold">Value (M)</th>
                          <th className="text-left px-4 py-2 font-semibold">Client</th>
                          <th className="text-left px-4 py-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((item) => (
                          <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                            <td className="px-4 py-2">{item.id}</td>
                            <td className="px-4 py-2">{item.stage}</td>
                            <td className="px-4 py-2">{item.value.toFixed(2)}</td>
                            <td className="px-4 py-2">{item.client}</td>
                            <td className="px-4 py-2">{item.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Page {currentPage} of {totalPages} ({filteredData.length} results)
                    </span>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
