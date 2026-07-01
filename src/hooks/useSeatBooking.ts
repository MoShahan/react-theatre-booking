import { useCallback, useMemo, useState } from 'react'
import { areSeatsInSameRow } from '../lib/adjacency'
import { createConfirmedBooking } from '../lib/booking'
import { calculateOrderSummary } from '../lib/pricing'
import { validatePromoCode } from '../lib/promo'
import { buildSeatGrid } from '../lib/seats'
import { toggleSeat } from '../lib/selection'
import type { ConfirmedBooking, Seat, ShowConfig } from '../types/booking'

export function useSeatBooking(config: ShowConfig) {
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

  const seats = useMemo(
    () => buildSeatGrid(config, selectedSeatIds, bookedSeatIds),
    [config, selectedSeatIds, bookedSeatIds],
  )

  const orderSummary = useMemo(
    () => calculateOrderSummary(selectedSeatIds, config, activePromoCode),
    [config, selectedSeatIds, activePromoCode],
  )

  const isAtMaxSeats = selectedSeatIds.size >= config.maxSeats
  const showMaxSeatsWarning = isAtMaxSeats
  const showAdjacencyWarning =
    selectedSeatIds.size >= 2 &&
    !areSeatsInSameRow([...selectedSeatIds])

  const promoContext = useMemo(
    () => ({ confirmedBookingCount: confirmedBookings.length }),
    [confirmedBookings.length],
  )

  const revalidateActivePromo = useCallback(
    (selectedSeats: ReadonlySet<string>) => {
      if (!activePromoCode) {
        return
      }

      const result = validatePromoCode(
        activePromoCode,
        [...selectedSeats],
        config,
        promoContext,
      )

      if ('error' in result) {
        setActivePromoCode(null)
        setPromoError(result.error)
      }
    },
    [activePromoCode, config, promoContext],
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
        config,
        promoContext,
      )

      if ('error' in result) {
        setPromoError(result.error)
      } else {
        setActivePromoCode(result.promo.code)
        setPromoError(null)
      }
    },
    [config, selectedSeatIds, promoContext],
  )

  const removePromoCode = useCallback(() => {
    setActivePromoCode(null)
    setPromoError(null)
  }, [])

  const confirmBooking = useCallback(() => {
    if (selectedSeatIds.size === 0) {
      return null
    }

    const booking = createConfirmedBooking(orderSummary, config)

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
  }, [config, orderSummary, selectedSeatIds])

  return {
    seats,
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
  seats: Seat[]
}
