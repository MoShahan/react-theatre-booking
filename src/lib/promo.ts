import type { PromoCode } from '../types/booking'
import { formatINR } from './format'
import type { ShowLookups } from './lookups'
import { getCategoryForRow, parseSeatId } from './seats'

export interface PromoValidationContext {
  confirmedBookingCount: number
}

export type PromoValidationResult =
  | { valid: true; promo: PromoCode }
  | { valid: false; error: string }

function getSeatCost(
  selectedSeats: readonly string[],
  lookups: ShowLookups,
): number {
  return selectedSeats.reduce((sum, seatId) => {
    const { row } = parseSeatId(seatId)
    return sum + getCategoryForRow(row, lookups).price
  }, 0)
}

export function findPromoCode(
  code: string,
  lookups: ShowLookups,
): PromoCode | undefined {
  return lookups.promoByCode.get(code.trim().toUpperCase())
}

/**
 * Checks every condition on a promo before it can be applied. Category rules only
 * run when both requiredCategory and requireAllSeats are set; excludedCategory
 * blocks the promo if any selected seat is in that tier.
 */
export function validatePromoCode(
  code: string,
  selectedSeats: readonly string[],
  lookups: ShowLookups,
  context: PromoValidationContext = { confirmedBookingCount: 0 },
): PromoValidationResult {
  const promo = findPromoCode(code, lookups)

  if (!promo) {
    return { valid: false, error: 'Promo code not found.' }
  }

  if (selectedSeats.length === 0) {
    return { valid: false, error: 'Select at least one seat to apply a promo code.' }
  }

  const seatCost = getSeatCost(selectedSeats, lookups)

  if (seatCost < promo.conditions.minOrderValue) {
    return {
      valid: false,
      error: `Minimum order value of ${formatINR(promo.conditions.minOrderValue)} not met.`,
    }
  }

  const { requiredCategory, requireAllSeats, firstOrderOnly, excludedCategory } =
    promo.conditions

  if (firstOrderOnly && context.confirmedBookingCount > 0) {
    return {
      valid: false,
      error: 'This promo is valid on your first order only.',
    }
  }

  if (requiredCategory && requireAllSeats) {
    const allMatchCategory = selectedSeats.every((seatId) => {
      const { row } = parseSeatId(seatId)
      return getCategoryForRow(row, lookups).name === requiredCategory
    })

    if (!allMatchCategory) {
      return {
        valid: false,
        error: `All selected seats must be ${requiredCategory}.`,
      }
    }
  }

  if (excludedCategory) {
    const hasExcludedSeat = selectedSeats.some((seatId) => {
      const { row } = parseSeatId(seatId)
      return getCategoryForRow(row, lookups).name === excludedCategory
    })

    if (hasExcludedSeat) {
      return {
        valid: false,
        error: `None of the selected seats can be ${excludedCategory}.`,
      }
    }
  }

  return { valid: true, promo }
}

/** Percentage promos round to the nearest rupee; flat promos cannot exceed seat cost. */
export function calculatePromoDiscount(
  seatCost: number,
  promo: PromoCode,
): number {
  if (promo.type === 'percentage') {
    return Math.round((seatCost * promo.value) / 100)
  }

  return Math.min(promo.value, seatCost)
}
