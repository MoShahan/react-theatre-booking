import type { CategoryCost, OrderSummary, ShowConfig } from '../types/booking'
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

export function getCategoryCosts(
  selectedSeats: readonly string[],
  config: ShowConfig,
): CategoryCost[] {
  const counts = new Map<string, number>()

  for (const seatId of selectedSeats) {
    const { row } = parseSeatId(seatId)
    const category = getCategoryForRow(row, config)
    counts.set(category.name, (counts.get(category.name) ?? 0) + 1)
  }

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

export function calculateOrderSummary(
  selectedIds: ReadonlySet<string>,
  config: ShowConfig,
  activePromoCode: string | null = null,
): OrderSummary {
  const selectedSeats = [...selectedIds].sort()

  if (selectedSeats.length === 0) {
    return { ...EMPTY_SUMMARY }
  }

  const categoryCosts = getCategoryCosts(selectedSeats, config)
  const seatCost = categoryCosts.reduce((sum, line) => sum + line.total, 0)
  const promo = activePromoCode ? findPromoCode(activePromoCode, config) : undefined
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
