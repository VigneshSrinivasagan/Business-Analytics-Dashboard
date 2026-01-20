"use client"

import { Tooltip } from "@/components/ui/tooltip"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { generateRequirements, type RequirementRecord } from "@/lib/synthetic-data"

// Declare chartColors variable
const chartColors = {
  open: "#4CAF50",
  closed: "#F44336",
}

interface RequirementsSplitViewProps {
  isOpen: boolean
  onClose: () => void
  accounts: string[]
}

// Account-wise and BRM data structure
const getAccountWiseRequirements = (accounts: string[]) => {
  return accounts.map((account, idx) => ({
    name: account,
    open: [45, 38, 52, 35, 48][idx] || 40,
    closed: [25, 30, 28, 22, 32][idx] || 25,
  }))
}

const getBRMWiseRequirements = (account: string) => {
  const brmData: { [key: string]: any[] } = {
    "Equitable Holdings": [
      { name: "BRM1", open: 25, closed: 5 },
      { name: "BRM2", open: 35, closed: 15 },
      { name: "BRM3", open: 15, closed: 3 },
    ],
    "Prudential Insurance": [
      { name: "BRM1", open: 20, closed: 8 },
      { name: "BRM2", open: 38, closed: 12 },
      { name: "BRM3", open: 10, closed: 5 },
    ],
    AIG: [
      { name: "BRM1", open: 30, closed: 10 },
      { name: "BRM2", open: 32, closed: 18 },
      { name: "BRM3", open: 18, closed: 6 },
    ],
    NYL: [
      { name: "BRM1", open: 22, closed: 7 },
      { name: "BRM2", open: 28, closed: 10 },
      { name: "BRM3", open: 12, closed: 4 },
    ],
    GenWok: [
      { name: "BRM1", open: 28, closed: 9 },
      { name: "BRM2", open: 32, closed: 14 },
      { name: "BRM3", open: 16, closed: 5 },
    ],
  }
  return brmData[account] || brmData["Equitable Holdings"]
}

export function RequirementsSplitView({ isOpen, onClose, accounts }: RequirementsSplitViewProps) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0] || "Equitable Holdings")
  const [detailView, setDetailView] = useState<{ isOpen: boolean; data: RequirementRecord[]; title: string }>({
    isOpen: false,
    data: [],
    title: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 10

  const accountWiseData = getAccountWiseRequirements(accounts)
  const brmWiseData = getBRMWiseRequirements(selectedAccount)

  const requirementColumns = [
    { key: "id", label: "Requirement ID" },
    { key: "positionTitle", label: "Position" },
    { key: "type", label: "Type" },
    { key: "division", label: "Division" },
    { key: "location", label: "Location" },
    { key: "skillset", label: "Skillset" },
    { key: "priority", label: "Priority" },
    { key: "openedDate", label: "Opened Date" },
  ]

  const handleBarClick = (name: string, count: number, chartType: "account" | "brm") => {
    const records = generateRequirements(count, "MOT")
    setDetailView({
      isOpen: true,
      data: records,
      title: `${chartType === "account" ? `${name} - Open Requirements` : `${selectedAccount} - ${name}`}`,
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      <div className="min-h-screen bg-background">
        <Card className="m-6 rounded-lg border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Requirements - Account & BRM Split View</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!detailView.isOpen ? (
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Segment: Account-wise Requirements */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Account-wise Open/Closed Requirements
                  </h4>
                  <div className="space-y-4">
                    {accountWiseData.map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="text-xs font-medium text-foreground">{item.name}</div>
                        <div className="space-y-2">
                          {/* Open bar */}
                          <button
                            onClick={() => handleBarClick(item.name, item.open, "account")}
                            className="group w-full text-left hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Open</span>
                              <span className="font-bold text-foreground">{item.open}</span>
                            </div>
                            <div className="relative h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                              <div
                                className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                                style={{ backgroundColor: chartColors.open, width: `${(item.open / 60) * 100}%` }}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <span className="text-xs font-bold text-foreground">{">"}</span>
                              </div>
                            </div>
                          </button>
                          {/* Closed bar */}
                          <button
                            onClick={() => handleBarClick(item.name, item.closed, "account")}
                            className="group w-full text-left hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Closed</span>
                              <span className="font-bold text-foreground">{item.closed}</span>
                            </div>
                            <div className="relative h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                              <div
                                className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                                style={{ backgroundColor: chartColors.closed, width: `${(item.closed / 60) * 100}%` }}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <span className="text-xs font-bold text-foreground">{">"}</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Segment: BRM-wise Breakdown */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {selectedAccount} - BRM-wise Open/Closed Requirements
                  </h4>
                  
                  {/* Account Quick Select Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {accounts.map((account) => (
                      <button
                        key={account}
                        onClick={() => setSelectedAccount(account)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          selectedAccount === account
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {account.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {brmWiseData.map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="text-xs font-medium text-foreground">{item.name}</div>
                        <div className="space-y-2">
                          {/* Open bar */}
                          <button
                            onClick={() => handleBarClick(item.name, item.open, "brm")}
                            className="group w-full text-left hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Open</span>
                              <span className="font-bold text-foreground">{item.open}</span>
                            </div>
                            <div className="relative h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                              <div
                                className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                                style={{ backgroundColor: chartColors.open, width: `${(item.open / 40) * 100}%` }}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <span className="text-xs font-bold text-foreground">{">"}</span>
                              </div>
                            </div>
                          </button>
                          {/* Closed bar */}
                          <button
                            onClick={() => handleBarClick(item.name, item.closed, "brm")}
                            className="group w-full text-left hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Closed</span>
                              <span className="font-bold text-foreground">{item.closed}</span>
                            </div>
                            <div className="relative h-6 w-full rounded-sm overflow-hidden bg-muted/20 border border-border/50">
                              <div
                                className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                                style={{ backgroundColor: chartColors.closed, width: `${(item.closed / 40) * 100}%` }}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <span className="text-xs font-bold text-foreground">{">"}</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
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
                    Back to Charts
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
                          {requirementColumns.map((col) => (
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
                            {requirementColumns.map((col) => (
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
      </div>
    </div>
  )
}
