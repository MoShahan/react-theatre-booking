import type { Seat, SeatCategory, ShowConfig } from '../types/booking'
import type { ShowLookups } from './lookups'

/** Maps row index to theatre labels: 0 → "A", 1 → "B", etc. */
export function getRowLabels(rows: number): string[] {
  return Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i),
  )
}

/** Splits a seat id like "C12" into its row letters and column number. */
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

/** O(1) row → category lookup via prebuilt index. */
export function getCategoryForRow(
  row: string,
  lookups: ShowLookups,
): SeatCategory {
  const category = lookups.rowToCategory.get(row)
  if (!category) {
    throw new Error(`No category found for row ${row}`)
  }
  return category
}

/**
 * Builds the full seat list from config. Status priority is booked > selected >
 * available so a seat cannot appear selected once it has been confirmed.
 */
export function buildSeatGrid(
  config: ShowConfig,
  selectedIds: ReadonlySet<string>,
  lookups: ShowLookups,
  bookedSeats: ReadonlySet<string> = new Set(config.bookedSeats),
): Map<string, Seat[]> {
  const bookedSet = bookedSeats
  const rowLabels = getRowLabels(config.rows)
  const seatsByRow = new Map<string, Seat[]>()

  for (const row of rowLabels) {
    const category = getCategoryForRow(row, lookups)
    const rowSeats: Seat[] = []

    for (let col = 1; col <= config.cols; col++) {
      const id = formatSeatId(row, col)
      let status: Seat['status'] = 'available'
      if (bookedSet.has(id)) {
        status = 'booked'
      } else if (selectedIds.has(id)) {
        status = 'selected'
      }

      rowSeats.push({
        id,
        row,
        col,
        status,
        category,
        price: category.price,
      })
    }

    seatsByRow.set(row, rowSeats)
  }

  return seatsByRow
}
