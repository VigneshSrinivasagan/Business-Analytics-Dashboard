export interface OpportunityRecord {
  id: string
  name: string
  client: string
  value: number
  status: "Closed" | "In Progress" | "Not Started"
  division: string
  owner: string
  createdDate: string
  closureDate?: string
}

export interface WorkforceRecord {
  id: string
  employeeName: string
  role: string
  location: "Onshore" | "Nearshore" | "Offshore"
  skill: string
  experience: number
  status: string
  assignedProject: string
  startDate: string
}

export interface RequirementRecord {
  id: string
  positionTitle: string
  type: "MOT" | "NON-MOT"
  division: string
  location: string
  skillset: string
  experienceRequired: string
  priority: string
  openedDate: string
  assignedTo: string
}

export interface FulfilmentRecord {
  id: string
  positionTitle: string
  candidateName: string
  type: "MOT" | "NON-MOT"
  status: "Open" | "Closed"
  division: string
  location: string
  joinDate?: string
  recruiter: string
  daysOpen: number
}

export interface RevenueRecord {
  id: string
  projectName: string
  division: string
  client: string
  value: number
  status: "Active" | "Completed" | "In Progress"
  startDate: string
  endDate?: string
  projectManager: string
  teamSize: number
}

// Generate synthetic opportunities
export function generateOpportunities(
  count: number,
  status: "Closed" | "In Progress" | "Not Started",
): OpportunityRecord[] {
  const clients = ["Acme Corp", "TechGlobal", "InnovateLabs", "DataFlow Inc", "CloudVentures", "NextGen Systems"]
  const divisions = ["Cloud", "AI", "TI", "ESU", "CBO"]
  const owners = ["Sarah Johnson", "Mike Chen", "Emily Rodriguez", "David Kim", "Lisa Wang"]

  return Array.from({ length: count }, (_, i) => ({
    id: `OPP-${status.replace(/\s+/g, '-')}-${String(i + 1).padStart(4, "0")}`,
    name: `${divisions[i % divisions.length]} Implementation Project ${i + 1}`,
    client: clients[Math.floor(Math.random() * clients.length)],
    value: Math.floor(Math.random() * 5) + 0.5,
    status,
    division: divisions[i % divisions.length],
    owner: owners[Math.floor(Math.random() * owners.length)],
    createdDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split("T")[0],
    closureDate:
      status === "Closed"
        ? new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0]
        : undefined,
  }))
}

// Generate synthetic workforce
export function generateWorkforce(count: number, location: "Onshore" | "Nearshore" | "Offshore"): WorkforceRecord[] {
  const roles = [
    "Software Engineer",
    "DevOps Engineer",
    "Data Scientist",
    "Cloud Architect",
    "QA Engineer",
    "Project Manager",
  ]
  const skills = ["React", "Python", "AWS", "Kubernetes", "Java", "Node.js", "Azure", "ML/AI"]
  const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta", "Project Epsilon"]
  const names = ["Alex Thompson", "Jamie Lee", "Taylor Brown", "Jordan Davis", "Casey Miller", "Morgan Wilson"]

  return Array.from({ length: count }, (_, i) => ({
    id: `EMP-${location.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, "0")}`,
    employeeName: names[Math.floor(Math.random() * names.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    location,
    skill: skills[Math.floor(Math.random() * skills.length)],
    experience: Math.floor(Math.random() * 10) + 1,
    status: Math.random() > 0.2 ? "Active" : "On Bench",
    assignedProject: projects[Math.floor(Math.random() * projects.length)],
    startDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split("T")[0],
  }))
}

// Generate synthetic requirements
export function generateRequirements(count: number, type: "MOT" | "NON-MOT"): RequirementRecord[] {
  const positions = ["Senior Developer", "Lead Architect", "DevOps Specialist", "Data Engineer", "Product Manager"]
  const divisions = ["Cloud", "AI", "TI", "ESU", "CBO"]
  const locations = ["USA", "UK", "India", "Singapore", "Germany"]
  const skills = ["React/Node.js", "Python/ML", "AWS/Azure", "Java/Spring", "Data Analytics"]
  const priorities = ["High", "Medium", "Critical", "Low"]
  const recruiters = ["HR Team A", "HR Team B", "HR Team C", "External Agency"]

  return Array.from({ length: count }, (_, i) => ({
    id: `REQ-${type}-${String(i + 1).padStart(4, "0")}`,
    positionTitle: positions[Math.floor(Math.random() * positions.length)],
    type,
    division: divisions[i % divisions.length],
    location: locations[Math.floor(Math.random() * locations.length)],
    skillset: skills[Math.floor(Math.random() * skills.length)],
    experienceRequired: `${Math.floor(Math.random() * 8) + 2}-${Math.floor(Math.random() * 5) + 10} years`,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    openedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split("T")[0],
    assignedTo: recruiters[Math.floor(Math.random() * recruiters.length)],
  }))
}

// Generate synthetic fulfilments
export function generateFulfilments(
  count: number,
  type: "MOT" | "NON-MOT",
  status: "Open" | "Closed",
): FulfilmentRecord[] {
  const positions = ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "Cloud Engineer", "QA Lead"]
  const candidates = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown", "Diana Prince"]
  const divisions = ["Cloud", "AI", "TI", "ESU", "CBO"]
  const locations = ["Onshore", "Nearshore", "Offshore"]
  const recruiters = ["Sarah HR", "Mike Talent", "Emily Recruiter", "David Hiring"]

  return Array.from({ length: count }, (_, i) => ({
    id: `FUL-${type}-${status}-${String(i + 1).padStart(4, "0")}`,
    positionTitle: positions[Math.floor(Math.random() * positions.length)],
    candidateName: status === "Closed" ? candidates[Math.floor(Math.random() * candidates.length)] : "TBD",
    type,
    status,
    division: divisions[i % divisions.length],
    location: locations[Math.floor(Math.random() * locations.length)],
    joinDate:
      status === "Closed"
        ? new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0]
        : undefined,
    recruiter: recruiters[Math.floor(Math.random() * recruiters.length)],
    daysOpen: Math.floor(Math.random() * 90) + 1,
  }))
}

export function generateRevenueRecords(division: string, totalValue: number): RevenueRecord[] {
  const clients = [
    "Acme Corp",
    "TechGlobal",
    "InnovateLabs",
    "DataFlow Inc",
    "CloudVentures",
    "NextGen Systems",
    "FutureTech",
    "GlobalSolutions",
  ]
  const managers = [
    "Sarah Johnson",
    "Mike Chen",
    "Emily Rodriguez",
    "David Kim",
    "Lisa Wang",
    "James Brown",
    "Maria Garcia",
  ]
  const statuses: ("Active" | "Completed" | "In Progress")[] = ["Active", "Completed", "In Progress"]

  // Generate 15-25 projects for each division
  const projectCount = Math.floor(Math.random() * 11) + 15
  const records: RevenueRecord[] = []

  for (let i = 0; i < projectCount; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const startDate = new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1)
    const value = Number.parseFloat((Math.random() * (totalValue / 10) + 0.5).toFixed(2))

    records.push({
      id: `${division.toUpperCase()}-PRJ-${String(i + 1).padStart(4, "0")}`,
      projectName: `${division} ${["Digital Transformation", "Cloud Migration", "AI Implementation", "Infrastructure Upgrade", "Security Enhancement"][i % 5]} ${i + 1}`,
      division,
      client: clients[Math.floor(Math.random() * clients.length)],
      value,
      status,
      startDate: startDate.toISOString().split("T")[0],
      endDate:
        status === "Completed"
          ? new Date(startDate.getTime() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : undefined,
      projectManager: managers[Math.floor(Math.random() * managers.length)],
      teamSize: Math.floor(Math.random() * 20) + 5,
    })
  }

  return records
}
