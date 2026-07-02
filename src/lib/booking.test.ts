import { describe, expect, it } from 'vitest'
import { SHOW_CONFIG, SHOW_LOOKUPS } from '../config/showConfig'
import { createConfirmedBooking } from './booking'
import { calculateOrderSummary } from './pricing'

describe('booking', () => {
  it('creates a confirmed booking with seat details and summary snapshot', () => {
    const summary = calculateOrderSummary(
      new Set(['A5', 'A6', 'C2']),
      SHOW_CONFIG,
      SHOW_LOOKUPS,
      'SUPER10',
    )
    const booking = createConfirmedBooking(summary, SHOW_LOOKUPS)

    expect(booking.bookingId).toMatch(/^BMS-[A-Z0-9]{8}$/)
    expect(booking.seats).toEqual([
      { seatId: 'A5', categoryName: 'VIP', price: 500 },
      { seatId: 'A6', categoryName: 'VIP', price: 500 },
      { seatId: 'C2', categoryName: 'Premium', price: 300 },
    ])
    expect(booking.summary.grandTotal).toBe(1381)
  })
})
