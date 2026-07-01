import type { CSSProperties } from 'react'
import { getRowLabels } from '../lib/seats'
import type { Seat } from '../types/booking'
import type { ShowConfig } from '../types/booking'
import { SeatButton } from './Seat'

interface SeatGridProps {
  seats: Seat[]
  config: ShowConfig
  selected: ReadonlySet<string>
  onToggleSeat: (seatId: string) => void
}

export function SeatGrid({
  seats,
  config,
  selected,
  onToggleSeat,
}: SeatGridProps) {
  const rowLabels = getRowLabels(config.rows)
  const seatsByRow = new Map<string, Seat[]>()

  for (const seat of seats) {
    const rowSeats = seatsByRow.get(seat.row) ?? []
    rowSeats.push(seat)
    seatsByRow.set(seat.row, rowSeats)
  }

  return (
    <div
      className="seat-grid"
      role="grid"
      aria-label="Seat map"
      style={{ '--seat-cols': config.cols } as CSSProperties}
    >
      <div className="seat-grid__header" role="row">
        <span className="seat-grid__corner" aria-hidden="true" />
        {Array.from({ length: config.cols }, (_, i) => (
          <span key={i + 1} className="seat-grid__col-label" role="columnheader">
            {i + 1}
          </span>
        ))}
      </div>

      {rowLabels.map((row) => (
        <div key={row} className="seat-grid__row" role="row">
          <span className="seat-grid__row-label" role="rowheader">
            {row}
          </span>
          {(seatsByRow.get(row) ?? []).map((seat) => (
            <SeatButton
              key={seat.id}
              seat={seat}
              selected={selected}
              config={config}
              onToggle={onToggleSeat}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
