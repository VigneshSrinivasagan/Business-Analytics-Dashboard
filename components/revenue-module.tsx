"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateRevenueRecords, type RevenueRecord } from "@/lib/synthetic-data"

const revenueData = [
  { name: "Cloud", value: 25, color: "var(--chart-1)" },
  { name: "AI", value: 20, color: "var(--chart-2)" },
  { name: "TI", value: 20, color: "var(--chart-3)" },
  { name: "ESU", value: 15, color: "var(--chart-4)" },
  { name: "CBO", value: 20, color: "var(--chart-5)" },
]

const accountData = [
  { name: "Equitable Holdings", value: 30, color: "var(--chart-1)" },
  { name: "Prudential Insurance", value: 25, color: "var(--chart-2)" },
  { name: "AIG", value: 20, color: "var(--chart-3)" },
  { name: "NYL", value: 15, color: "var(--chart-4)" },
  { name: "GenWok", value: 10, color: "var(--chart-5)" },
]

const getAccountRecords = (name: string, value: number) => {
  return generateRevenueRecords(name, value)
}

interface RevenueModuleProps {
  onProjectSelect: (project: string) => void
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

const renderLegend = (props: any) => {
  const { payload } = props
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {value}
    </text>
  )
}

export function RevenueModule({ onProjectSelect }: RevenueModuleProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const [detailView, setDetailView] = useState<{ isOpen: boolean; division: string; data: RevenueRecord[] }>({
    isOpen: false,
    division: "",
    data: [],
  })

  const handleDataClick = (name: string, value: number) => {
    onProjectSelect(name)
    const records = generateRevenueRecords(name, value)
    setDetailView({ isOpen: true, division: name, data: records })
  }

  const handleClick = (index: number) => {
    const division = revenueData[index]
    handleDataClick(division.name, division.value)
  }

  const revenueColumns = [
    { key: "id", label: "Project ID" },
    { key: "projectName", label: "Project Name" },
    { key: "client", label: "Client" },
    { key: "value", label: "Value (Cr)" },
    { key: "status", label: "Status" },
    { key: "projectManager", label: "Project Manager" },
    { key: "teamSize", label: "Team Size" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 10

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
    <Card id="revenue-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Total Target: INR 100 Cr</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">₹100 Cr</div>
            <div className="text-sm text-muted-foreground">Total Revenue Target</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!detailView.isOpen ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(undefined)}
                    onClick={(_, index) => handleClick(index)}
                    className="cursor-pointer"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-muted-foreground text-center">Interactive Distribution</p>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Account-wise Revenue
              </h4>
              <div className="space-y-4">
                {accountData.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleDataClick(item.name, item.value)}
                    className="group w-full space-y-1.5 transition-opacity hover:opacity-80"
                  >
                    <div className="flex items-center justify-between text-xs font-medium px-1">
                      <span className="truncate">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₹{item.value} Cr</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-px h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                      {/* Target Partition */}
                      <div className="relative bg-muted/10 px-2 flex items-center">
                        <div
                          className="absolute inset-y-0 left-0 opacity-20 transition-all duration-1000"
                          style={{ backgroundColor: item.color, width: "100%" }}
                        />
                        <span className="relative text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          Target
                        </span>
                      </div>
                      {/* Current Partition (80% of Target) */}
                      <div className="relative bg-muted/10 px-2 flex items-center">
                        <div
                          className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                          style={{ backgroundColor: item.color, width: "80%" }}
                        />
                        <span className="relative text-[10px] text-foreground font-bold ml-auto">
                          ₹{(item.value * 0.8).toFixed(1)} Cr
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Service Line-wise Revenue
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {revenueData.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => handleClick(index)}
                    className="group flex items-center justify-between rounded-md border border-border bg-card p-3 text-sm transition-all hover:border-primary hover:shadow-md min-w-0 w-full"
                  >
                    <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div
                        className="h-3 w-3 shrink-0 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold truncate whitespace-nowrap">{item.name} Solutions</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-primary">₹{item.value} Cr</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {detailView.division} Division - Project Details ({detailView.data.length} records)
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
                      {revenueColumns.map((col) => (
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
                        {revenueColumns.map((col) => (
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
