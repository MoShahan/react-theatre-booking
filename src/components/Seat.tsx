import type { CSSProperties } from 'react'
import { isSeatDisabled } from '../lib/selection'
import type { Seat } from '../types/booking'
import type { ShowConfig } from '../types/booking'

interface SeatButtonProps {
  seat: Seat
  selected: ReadonlySet<string>
  config: ShowConfig
  onToggle: (seatId: string) => void
}

export function SeatButton({
  seat,
  selected,
  config,
  onToggle,
}: SeatButtonProps) {
  const disabled = isSeatDisabled(seat.status, selected, config)
  const isSelected = seat.status === 'selected'
  const isBooked = seat.status === 'booked'

  return (
    <button
      type="button"
      className={`seat seat--${seat.status}`}
      style={
        {
          '--seat-border': seat.category.colors.border,
          '--seat-fill': seat.category.colors.fill,
        } as CSSProperties
      }
      aria-label={`Seat ${seat.id}, ${seat.category.name}, ${seat.status}`}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => onToggle(seat.id)}
      title={seat.id}
    >
      {isBooked || isSelected ? (
        <span className="seat__label">{seat.id}</span>
      ) : null}
    </button>
  )
}
