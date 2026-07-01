import { describe, expect, it } from 'vitest'
import { generateBookingId } from './booking'

describe('generateBookingId', () => {
  it('generates ids in BMS-XXXXXXXX format', () => {
    const id = generateBookingId()
    expect(id).toMatch(/^BMS-[A-Z0-9]{8}$/)
  })
})
