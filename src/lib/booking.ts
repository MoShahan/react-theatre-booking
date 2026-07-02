import type {
  BookedSeatDetail,
  ConfirmedBooking,
  OrderSummary,
} from '../types/booking'
import type { ShowLookups } from './lookups'
import { getCategoryForRow, parseSeatId } from './seats'

const BOOKING_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function generateBookingId(): string {
  let suffix = ''

  for (let i = 0; i < 8; i++) {
    const index = Math.floor(Math.random() * BOOKING_ID_CHARS.length)
    suffix += BOOKING_ID_CHARS[index]
  }

  return `BMS-${suffix}`
}

export function createSeatDetails(
  selectedSeats: readonly string[],
  lookups: ShowLookups,
): BookedSeatDetail[] {
  return selectedSeats.map((seatId) => {
    const { row } = parseSeatId(seatId)
    const category = getCategoryForRow(row, lookups)
    return {
      seatId,
      categoryName: category.name,
      price: category.price,
    }
  })
}

/** Snapshots the order summary at confirmation time so later price changes don't affect it. */
export function createConfirmedBooking(
  summary: OrderSummary,
  lookups: ShowLookups,
): ConfirmedBooking {
  return {
    bookingId: generateBookingId(),
    seats: createSeatDetails(summary.selectedSeats, lookups),
    summary: { ...summary },
  }
}
