import { formatINR } from '../lib/format'
import type { ConfirmedBooking, ShowConfig } from '../types/booking'
import { BillBreakdown } from './BillBreakdown'

interface ConfirmedBookingSummaryProps {
  booking: ConfirmedBooking
  config: ShowConfig
  onBookMore: () => void
}

export function ConfirmedBookingSummary({
  booking,
  config,
  onBookMore,
}: ConfirmedBookingSummaryProps) {
  return (
    <article className="confirmed-booking" aria-label="Booking confirmation">
      <div className="confirmed-booking__header">
        <h2>Booking confirmed</h2>
        <p className="confirmed-booking__id">{booking.bookingId}</p>
      </div>

      <ul className="confirmed-booking__seats">
        {booking.seats.map((seat) => (
          <li key={seat.seatId}>
            <span>
              {seat.seatId} ({seat.categoryName})
            </span>
            <span>{formatINR(seat.price)}</span>
          </li>
        ))}
      </ul>

      <BillBreakdown config={config} summary={booking.summary} />

      <button
        type="button"
        className="confirmed-booking__book-more"
        onClick={onBookMore}
      >
        Book More Seats
      </button>
    </article>
  )
}
