"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateOpportunities, type OpportunityRecord } from "@/lib/synthetic-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"

const opportunitiesChartData = [
  { name: "Open", value: 140, color: "#A8E6CF" },
  { name: "Closed", value: 130, color: "#FFD3B6" },
]

const serviceLineData = [
  { name: "Cloud", open: 40, closed: 30, total: 70 },
  { name: "AI", open: 35, closed: 25, total: 60 },
  { name: "TI", open: 30, closed: 20, total: 50 },
  { name: "ESU", open: 25, closed: 15, total: 40 },
  { name: "CBO", open: 30, closed: 20, total: 50 },
]

const locationData = [
  { name: "Onshore", open: 20, closed: 47, total: 67 },
  { name: "Nearshore", open: 15, closed: 25, total: 40 },
  { name: "Offshore", open: 63, closed: 100, total: 163 },
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

  const handleDataClick = (title: string, count: number, status?: "Open" | "Closed") => {
    const records = generateOpportunities(count, status || "Open")
    setDetailView({
      isOpen: true,
      data: records,
      title: `${title} Opportunities`,
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
            <CardDescription>Pipeline distribution across service lines and locations</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">₹270 Cr</div>
            <div className="text-sm text-muted-foreground">Total Opportunity Value</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!detailView.isOpen ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Service Line-wise Opportunities View */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Service Line-wise Opportunities
              </h4>
              <div className="space-y-4">
                {serviceLineData.map((item) => (
                  <div key={item.name} className="group flex items-center gap-4">
                    <div className="w-16 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {item.name}
                    </div>
                    <button
                      onClick={() => handleDataClick(item.name, item.total)}
                      className="relative flex-1 h-8 rounded-sm overflow-hidden bg-muted/20 border border-border/50 transition-all hover:border-primary/50 flex items-center pr-2"
                    >
                      {/* Closed Segment (Base) */}
                      <div
                        className="h-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-foreground/70"
                        style={{
                          backgroundColor: "#FFD3B6",
                          width: `${(item.closed / 270) * 100}%`,
                        }}
                      >
                        {item.closed}
                      </div>
                      {/* Open Segment (Stacked) */}
                      <div
                        className="h-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-foreground/70 border-l border-white/20"
                        style={{
                          backgroundColor: "#A8E6CF",
                          width: `${(item.open / 270) * 100}%`,
                        }}
                      >
                        {item.open}
                      </div>
                      <div className="flex-1" />
                      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-all" />
                    </button>
                    <div className="w-12 text-right text-xs font-bold text-muted-foreground">{item.total}</div>
                  </div>
                ))}
              </div>
              {/* Legend for the stacked bars */}
              <div className="flex items-center gap-4 mt-2 px-16">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#FFD3B6" }} />
                  <span>Closed</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#A8E6CF" }} />
                  <span>Open</span>
                </div>
              </div>
            </div>

            {/* Right: Location-wise Opportunities View */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Location-wise Opportunities
              </h4>
              <div className="space-y-4">
                {locationData.map((item) => (
                  <div key={item.name} className="group flex items-center gap-4">
                    <div className="w-16 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {item.name}
                    </div>
                    <button
                      onClick={() => handleDataClick(item.name, item.total)}
                      className="relative flex-1 h-8 rounded-sm overflow-hidden bg-muted/20 border border-border/50 transition-all hover:border-primary/50 flex items-center pr-2"
                    >
                      {/* Closed Segment (Base) */}
                      <div
                        className="h-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-foreground/70"
                        style={{
                          backgroundColor: "#FFD3B6",
                          width: `${(item.closed / 270) * 100}%`,
                        }}
                      >
                        {item.closed}
                      </div>
                      {/* Open Segment (Stacked) */}
                      <div
                        className="h-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-bold text-foreground/70 border-l border-white/20"
                        style={{
                          backgroundColor: "#A8E6CF",
                          width: `${(item.open / 270) * 100}%`,
                        }}
                      >
                        {item.open}
                      </div>
                      <div className="flex-1" />
                      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-all" />
                    </button>
                    <div className="w-12 text-right text-xs font-bold text-muted-foreground">{item.total}</div>
                  </div>
                ))}
              </div>
              {/* Legend for the stacked bars */}
              <div className="flex items-center gap-4 mt-2 px-16">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#FFD3B6" }} />
                  <span>Closed</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#A8E6CF" }} />
                  <span>Open</span>
                </div>
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
