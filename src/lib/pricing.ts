import type { CategoryCost, OrderSummary, ShowConfig } from '../types/booking'
import type { ShowLookups } from './lookups'
import { calculatePromoDiscount, findPromoCode } from './promo'
import { getCategoryForRow, parseSeatId } from './seats'

const EMPTY_SUMMARY: OrderSummary = {
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
}

/** Groups selected seats by category and returns line items in config display order. */
export function getCategoryCosts(
  selectedSeats: readonly string[],
  config: ShowConfig,
  lookups: ShowLookups,
): CategoryCost[] {
  const counts = new Map<string, number>()

  for (const seatId of selectedSeats) {
    const { row } = parseSeatId(seatId)
    const category = getCategoryForRow(row, lookups)
    counts.set(category.name, (counts.get(category.name) ?? 0) + 1)
  }

  // Iterate seatCategories (not the map) so VIP → Premium → General order is stable.
  return config.seatCategories
    .filter((category) => counts.has(category.name))
    .map((category) => {
      const count = counts.get(category.name) ?? 0
      return {
        categoryName: category.name,
        count,
        unitPrice: category.price,
        total: count * category.price,
      }
    })
}

/**
 * Derives the full bill from the current selection. Pipeline:
 * seat cost → promo discount → GST on discounted amount → convenience fee (waived
 * when discounted total exceeds threshold) → grand total.
 */
export function calculateOrderSummary(
  selectedIds: ReadonlySet<string>,
  config: ShowConfig,
  lookups: ShowLookups,
  activePromoCode: string | null = null,
): OrderSummary {
  const selectedSeats = [...selectedIds].sort()

  if (selectedSeats.length === 0) {
    return { ...EMPTY_SUMMARY }
  }

  const categoryCosts = getCategoryCosts(selectedSeats, config, lookups)
  const seatCost = categoryCosts.reduce((sum, line) => sum + line.total, 0)
  const promo = activePromoCode ? findPromoCode(activePromoCode, lookups) : undefined
  const promoDiscount = promo ? calculatePromoDiscount(seatCost, promo) : 0
  const discountedSeatCost = seatCost - promoDiscount
  const gst = Math.round((discountedSeatCost * config.gstPercent) / 100)
  const feeWaived =
    discountedSeatCost > config.convenienceFeeWaiverThreshold
  const convenienceFee = feeWaived ? 0 : config.convenienceFee
  const grandTotal = discountedSeatCost + gst + convenienceFee

  return {
    selectedSeats,
    categoryCosts,
    seatCost,
    promoDiscount,
    promoApplied: promoDiscount > 0,
    appliedPromoCode: promo?.code ?? null,
    discountedSeatCost,
    gst,
    convenienceFee,
    grandTotal,
    feeWaived,
  }
}
