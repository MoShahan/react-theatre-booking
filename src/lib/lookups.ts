import type { PromoCode, SeatCategory, ShowConfig } from '../types/booking'

/** Precomputed indexes for O(1) reads on static show config data. */
export interface ShowLookups {
  readonly rowToCategory: ReadonlyMap<string, SeatCategory>
  readonly promoByCode: ReadonlyMap<string, PromoCode>
}

/** Build once per config; reuse across grid, pricing, and promo validation. */
export function buildShowLookups(config: ShowConfig): ShowLookups {
  const rowToCategory = new Map<string, SeatCategory>()
  for (const category of config.seatCategories) {
    for (const row of category.rows) {
      rowToCategory.set(row, category)
    }
  }

  const promoByCode = new Map<string, PromoCode>()
  for (const promo of config.promoCodes) {
    promoByCode.set(promo.code.toUpperCase(), promo)
  }

  return { rowToCategory, promoByCode }
}
