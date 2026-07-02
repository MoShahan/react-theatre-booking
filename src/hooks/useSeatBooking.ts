import { useCallback, useMemo, useState } from 'react'
import { areSeatsInSameRow } from '../lib/adjacency'
import { createConfirmedBooking } from '../lib/booking'
import { calculateOrderSummary } from '../lib/pricing'
import { validatePromoCode } from '../lib/promo'
import { buildShowLookups } from '../lib/lookups'
import { buildSeatGrid } from '../lib/seats'
import { toggleSeat } from '../lib/selection'
import type { ConfirmedBooking, Seat, ShowConfig } from '../types/booking'

/**
 * Central booking state: selection, promos, and confirmed bookings.
 * Derived values (grid, pricing, warnings) recompute when their inputs change.
 */
export function useSeatBooking(config: ShowConfig) {
  const lookups = useMemo(() => buildShowLookups(config), [config])

  // Starts with pre-booked seats from config; grows as the user confirms bookings.
  const [bookedSeatIds, setBookedSeatIds] = useState<Set<string>>(
    () => new Set(config.bookedSeats),
  )
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [activePromoCode, setActivePromoCode] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>(
    [],
  )

  const seatsByRow = useMemo(
    () => buildSeatGrid(config, selectedSeatIds, lookups, bookedSeatIds),
    [config, selectedSeatIds, bookedSeatIds, lookups],
  )

  const orderSummary = useMemo(
    () => calculateOrderSummary(selectedSeatIds, config, lookups, activePromoCode),
    [config, selectedSeatIds, activePromoCode, lookups],
  )

  const isAtMaxSeats = selectedSeatIds.size >= config.maxSeats
  const showMaxSeatsWarning = isAtMaxSeats
  // Advisory only — cross-row selection is allowed but may leave gaps in the group.
  const showAdjacencyWarning =
    selectedSeatIds.size >= 2 &&
    !areSeatsInSameRow([...selectedSeatIds])

  const promoContext = useMemo(
    () => ({ confirmedBookingCount: confirmedBookings.length }),
    [confirmedBookings.length],
  )

  // If the user changes seats after applying a promo, drop it when conditions no longer hold.
  const revalidateActivePromo = useCallback(
    (selectedSeats: ReadonlySet<string>) => {
      if (!activePromoCode) {
        return
      }

      const result = validatePromoCode(
        activePromoCode,
        [...selectedSeats],
        lookups,
        promoContext,
      )

      if ('error' in result) {
        setActivePromoCode(null)
        setPromoError(result.error)
      }
    },
    [activePromoCode, lookups, promoContext],
  )

  const toggleSeatSelection = useCallback(
    (seatId: string) => {
      const next = toggleSeat(seatId, selectedSeatIds, config, bookedSeatIds)
      setSelectedSeatIds(next)
      revalidateActivePromo(next)
    },
    [config, selectedSeatIds, bookedSeatIds, revalidateActivePromo],
  )

  const clearSelection = useCallback(() => {
    setSelectedSeatIds(new Set())
    setActivePromoCode(null)
    setPromoError(null)
  }, [])

  const applyPromoCode = useCallback(
    (code: string) => {
      const result = validatePromoCode(
        code,
        [...selectedSeatIds],
        lookups,
        promoContext,
      )

      if ('error' in result) {
        setPromoError(result.error)
      } else {
        setActivePromoCode(result.promo.code)
        setPromoError(null)
      }
    },
    [selectedSeatIds, lookups, promoContext],
  )

  const removePromoCode = useCallback(() => {
    setActivePromoCode(null)
    setPromoError(null)
  }, [])

  const confirmBooking = useCallback(() => {
    if (selectedSeatIds.size === 0) {
      return null
    }

    const booking = createConfirmedBooking(orderSummary, lookups)

    // Move selected seats into booked state and reset the checkout flow for another round.
    setBookedSeatIds((current) => {
      const next = new Set(current)
      for (const seatId of selectedSeatIds) {
        next.add(seatId)
      }
      return next
    })
    setConfirmedBookings((current) => [...current, booking])
    setSelectedSeatIds(new Set())
    setActivePromoCode(null)
    setPromoError(null)

    return booking
  }, [config, orderSummary, selectedSeatIds, lookups])

  return {
    seatsByRow,
    selectedSeatIds,
    orderSummary,
    activePromoCode,
    promoError,
    confirmedBookings,
    isAtMaxSeats,
    showMaxSeatsWarning,
    showAdjacencyWarning,
    toggleSeat: toggleSeatSelection,
    clearSelection,
    applyPromoCode,
    removePromoCode,
    confirmBooking,
  }
}

export type UseSeatBookingReturn = ReturnType<typeof useSeatBooking> & {
  seatsByRow: Map<string, Seat[]>
}
