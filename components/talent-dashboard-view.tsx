"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Upload, Eye, Search } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TalentDashboardViewProps {
  isOpen: boolean
  onClose: () => void
}

interface DenormViewState {
  isOpen: boolean
  type: "requirements" | "releases" | "applications" | "awaiting" | "matched" | null
  data: any[]
  title: string
}

interface DetailViewState {
  isOpen: boolean
  title: string
}

const talentData = {
  availableRequirements: 125,
  releaseCount: 98,
  applicationCount: 87,
}

// Generate synthetic requirements
const generateRequirements = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `REQ-${String(i + 1).padStart(5, "0")}`,
    positionTitle: ["Senior Developer", "DevOps Engineer", "Data Scientist", "Product Manager", "QA Lead"][i % 5],
    division: ["Cloud", "AI", "TI", "ESU", "CBO"][i % 5],
    status: ["Open", "In Progress", "On Hold"][i % 3],
    account: ["Equitable Holdings", "Prudential Insurance", "AIG", "NYL", "GenWok"][i % 5],
    skillset: ["Python, AWS", "Kubernetes, Docker", "ML/TensorFlow", "Agile, Jira", "Automation"][i % 5],
    priority: ["High", "Medium", "Low"][i % 3],
    openedDate: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
  }))

// Generate synthetic releases
const generateReleases = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `REL-${String(i + 1).padStart(5, "0")}`,
    associateName: ["John Smith", "Sarah Johnson", "Mike Chen", "Alice Brown", "David Kumar"][i % 5],
    division: ["Cloud", "AI", "TI", "ESU", "CBO"][i % 5],
    releaseDate: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
    skillSet: ["Python, AWS", "Kubernetes, Docker", "ML/TensorFlow", "Agile, Jira", "Automation"][i % 5],
    lastProjectDuration: `${Math.floor(Math.random() * 24) + 6} months`,
    status: ["Released", "In Notice Period"][i % 2],
    account: ["Equitable Holdings", "Prudential Insurance", "AIG", "NYL", "GenWok"][i % 5],
  }))

// Generate synthetic applications
const generateApplications = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `APP-${String(i + 1).padStart(5, "0")}`,
    associateName: ["Emma Wilson", "Robert Taylor", "Lisa Anderson", "James Martinez", "Patricia Lee"][i % 5],
    appliedForPosition: ["Senior Developer", "DevOps Engineer", "Data Scientist", "Product Manager", "QA Lead"][i % 5],
    division: ["Cloud", "AI", "TI", "ESU", "CBO"][i % 5],
    applicationDate: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
    skillMatch: ["100%", "85%", "75%", "90%", "80%"][i % 5],
    status: ["Pending", "Shortlisted", "Rejected", "Under Review"][i % 4],
    currentLocation: ["Onshore", "Nearshore", "Offshore"][i % 3],
  }))

// Generate synthetic assignments
const generateAssignments = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `ASGN-${String(i + 1).padStart(5, "0")}`,
    associateName: ["Michael O'Brien", "Sophia Garcia", "David Lee", "Jennifer Lopez", "Christopher Davis"][i % 5],
    assignmentDate: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
    matchedRequirement: `REQ-${String(Math.floor(Math.random() * 125) + 1).padStart(5, "0")}`,
    status: ["Assigned", "Pending Confirmation"][i % 2],
    skillMatch: ["100%", "95%", "90%", "85%"][i % 4],
    division: ["Cloud", "AI", "TI", "ESU", "CBO"][i % 5],
    account: ["Equitable Holdings", "Prudential Insurance", "AIG", "NYL", "GenWok"][i % 5],
  }))

// Data for awaiting assignments
const awaitingAssignmentsData = [
  { division: "Cloud", awaiting: 12, assigned: 20 },
  { division: "AI", awaiting: 8, assigned: 15 },
  { division: "TI", awaiting: 10, assigned: 18 },
  { division: "ESU", awaiting: 7, assigned: 16 },
  { division: "CBO", awaiting: 5, assigned: 12 },
  { division: "ADM", awaiting: 3, assigned: 9 },
]

// Data for matched profiles
const matchedProfilesData = [
  { division: "Cloud", skilled: 18, partiallySkilled: 5, unskilled: 2 },
  { division: "AI", skilled: 12, partiallySkilled: 4, unskilled: 1 },
  { division: "TI", skilled: 15, partiallySkilled: 3, unskilled: 2 },
  { division: "ESU", skilled: 14, partiallySkilled: 3, unskilled: 1 },
  { division: "CBO", skilled: 10, partiallySkilled: 2, unskilled: 1 },
  { division: "ADM", skilled: 7, partiallySkilled: 1, unskilled: 0 },
]

export function TalentDashboardView({ isOpen, onClose }: TalentDashboardViewProps) {
  const [denormView, setDenormView] = useState<DenormViewState>({
    isOpen: false,
    type: null,
    data: [],
    title: "",
  })
  const [detailView, setDetailView] = useState<DetailViewState>({
    isOpen: false,
    title: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const denormSectionRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 10

  const handleRequirementClick = () => {
    const data = generateRequirements(talentData.availableRequirements)
    setDenormView({
      isOpen: true,
      type: "requirements",
      data,
      title: `Requirements - ${talentData.availableRequirements} Open Positions`,
    })
    setSearchQuery("")
    setCurrentPage(1)
    setTimeout(() => denormSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleReleaseClick = () => {
    const data = generateReleases(talentData.releaseCount)
    setDenormView({
      isOpen: true,
      type: "releases",
      data,
      title: `Releases - ${talentData.releaseCount} Released Associates`,
    })
    setSearchQuery("")
    setCurrentPage(1)
    setTimeout(() => denormSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleApplicationClick = () => {
    const data = generateApplications(talentData.applicationCount)
    setDenormView({
      isOpen: true,
      type: "applications",
      data,
      title: `Applications - ${talentData.applicationCount} Received`,
    })
    setSearchQuery("")
    setCurrentPage(1)
    setTimeout(() => denormSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleChartClick = (division: string, metric: string, count: number) => {
    let data: any[] = []
    if (metric.includes("Awaiting")) {
      data = generateAssignments(count)
    } else {
      data = generateAssignments(count)
    }
    setDenormView({
      isOpen: true,
      type: metric.includes("Awaiting") ? "awaiting" : "matched",
      data,
      title: `${division} - ${metric} (${count} Records)`,
    })
    setSearchQuery("")
    setCurrentPage(1)
    setTimeout(() => denormSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  const handleFileUpload = (fileType: string) => {
    alert(`Opening file dialog to upload ${fileType}. In a real app, this would trigger a file input.`)
  }

  const getColumns = () => {
    switch (denormView.type) {
      case "requirements":
        return ["id", "positionTitle", "division", "status", "skillset", "priority", "openedDate", "account"]
      case "releases":
        return ["id", "associateName", "division", "releaseDate", "skillSet", "status", "account"]
      case "applications":
        return ["id", "associateName", "appliedForPosition", "division", "applicationDate", "skillMatch", "status"]
      case "awaiting":
      case "matched":
        return ["id", "associateName", "assignmentDate", "division", "account", "status", "skillMatch"]
      default:
        return []
    }
  }

  const getColumnLabels = () => {
    const labels: { [key: string]: string } = {
      id: "ID",
      positionTitle: "Position",
      division: "Division",
      status: "Status",
      skillset: "Skillset",
      priority: "Priority",
      openedDate: "Opened Date",
      account: "Account",
      associateName: "Associate Name",
      releaseDate: "Release Date",
      skillSet: "Skill Set",
      appliedForPosition: "Applied Position",
      applicationDate: "Application Date",
      skillMatch: "Skill Match",
      currentLocation: "Location",
      assignmentDate: "Assignment Date",
      matchedRequirement: "Matched Requirement",
      lastProjectDuration: "Project Duration",
    }
    return labels
  }

  const filteredData = denormView.data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = String(a[sortColumn])
    const bVal = String(b[sortColumn])
    return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background">
      <div className="min-h-screen">
        <Card className="m-6 rounded-lg border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Talent Market Outlook - Detailed View</CardTitle>
              <Button variant="outline" size="sm" onClick={onClose}>
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Top 30% Section: Three Info Boxes */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Requirement Count Box */}
              <div className="rounded-lg border-2 border-border bg-card p-8 space-y-4">
                <div
                  onClick={handleRequirementClick}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-sm font-medium text-muted-foreground">Requirement Count</div>
                  <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-4)" }}>
                    {talentData.availableRequirements}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Open positions</div>
                </div>
                <Button
                  className="w-full bg-chart-4 text-foreground hover:opacity-80"
                  onClick={() => handleFileUpload("Requirements (.csv)")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Requirements
                </Button>
              </div>

              {/* Release Count Box */}
              <div className="rounded-lg border-2 border-border bg-card p-8 space-y-4">
                <div
                  onClick={handleReleaseClick}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-sm font-medium text-muted-foreground">Release Count</div>
                  <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-2)" }}>
                    {talentData.releaseCount}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Associates released</div>
                </div>
                <Button
                  className="w-full bg-chart-2 text-foreground hover:opacity-80"
                  onClick={() => handleFileUpload("Released Associates (.csv)")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Associates
                </Button>
              </div>

              {/* Application Count Box */}
              <div className="rounded-lg border-2 border-border bg-card p-8 space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Application Count</div>
                  <div className="mt-3 text-4xl font-bold" style={{ color: "var(--chart-5)" }}>
                    {talentData.applicationCount}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Applications received</div>
                </div>
                <Button
                  className="w-full bg-chart-5 text-foreground hover:opacity-80"
                  onClick={handleApplicationClick}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Applications
                </Button>
              </div>
            </div>

            {/* Bottom 70% Section: Two Chart Boxes */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Box: Awaiting Assignments */}
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Awaiting Assignments</h3>
                  <p className="text-sm text-muted-foreground mt-1">Division-wise assignment status</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={awaitingAssignmentsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="division" stroke="var(--border)" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis stroke="var(--border)" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} formatter={(value) => <span style={{ fontSize: "12px" }}>{value}</span>} />
                    <Bar
                      dataKey="awaiting"
                      fill="#FFB6C1"
                      name="Awaiting"
                      onClick={(data) => handleChartClick(data.division, "Awaiting Assignments", data.awaiting)}
                      className="cursor-pointer"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="assigned"
                      fill="#A8E6CF"
                      name="Assigned"
                      onClick={(data) => handleChartClick(data.division, "Assigned", data.assigned)}
                      className="cursor-pointer"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Right Box: Matched Profiles */}
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Matched Profiles</h3>
                  <p className="text-sm text-muted-foreground mt-1">Division-wise skill match distribution</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={matchedProfilesData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="division" stroke="var(--border)" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis stroke="var(--border)" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} formatter={(value) => <span style={{ fontSize: "12px" }}>{value}</span>} />
                    <Bar
                      dataKey="skilled"
                      fill="#A8E6CF"
                      name="Skilled"
                      onClick={(data) => handleChartClick(data.division, "Skilled Profiles", data.skilled)}
                      className="cursor-pointer"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="partiallySkilled"
                      fill="#FFD7BA"
                      name="Partially Skilled"
                      onClick={(data) => handleChartClick(data.division, "Partially Skilled", data.partiallySkilled)}
                      className="cursor-pointer"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="unskilled"
                      fill="#FFB6C1"
                      name="Unskilled"
                      onClick={(data) => handleChartClick(data.division, "Unskilled Profiles", data.unskilled)}
                      className="cursor-pointer"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Denormalized View Section */}
            {denormView.isOpen && (
              <div ref={denormSectionRef} className="mt-8 rounded-lg border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{denormView.title}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setDenormView({ ...denormView, isOpen: false })}>
                    Close
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border border-border">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="border-0 bg-transparent focus-visible:ring-0"
                  />
                </div>

                {/* Records Table */}
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        {getColumns().map((col) => (
                          <th
                            key={col}
                            onClick={() => {
                              if (sortColumn === col) {
                                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                              } else {
                                setSortColumn(col)
                                setSortDirection("asc")
                              }
                            }}
                            className="px-4 py-2 text-left font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                          >
                            {getColumnLabels()[col]} {sortColumn === col && (sortDirection === "asc" ? "↑" : "↓")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item, idx) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                          {getColumns().map((col) => (
                            <td key={col} className="px-4 py-2 truncate">
                              {String(item[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
                    {sortedData.length} records
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
