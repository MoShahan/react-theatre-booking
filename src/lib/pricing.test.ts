import { describe, expect, it } from 'vitest'
import { SHOW_CONFIG } from '../config/showConfig'
import { calculateOrderSummary, getCategoryCosts } from './pricing'

describe('pricing', () => {
  it('returns zero totals when no seats are selected', () => {
    const summary = calculateOrderSummary(new Set(), SHOW_CONFIG)
    expect(summary).toEqual({
      selectedSeats: [],
      categoryCosts: [],
      seatCost: 0,
      promoDiscount: 0,
      promoApplied: false,
      appliedPromoCode: null,
      discountedSeatCost: 0,
      gst: 0,
      convenienceFee: 0,
      grandTotal: 0,
      feeWaived: false,
    })
  })

  it('groups seat cost by category', () => {
    const summary = calculateOrderSummary(new Set(['A5', 'A6', 'C2']), SHOW_CONFIG)

    expect(getCategoryCosts(['A5', 'A6', 'C2'], SHOW_CONFIG)).toEqual([
      { categoryName: 'VIP', count: 2, unitPrice: 500, total: 1000 },
      { categoryName: 'Premium', count: 1, unitPrice: 300, total: 300 },
    ])
    expect(summary.seatCost).toBe(1300)
  })

  it('applies active promo code to the bill', () => {
    const summary = calculateOrderSummary(
      new Set(['A5', 'A6']),
      SHOW_CONFIG,
      'SUPER10',
    )

    expect(summary.promoApplied).toBe(true)
    expect(summary.appliedPromoCode).toBe('SUPER10')
    expect(summary.promoDiscount).toBe(100)
    expect(summary.discountedSeatCost).toBe(900)
  })

  it('calculates GST on discounted seat cost only', () => {
    const summary = calculateOrderSummary(new Set(['F4', 'F5']), SHOW_CONFIG)

    expect(summary.gst).toBe(Math.round((200 * 18) / 100))
    expect(summary.grandTotal).toBe(200 + summary.gst + summary.convenienceFee)
  })

  it('adds convenience fee after GST', () => {
    const summary = calculateOrderSummary(new Set(['F4', 'F5']), SHOW_CONFIG)

    expect(summary.convenienceFee).toBe(49)
    expect(summary.feeWaived).toBe(false)
    expect(summary.grandTotal).toBe(200 + summary.gst + 49)
  })

  it('waives convenience fee when discounted seat cost exceeds threshold', () => {
    const summary = calculateOrderSummary(
      new Set(['A5', 'A6', 'B6']),
      SHOW_CONFIG,
      'SUPER10',
    )

    expect(summary.discountedSeatCost).toBe(1350)
    expect(summary.feeWaived).toBe(true)
    expect(summary.convenienceFee).toBe(0)
    expect(summary.grandTotal).toBe(1350 + summary.gst)
  })

  it('does not waive convenience fee at exactly the threshold', () => {
    const config = {
      ...SHOW_CONFIG,
      convenienceFeeWaiverThreshold: 1000,
    }
    const summary = calculateOrderSummary(new Set(['A5', 'A6']), config)

    expect(summary.discountedSeatCost).toBe(1000)
    expect(summary.feeWaived).toBe(false)
    expect(summary.convenienceFee).toBe(49)
  })

  it('calculates the Part 5 example bill', () => {
    const summary = calculateOrderSummary(
      new Set(['A5', 'A6', 'C2']),
      SHOW_CONFIG,
      'SUPER10',
    )

    expect(summary.seatCost).toBe(1300)
    expect(summary.promoDiscount).toBe(130)
    expect(summary.discountedSeatCost).toBe(1170)
    expect(summary.gst).toBe(211)
    expect(summary.feeWaived).toBe(true)
    expect(summary.grandTotal).toBe(1381)
  })
})
