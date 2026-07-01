import type {
  BookedSeatDetail,
  ConfirmedBooking,
  OrderSummary,
  ShowConfig,
} from '../types/booking'
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
  config: ShowConfig,
): BookedSeatDetail[] {
  return selectedSeats.map((seatId) => {
    const { row } = parseSeatId(seatId)
    const category = getCategoryForRow(row, config)
    return {
      seatId,
      categoryName: category.name,
      price: category.price,
    }
  })
}

export function createConfirmedBooking(
  summary: OrderSummary,
  config: ShowConfig,
): ConfirmedBooking {
  return {
    bookingId: generateBookingId(),
    seats: createSeatDetails(summary.selectedSeats, config),
    summary: { ...summary },
  }
}
