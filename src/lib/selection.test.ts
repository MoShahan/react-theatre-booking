import { describe, expect, it } from 'vitest'
import { SHOW_CONFIG } from '../config/showConfig'
import { isSeatDisabled, toggleSeat } from './selection'

describe('selection', () => {
  it('adds an available seat to selection', () => {
    const next = toggleSeat('A5', new Set(), SHOW_CONFIG)
    expect(next.has('A5')).toBe(true)
  })

  it('removes a selected seat from selection', () => {
    const next = toggleSeat('A5', new Set(['A5']), SHOW_CONFIG)
    expect(next.has('A5')).toBe(false)
  })

  it('does not toggle booked seats', () => {
    const next = toggleSeat('A1', new Set(), SHOW_CONFIG)
    expect(next.size).toBe(0)
  })

  it('does not add more than maxSeats', () => {
    const selected = new Set(['A3', 'A4', 'A5', 'A6', 'A7', 'A8'])
    const next = toggleSeat('A9', selected, SHOW_CONFIG)
    expect(next.size).toBe(6)
    expect(next.has('A9')).toBe(false)
  })

  it('allows deselection when at max seats', () => {
    const selected = new Set(['A3', 'A4', 'A5', 'A6', 'A7', 'A8'])
    const next = toggleSeat('A8', selected, SHOW_CONFIG)
    expect(next.size).toBe(5)
    expect(next.has('A8')).toBe(false)
  })

  it('disables only unselected available seats at max limit', () => {
    const selected = new Set(['A5', 'A6', 'A7', 'A8', 'A9', 'A10'])

    expect(isSeatDisabled('selected', selected, SHOW_CONFIG)).toBe(false)
    expect(isSeatDisabled('available', selected, SHOW_CONFIG)).toBe(true)
    expect(isSeatDisabled('booked', selected, SHOW_CONFIG)).toBe(true)
  })
})
