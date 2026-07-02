import { describe, expect, it } from 'vitest'
import { SHOW_LOOKUPS } from '../config/showConfig'
import {
  calculatePromoDiscount,
  findPromoCode,
  validatePromoCode,
} from './promo'

describe('promo', () => {
  it('finds promo codes case-insensitively', () => {
    expect(findPromoCode('super10', SHOW_LOOKUPS)?.code).toBe('SUPER10')
  })

  it('rejects unknown promo codes', () => {
    const result = validatePromoCode('INVALID', ['A5'], SHOW_LOOKUPS)
    expect(result).toEqual({
      valid: false,
      error: 'Promo code not found.',
    })
  })

  it('rejects promo when minimum order value is not met', () => {
    const result = validatePromoCode('SUPER10', ['F4'], SHOW_LOOKUPS)
    expect(result).toEqual({
      valid: false,
      error: 'Minimum order value of ₹500 not met.',
    })
  })

  it('accepts percentage promo when minimum order value is met', () => {
    const result = validatePromoCode('SUPER10', ['A5'], SHOW_LOOKUPS)
    expect(result.valid).toBe(true)
    if ('promo' in result) {
      expect(result.promo.code).toBe('SUPER10')
      expect(calculatePromoDiscount(500, result.promo)).toBe(50)
    }
  })

  it('rejects VIP promo when not all seats are VIP', () => {
    const result = validatePromoCode('VIPFLAT100', ['A5', 'C2'], SHOW_LOOKUPS)
    expect(result).toEqual({
      valid: false,
      error: 'All selected seats must be VIP.',
    })
  })

  it('accepts flat VIP promo when all conditions are met', () => {
    const result = validatePromoCode('VIPFLAT100', ['A5', 'B6'], SHOW_LOOKUPS)
    expect(result.valid).toBe(true)
    if ('promo' in result) {
      expect(calculatePromoDiscount(1000, result.promo)).toBe(100)
    }
  })

  it('accepts FIRST5 on the first order', () => {
    const result = validatePromoCode('FIRST5', ['A5'], SHOW_LOOKUPS, {
      confirmedBookingCount: 0,
    })
    expect(result.valid).toBe(true)
    if ('promo' in result) {
      expect(calculatePromoDiscount(500, result.promo)).toBe(25)
    }
  })

  it('rejects FIRST5 after the first order', () => {
    const result = validatePromoCode('FIRST5', ['A5'], SHOW_LOOKUPS, {
      confirmedBookingCount: 1,
    })
    expect(result).toEqual({
      valid: false,
      error: 'This promo is valid on your first order only.',
    })
  })

  it('accepts PREMIUM20 when no General seats are selected', () => {
    const result = validatePromoCode('PREMIUM20', ['A5', 'C2'], SHOW_LOOKUPS)
    expect(result.valid).toBe(true)
    if ('promo' in result) {
      expect(calculatePromoDiscount(800, result.promo)).toBe(160)
    }
  })

  it('rejects PREMIUM20 when a General seat is selected', () => {
    const result = validatePromoCode('PREMIUM20', ['A5', 'F4'], SHOW_LOOKUPS)
    expect(result).toEqual({
      valid: false,
      error: 'None of the selected seats can be General.',
    })
  })
})
