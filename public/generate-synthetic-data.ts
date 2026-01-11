// This can be run to create the synthetic-data.xlsx file

import * as XLSX from "xlsx"

const accounts = ["Equitable Holdings", "Prudential Insurance", "AIG", "NYL", "GenWok"]
const divisions = ["Cloud", "AI", "TI", "ESU", "CBO"]
const quarters = [
  "Year 2024 - 2025",
  "Apr 2025 - Jun 2025",
  "Jul 2025 - Sep 2025",
  "Oct 2025 - Dec 2025",
  "Jan 2026 - Mar 2026",
  "Year 2025 - 2026",
]

function generateRevenueData() {
  const data = []

  for (const account of accounts) {
    const row: Record<string, any> = { Account: account }

    for (const quarter of quarters) {
      // Generate revenue between 5-30 Cr per account per quarter
      row[quarter] = Math.floor(Math.random() * 25) + 5
    }

    data.push(row)
  }

  // Add totals row
  const totalsRow: Record<string, any> = { Account: "Total" }
  for (const quarter of quarters) {
    totalsRow[quarter] = data.reduce((sum, row) => sum + (row[quarter] || 0), 0)
  }
  data.push(totalsRow)

  return data
}

function generateMarginData() {
  const data = []

  for (const account of accounts) {
    const row: Record<string, any> = { Account: account }

    for (const quarter of quarters) {
      // Generate margin as 80% of some base value
      row[quarter] = Math.floor(Math.random() * 20) + 4
    }

    data.push(row)
  }

  const totalsRow: Record<string, any> = { Account: "Total" }
  for (const quarter of quarters) {
    totalsRow[quarter] = data.reduce((sum, row) => sum + (row[quarter] || 0), 0)
  }
  data.push(totalsRow)

  return data
}

function generateOpportunitiesData() {
  const data = []

  for (const division of divisions) {
    const row: Record<string, any> = { Division: division }

    for (const quarter of quarters) {
      const total = Math.floor(Math.random() * 100) + 50
      const closed = Math.floor(total * 0.7)
      const inProgress = Math.floor(total * 0.18)
      const notStarted = total - closed - inProgress

      row[`${quarter}_Total`] = total
      row[`${quarter}_Closed`] = closed
      row[`${quarter}_InProgress`] = inProgress
      row[`${quarter}_NotStarted`] = notStarted
    }

    data.push(row)
  }

  return data
}

export function generateExcelFile() {
  const workbook = XLSX.utils.book_new()

  // Create sheets
  const revenueSheet = XLSX.utils.json_to_sheet(generateRevenueData())
  const marginSheet = XLSX.utils.json_to_sheet(generateMarginData())
  const opportunitiesSheet = XLSX.utils.json_to_sheet(generateOpportunitiesData())

  XLSX.utils.book_append_sheet(workbook, revenueSheet, "Revenue")
  XLSX.utils.book_append_sheet(workbook, marginSheet, "Margin")
  XLSX.utils.book_append_sheet(workbook, opportunitiesSheet, "Opportunities")

  XLSX.writeFile(workbook, "synthetic-data.xlsx")
}
