export type SeatStatus = 'available' | 'booked' | 'selected'

export interface SeatCategory {
  name: string
  rows: string[]
  price: number
  colors: { border: string; fill: string; label: string }
}

export type PromoCodeType = 'percentage' | 'flat'

export interface PromoCodeConditions {
  minOrderValue: number
  requiredCategory: string | null
  requireAllSeats: boolean
  firstOrderOnly?: boolean
  excludedCategory?: string | null
}

export interface PromoCode {
  code: string
  type: PromoCodeType
  value: number
  conditions: PromoCodeConditions
  description: string
}

export interface ShowConfig {
  movie: string
  show: string
  venue: string
  rows: number
  cols: number
  seatCategories: SeatCategory[]
  bookedSeats: string[]
  maxSeats: number
  convenienceFee: number
  convenienceFeeWaiverThreshold: number
  gstPercent: number
  promoCodes: PromoCode[]
}

export interface CategoryCost {
  categoryName: string
  count: number
  unitPrice: number
  total: number
}

export interface OrderSummary {
  selectedSeats: string[]
  categoryCosts: CategoryCost[]
  seatCost: number
  promoDiscount: number
  promoApplied: boolean
  appliedPromoCode: string | null
  discountedSeatCost: number
  gst: number
  convenienceFee: number
  grandTotal: number
  feeWaived: boolean
}

export interface BookedSeatDetail {
  seatId: string
  categoryName: string
  price: number
}

export interface ConfirmedBooking {
  bookingId: string
  seats: BookedSeatDetail[]
  summary: OrderSummary
}

export interface Seat {
  id: string
  row: string
  col: number
  status: SeatStatus
  category: SeatCategory
  price: number
}
