import { describe, expect, it } from 'vitest'
import { areSeatsInSameRow } from './adjacency'

describe('adjacency', () => {
  it('treats empty and single selections as same row', () => {
    expect(areSeatsInSameRow([])).toBe(true)
    expect(areSeatsInSameRow(['A1'])).toBe(true)
  })

  it('allows any seats within the same row', () => {
    expect(areSeatsInSameRow(['A5', 'A6'])).toBe(true)
    expect(areSeatsInSameRow(['A5', 'A7'])).toBe(true)
  })

  it('detects selections across different rows', () => {
    expect(areSeatsInSameRow(['A5', 'A6', 'C2'])).toBe(false)
    expect(areSeatsInSameRow(['A5', 'C2'])).toBe(false)
  })
})
