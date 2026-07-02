import { describe, expect, it } from 'vitest'
import { SHOW_CONFIG, SHOW_LOOKUPS } from '../config/showConfig'
import {
  buildSeatGrid,
  getCategoryForRow,
  getRowLabels,
  parseSeatId,
} from './seats'

function getSeat(seatsByRow: Map<string, { id: string; status: string; price: number }[]>, seatId: string) {
  const { row } = parseSeatId(seatId)
  return seatsByRow.get(row)?.find((seat) => seat.id === seatId)
}

describe('seats', () => {
  it('generates row labels from row count', () => {
    expect(getRowLabels(8)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
  })

  it('resolves category for a row from config', () => {
    expect(getCategoryForRow('C', SHOW_LOOKUPS).name).toBe('Premium')
    expect(getCategoryForRow('A', SHOW_LOOKUPS).name).toBe('VIP')
    expect(getCategoryForRow('G', SHOW_LOOKUPS).name).toBe('General')
  })

  it('builds a grid with booked and selected states', () => {
    const selected = new Set(['A5', 'A6'])
    const seatsByRow = buildSeatGrid(SHOW_CONFIG, selected, SHOW_LOOKUPS)

    const totalSeats = [...seatsByRow.values()].reduce(
      (sum, row) => sum + row.length,
      0,
    )
    expect(totalSeats).toBe(SHOW_CONFIG.rows * SHOW_CONFIG.cols)

    const a1 = getSeat(seatsByRow, 'A1')
    const a5 = getSeat(seatsByRow, 'A5')
    const c2 = getSeat(seatsByRow, 'C2')

    expect(a1?.status).toBe('booked')
    expect(a5?.status).toBe('selected')
    expect(c2?.status).toBe('available')
    expect(a5?.price).toBe(500)
    expect(c2?.price).toBe(300)
  })
})
