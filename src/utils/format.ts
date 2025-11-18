export function formatCell(value: any, maxWidth: number): string {
  if (value === null || value === undefined) {
    return "NULL"
  }
  
  const str = String(value)
  if (str.length <= maxWidth) {
    return str
  }
  
  return str.slice(0, maxWidth - 1) + "…"
}

export function isNumeric(value: any): boolean {
  return typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))
}

export function alignCell(value: string, width: number, numeric: boolean): string {
  if (numeric) {
    return value.padStart(width)
  }
  return value.padEnd(width)
}
