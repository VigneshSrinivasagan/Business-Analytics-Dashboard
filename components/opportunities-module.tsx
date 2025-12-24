"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { generateOpportunities, type OpportunityRecord } from "@/lib/synthetic-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"

const opportunitiesChartData = [
  { name: "Open", value: 100, color: "#A8E6CF" },
  { name: "Closed", value: 100, color: "#FFD3B6" },
]

const opportunityColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Opportunity Name" },
  { key: "client", label: "Client" },
  { key: "value", label: "Value (Cr)" },
  { key: "status", label: "Status" },
  { key: "division", label: "Division" },
  { key: "owner", label: "Owner" },
  { key: "createdDate", label: "Created Date" },
  { key: "closureDate", label: "Closure Date" },
]

export function OpportunitiesModule() {
  const [animatedData, setAnimatedData] = useState(opportunitiesChartData.map((d) => ({ ...d, value: 0 })))
  const [isLoading, setIsLoading] = useState(true)
  const [detailView, setDetailView] = useState<{ isOpen: boolean; data: OpportunityRecord[]; title: string }>({
    isOpen: false,
    data: [],
    title: "",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 10

  useEffect(() => {
    setIsLoading(true)
    const duration = 1000
    const steps = 60
    const increment = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedData(
        opportunitiesChartData.map((d) => ({
          ...d,
          value: Math.floor(d.value * progress),
        })),
      )

      if (currentStep >= steps) {
        clearInterval(interval)
        setIsLoading(false)
      }
    }, increment)

    return () => clearInterval(interval)
  }, [])

  const handleBarClick = (category: string, count: number) => {
    const status = category as "Open" | "Closed"
    const records = generateOpportunities(count, status)
    setDetailView({
      isOpen: true,
      data: records,
      title: `${category} Opportunities`,
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  const filteredData = detailView.data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = String(a[sortColumn as keyof typeof a])
    const bVal = String(b[sortColumn as keyof typeof b])
    return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

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
        {!detailView.isOpen ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={animatedData} barSize={60}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    onClick={(data) =>
                      handleBarClick(data.name, opportunitiesChartData.find((d) => d.name === data.name)?.value || 0)
                    }
                    className="cursor-pointer"
                  >
                    {animatedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center space-y-4">
              <div
                className="rounded-lg border border-border bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleBarClick("Open", 100)}
              >
                <div className="text-2xl font-bold" style={{ color: "#A8E6CF" }}>
                  100
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Open Opportunities</div>
                <div className="mt-2 text-xs text-muted-foreground">₹100 Cr potential</div>
              </div>
              <div
                className="rounded-lg border border-border bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleBarClick("Closed", 100)}
              >
                <div className="text-2xl font-bold" style={{ color: "#FFD3B6" }}>
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
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {detailView.title} ({detailView.data.length} records)
              </h3>
              <Button variant="outline" size="sm" onClick={() => setDetailView({ ...detailView, isOpen: false })}>
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Back
              </Button>
            </div>

            <Input
              placeholder="Search across all columns..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="max-w-md"
            />

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {opportunityColumns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-muted/80"
                          onClick={() => handleSort(col.key)}
                        >
                          <div className="flex items-center gap-2">
                            {col.label}
                            {sortColumn === col.key && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, idx) => (
                      <tr key={idx} className="border-t hover:bg-muted/30">
                        {opportunityColumns.map((col) => (
                          <td key={col.key} className="px-4 py-3">
                            {String(row[col.key as keyof typeof row])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
