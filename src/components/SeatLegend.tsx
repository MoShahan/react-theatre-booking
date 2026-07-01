import type { ShowConfig } from '../types/booking'

interface SeatLegendProps {
  config: ShowConfig
}

export function SeatLegend({ config }: SeatLegendProps) {
  return (
    <div className="seat-legend" aria-label="Seat legend">
      <div className="seat-legend__item">
        <span
          className="seat-legend__swatch seat-legend__swatch--selected"
          style={{ backgroundColor: config.seatCategories[0].colors.fill }}
          aria-hidden="true"
        />
        <span>Selected</span>
      </div>
      <div className="seat-legend__item">
        <span
          className="seat-legend__swatch seat-legend__swatch--booked"
          aria-hidden="true"
        />
        <span>Booked</span>
      </div>
      {config.seatCategories.map((category) => (
        <div key={category.name} className="seat-legend__item">
          <span
            className="seat-legend__swatch seat-legend__swatch--tier"
            style={{ borderColor: category.colors.border }}
            aria-hidden="true"
          />
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  )
}
