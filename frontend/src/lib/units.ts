export type Unit = 'C' | 'F'

export function convertTemp(celsius: number, unit: Unit): number {
  return Math.round(unit === 'C' ? celsius : (celsius * 9) / 5 + 32)
}