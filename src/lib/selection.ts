import type { ShowConfig } from '../types/booking'

export function toggleSeat(
  seatId: string,
  selected: ReadonlySet<string>,
  config: ShowConfig,
  bookedSeats: ReadonlySet<string> = new Set(config.bookedSeats),
): Set<string> {
  if (bookedSeats.has(seatId)) {
    return new Set(selected)
  }

  const next = new Set(selected)

  if (next.has(seatId)) {
    next.delete(seatId)
    return next
  }

  if (next.size >= config.maxSeats) {
    return next
  }

  next.add(seatId)
  return next
}

export function isSeatDisabled(
  status: 'available' | 'booked' | 'selected',
  selected: ReadonlySet<string>,
  config: ShowConfig,
): boolean {
  if (status === 'booked') {
    return true
  }

  if (status === 'selected') {
    return false
  }

  return selected.size >= config.maxSeats
}
