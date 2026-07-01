import type { Seat, SeatCategory, ShowConfig } from '../types/booking'

export function getRowLabels(rows: number): string[] {
  return Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i),
  )
}

export function parseSeatId(id: string): { row: string; col: number } {
  const match = id.match(/^([A-Z]+)(\d+)$/)
  if (!match) {
    throw new Error(`Invalid seat id: ${id}`)
  }
  return { row: match[1], col: Number.parseInt(match[2], 10) }
}

export function formatSeatId(row: string, col: number): string {
  return `${row}${col}`
}

export function getCategoryForRow(
  row: string,
  config: ShowConfig,
): SeatCategory {
  const category = config.seatCategories.find((c) => c.rows.includes(row))
  if (!category) {
    throw new Error(`No category found for row ${row}`)
  }
  return category
}

export function buildSeatGrid(
  config: ShowConfig,
  selectedIds: ReadonlySet<string>,
  bookedSeats: ReadonlySet<string> = new Set(config.bookedSeats),
): Seat[] {
  const bookedSet = bookedSeats
  const rowLabels = getRowLabels(config.rows)
  const seats: Seat[] = []

  for (const row of rowLabels) {
    const category = getCategoryForRow(row, config)
    for (let col = 1; col <= config.cols; col++) {
      const id = formatSeatId(row, col)
      let status: Seat['status'] = 'available'
      if (bookedSet.has(id)) {
        status = 'booked'
      } else if (selectedIds.has(id)) {
        status = 'selected'
      }

      seats.push({
        id,
        row,
        col,
        status,
        category,
        price: category.price,
      })
    }
  }

  return seats
}
