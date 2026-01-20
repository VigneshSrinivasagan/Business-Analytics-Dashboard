"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateRevenueRecords, type RevenueRecord } from "@/lib/synthetic-data"

interface MarginModuleProps {
  onProjectSelect: (project: string) => void
  accounts: string[]
  serviceLines: string[]
}

export function MarginModule({ onProjectSelect, accounts, serviceLines }: MarginModuleProps) {
  const [detailView, setDetailView] = useState<{ isOpen: boolean; division: string; data: RevenueRecord[] }>({
    isOpen: false,
    division: "",
    data: [],
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 10

  const handleDataClick = (name: string, value: number) => {
    onProjectSelect(name)
    const records = generateRevenueRecords(name, value)
    setDetailView({ isOpen: true, division: name, data: records })
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

  const marginDataAccounts = accounts.map((name, idx) => ({
    name,
    value: [24, 20, 16, 12, 8][idx] || 8,
    color: `var(--chart-${(idx % 5) + 1})`,
  }))

  const marginDataServiceLines = serviceLines.map((name, idx) => ({
    name,
    value: [20, 16, 16, 12, 16][idx] || 16,
    color: `var(--chart-${(idx % 5) + 1})`,
  }))

  const marginColumns = [
    { key: "id", label: "Project ID" },
    { key: "projectName", label: "Project Name" },
    { key: "client", label: "Client" },
    { key: "value", label: "Margin (Cr)" },
    { key: "status", label: "Status" },
    { key: "projectManager", label: "Project Manager" },
    { key: "teamSize", label: "Team Size" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
  ]

  return (
    <Card id="margin-module">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Margin Distribution</CardTitle>
            <CardDescription>Total Target: INR 80 Cr</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">₹80 Cr</div>
            <div className="text-sm text-muted-foreground">Total Margin Target</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!detailView.isOpen ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Section: Account-wise Margin */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 bg-card z-10 py-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Account-wise Margin
              </h4>
              <div className="space-y-4">
                {marginDataAccounts.map((item) => (
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
                      <div className="relative bg-muted/10 px-2 flex items-center">
                        <div
                          className="absolute inset-y-0 left-0 opacity-20 transition-all duration-1000"
                          style={{ backgroundColor: item.color, width: "100%" }}
                        />
                        <span className="relative text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          Target
                        </span>
                      </div>
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

            {/* Right Section: Serviceline-wise Margin */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 bg-card z-10 py-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Serviceline-wise Margin
              </h4>
              <div className="space-y-4">
                {marginDataServiceLines.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleDataClick(item.name, item.value)}
                    className="group w-full space-y-1.5 transition-opacity hover:opacity-80"
                  >
                    <div className="flex items-center justify-between text-xs font-medium px-1">
                      <span className="truncate">{item.name} Solutions</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₹{item.value} Cr</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-px h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                      <div className="relative bg-muted/10 px-2 flex items-center">
                        <div
                          className="absolute inset-y-0 left-0 opacity-20 transition-all duration-1000"
                          style={{ backgroundColor: item.color, width: "100%" }}
                        />
                        <span className="relative text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          Target
                        </span>
                      </div>
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
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {detailView.division} Division - Margin Details ({detailView.data.length} records)
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
                      {marginColumns.map((col) => (
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
                        {marginColumns.map((col) => (
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
