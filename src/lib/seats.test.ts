import { describe, expect, it } from 'vitest'
import { SHOW_CONFIG } from '../config/showConfig'
import {
  buildSeatGrid,
  getCategoryForRow,
  getRowLabels,
} from './seats'

describe('seats', () => {
  it('generates row labels from row count', () => {
    expect(getRowLabels(8)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
  })

  it('resolves category for a row from config', () => {
    expect(getCategoryForRow('C', SHOW_CONFIG).name).toBe('Premium')
    expect(getCategoryForRow('A', SHOW_CONFIG).name).toBe('VIP')
    expect(getCategoryForRow('G', SHOW_CONFIG).name).toBe('General')
  })

  it('builds a grid with booked and selected states', () => {
    const selected = new Set(['A5', 'A6'])
    const seats = buildSeatGrid(SHOW_CONFIG, selected)

    expect(seats).toHaveLength(SHOW_CONFIG.rows * SHOW_CONFIG.cols)

    const a1 = seats.find((seat) => seat.id === 'A1')
    const a5 = seats.find((seat) => seat.id === 'A5')
    const c2 = seats.find((seat) => seat.id === 'C2')

    expect(a1?.status).toBe('booked')
    expect(a5?.status).toBe('selected')
    expect(c2?.status).toBe('available')
    expect(a5?.price).toBe(500)
    expect(c2?.price).toBe(300)
  })
})
