import { parseSeatId } from './seats'

export function areSeatsInSameRow(seatIds: readonly string[]): boolean {
  if (seatIds.length <= 1) {
    return true
  }

  const rows = seatIds.map((seatId) => parseSeatId(seatId).row)
  return rows.every((row) => row === rows[0])
}
