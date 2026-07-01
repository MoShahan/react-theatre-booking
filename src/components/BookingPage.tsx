import { useRef } from 'react'
import { SHOW_CONFIG } from '../config/showConfig'
import { useSeatBooking } from '../hooks/useSeatBooking'
import { CategoryLabels } from './CategoryLabels'
import { ConfirmedBookingSummary } from './ConfirmedBookingSummary'
import { MovieHeader } from './MovieHeader'
import { OrderSummaryPanel } from './OrderSummary'
import { ScreenIndicator } from './ScreenIndicator'
import { SeatGrid } from './SeatGrid'
import { SeatLegend } from './SeatLegend'
import { WarningBanner } from './WarningBanner'

export function BookingPage() {
  const seatMapRef = useRef<HTMLElement>(null)
  const {
    seats,
    selectedSeatIds,
    orderSummary,
    activePromoCode,
    promoError,
    confirmedBookings,
    showMaxSeatsWarning,
    showAdjacencyWarning,
    toggleSeat,
    clearSelection,
    applyPromoCode,
    removePromoCode,
    confirmBooking,
  } = useSeatBooking(SHOW_CONFIG)

  const handleConfirm = () => {
    confirmBooking()
  }

  const handleBookMore = () => {
    seatMapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="booking-page">
      <MovieHeader config={SHOW_CONFIG} />

      <main className="booking-layout">
        <section
          ref={seatMapRef}
          id="seat-selection"
          className="seat-map-section"
          aria-label="Seat selection"
        >
          <ScreenIndicator />

          <div className="seat-map-section__grid-wrap">
            <SeatGrid
              seats={seats}
              config={SHOW_CONFIG}
              selected={selectedSeatIds}
              onToggleSeat={toggleSeat}
            />
            <CategoryLabels config={SHOW_CONFIG} />
          </div>

          <div className="seat-map-section__footer">
            <SeatLegend config={SHOW_CONFIG} />
            {selectedSeatIds.size > 0 ? (
              <button
                type="button"
                className="seat-map-section__clear"
                onClick={clearSelection}
              >
                Deselect all
              </button>
            ) : null}
          </div>
        </section>

        <OrderSummaryPanel
          config={SHOW_CONFIG}
          summary={orderSummary}
          activePromoCode={activePromoCode}
          promoError={promoError}
          onConfirm={handleConfirm}
          onApplyPromo={applyPromoCode}
          onRemovePromo={removePromoCode}
        />
      </main>

      <div className="booking-banners">
        {showMaxSeatsWarning ? (
          <WarningBanner
            variant="info"
            message={`You can select up to ${SHOW_CONFIG.maxSeats} seats per booking. Deselect a seat to choose a different one.`}
          />
        ) : null}
        {showAdjacencyWarning ? (
          <WarningBanner message="Your selected seats are not together. Other viewers may sit between your group." />
        ) : null}
      </div>

      {confirmedBookings.length > 0 ? (
        <section className="confirmed-bookings" aria-label="Confirmed bookings">
          <h2 className="confirmed-bookings__title">Your bookings</h2>
          <div className="confirmed-bookings__list">
            {confirmedBookings.map((booking) => (
              <ConfirmedBookingSummary
                key={booking.bookingId}
                booking={booking}
                config={SHOW_CONFIG}
                onBookMore={handleBookMore}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
