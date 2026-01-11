import * as XLSX from "xlsx"

export interface ExcelData {
  revenue: Record<string, number>[]
  margin: Record<string, number>[]
  opportunities: Record<string, number>[]
  quarters: string[]
  accounts: string[]
}

let cachedData: ExcelData | null = null

export async function parseExcelFile(): Promise<ExcelData> {
  // Return cached data if available
  if (cachedData) {
    return cachedData
  }

  try {
    // Fetch the Excel file from public folder
    const response = await fetch("/synthetic-data.xlsx")
    const arrayBuffer = await response.arrayBuffer()

    // Parse the workbook
    const workbook = XLSX.read(arrayBuffer, { type: "array" })

    // Extract data from different sheets
    const revenueSheet = workbook.Sheets["Revenue"] || workbook.Sheets[workbook.SheetNames[0]]
    const marginSheet = workbook.Sheets["Margin"]
    const opportunitiesSheet = workbook.Sheets["Opportunities"]

    const revenueData = XLSX.utils.sheet_to_json(revenueSheet)
    const marginData = marginSheet ? XLSX.utils.sheet_to_json(marginSheet) : []
    const opportunitiesData = opportunitiesSheet ? XLSX.utils.sheet_to_json(opportunitiesSheet) : []

    cachedData = {
      revenue: revenueData,
      margin: marginData,
      opportunities: opportunitiesData,
      quarters: extractQuarters(revenueData),
      accounts: extractAccounts(revenueData),
    }

    return cachedData
  } catch (error) {
    console.error("Error parsing Excel file:", error)
    // Return empty structure if file not found
    return {
      revenue: [],
      margin: [],
      opportunities: [],
      quarters: [],
      accounts: [],
    }
  }
}

function extractQuarters(data: Record<string, number>[]): string[] {
  if (data.length === 0) return []
  const quarters = new Set<string>()

  Object.keys(data[0]).forEach((key) => {
    if (key !== "Account" && key !== "Service Line" && key !== "Division") {
      quarters.add(key)
    }
  })

  return Array.from(quarters)
}

function extractAccounts(data: Record<string, number>[]): string[] {
  return data
    .map((row) => row.Account as string)
    .filter((account): account is string => !!account)
    .filter((value, index, self) => self.indexOf(value) === index)
}

export function getRevenueByAccount(account: string, quarter: string, data: ExcelData): number {
  const row = data.revenue.find((r) => r.Account === account)
  return row ? (row[quarter] as number) || 0 : 0
}

export function getMarginByAccount(account: string, quarter: string, data: ExcelData): number {
  const row = data.margin.find((r) => r.Account === account)
  return row ? (row[quarter] as number) || 0 : 0
}

export function getOpportunitiesByDivision(
  division: string,
  quarter: string,
  data: ExcelData,
): { total: number; closed: number; inProgress: number; notStarted: number } {
  const row = data.opportunities.find((r) => r["Division"] === division)
  if (!row) return { total: 0, closed: 0, inProgress: 0, notStarted: 0 }

  return {
    total: (row[`${quarter}_Total`] as number) || 0,
    closed: (row[`${quarter}_Closed`] as number) || 0,
    inProgress: (row[`${quarter}_InProgress`] as number) || 0,
    notStarted: (row[`${quarter}_NotStarted`] as number) || 0,
  }
}
