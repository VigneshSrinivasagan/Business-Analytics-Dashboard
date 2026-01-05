"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { generateOpportunities, type OpportunityRecord } from "@/lib/synthetic-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"

const accountData = [
  { name: "Equitable Holdings", total: 150, closed: 90, inProgress: 40, notStarted: 20 },
  { name: "Prudential Insurance", total: 180, closed: 130, inProgress: 30, notStarted: 20 },
  { name: "AIG", total: 160, closed: 110, inProgress: 30, notStarted: 20 },
  { name: "NYL", total: 200, closed: 150, inProgress: 30, notStarted: 20 },
  { name: "GenWok", total: 160, closed: 120, inProgress: 20, notStarted: 20 },
]

const serviceLineData = [
  { name: "Cloud", total: 180, closed: 130, inProgress: 30, notStarted: 20 },
  { name: "AI", total: 170, closed: 120, inProgress: 30, notStarted: 20 },
  { name: "TI", total: 160, closed: 110, inProgress: 30, notStarted: 20 },
  { name: "ESU", total: 170, closed: 120, inProgress: 30, notStarted: 20 },
  { name: "CBO", total: 170, closed: 120, inProgress: 30, notStarted: 20 },
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

const COLORS = {
  total: "#8B9DC3",
  closed: "#FFD3B6",
  inProgress: "#A8E6CF",
  notStarted: "#F7B2BD",
}

export function OpportunitiesModule() {
  const [accountAnimatedData, setAccountAnimatedData] = useState(
    accountData.map((d) => ({ ...d, total: 0, closed: 0, inProgress: 0, notStarted: 0 })),
  )
  const [serviceLineAnimatedData, setServiceLineAnimatedData] = useState(
    serviceLineData.map((d) => ({ ...d, total: 0, closed: 0, inProgress: 0, notStarted: 0 })),
  )
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

      setAccountAnimatedData(
        accountData.map((d) => ({
          ...d,
          total: Math.floor(d.total * progress),
          closed: Math.floor(d.closed * progress),
          inProgress: Math.floor(d.inProgress * progress),
          notStarted: Math.floor(d.notStarted * progress),
        })),
      )

      setServiceLineAnimatedData(
        serviceLineData.map((d) => ({
          ...d,
          total: Math.floor(d.total * progress),
          closed: Math.floor(d.closed * progress),
          inProgress: Math.floor(d.inProgress * progress),
          notStarted: Math.floor(d.notStarted * progress),
        })),
      )

      if (currentStep >= steps) {
        clearInterval(interval)
        setIsLoading(false)
      }
    }, increment)

    return () => clearInterval(interval)
  }, [])

  const handleDataClick = (
    title: string,
    count: number,
    status?: "Closed" | "In Progress" | "Not Started" | "Total",
  ) => {
    let records: OpportunityRecord[] = []

    if (status === "Total" || !status) {
      // Generate a mix of all statuses
      records = [
        ...generateOpportunities(Math.floor(count * 0.7), "Closed"),
        ...generateOpportunities(Math.floor(count * 0.18), "In Progress"),
        ...generateOpportunities(Math.floor(count * 0.12), "Not Started"),
      ]
    } else {
      records = generateOpportunities(count, status)
    }

    setDetailView({
      isOpen: true,
      data: records,
      title: `${title} - ${status || "All"} Opportunities`,
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
            <CardDescription>Pipeline distribution across accounts and service lines</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">850</div>
            <div className="text-sm text-muted-foreground">Total Opportunities</div>
            <div className="text-xs text-muted-foreground mt-1">Closed: 600 | In Progress: 150 | Not Started: 100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!detailView.isOpen ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Account-wise Opportunities */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Account-wise Opportunities
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={accountAnimatedData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="total"
                    fill={COLORS.total}
                    name="Total"
                    onClick={(data) => handleDataClick(data.name, data.total, "Total")}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="closed"
                    fill={COLORS.closed}
                    name="Closed"
                    onClick={(data) => handleDataClick(data.name, data.closed, "Closed")}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="inProgress"
                    fill={COLORS.inProgress}
                    name="In Progress"
                    onClick={(data) => handleDataClick(data.name, data.inProgress, "In Progress")}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="notStarted"
                    fill={COLORS.notStarted}
                    name="Not Started"
                    onClick={(data) => handleDataClick(data.name, data.notStarted, "Not Started")}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Right: Service Line-wise Opportunities */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Service Line-wise Opportunities
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={serviceLineAnimatedData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="total"
                    fill={COLORS.total}
                    name="Total"
                    onClick={(data) => handleDataClick(data.name, data.total, "Total")}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="closed"
                    fill={COLORS.closed}
                    name="Closed"
                    onClick={(data) => handleDataClick(data.name, data.closed, "Closed")}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="inProgress"
                    fill={COLORS.inProgress}
                    name="In Progress"
                    onClick={(data) => handleDataClick(data.name, data.inProgress, "In Progress")}
                    cursor="pointer"
                  />
                  <Bar
                    dataKey="notStarted"
                    fill={COLORS.notStarted}
                    name="Not Started"
                    onClick={(data) => handleDataClick(data.name, data.notStarted, "Not Started")}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
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
                            {String(row[col.key as keyof typeof row] || "")}
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
