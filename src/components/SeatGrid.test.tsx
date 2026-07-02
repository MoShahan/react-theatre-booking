import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SHOW_CONFIG, SHOW_LOOKUPS } from '../config/showConfig'
import { buildSeatGrid } from '../lib/seats'
import { SeatGrid } from './SeatGrid'

describe('SeatGrid', () => {
  it('renders all seat buttons', () => {
    const seatsByRow = buildSeatGrid(SHOW_CONFIG, new Set(), SHOW_LOOKUPS)
    render(
      <SeatGrid
        seatsByRow={seatsByRow}
        config={SHOW_CONFIG}
        selected={new Set()}
        onToggleSeat={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('button')).toHaveLength(
      SHOW_CONFIG.rows * SHOW_CONFIG.cols,
    )
  })

  it('disables booked seats', () => {
    const seatsByRow = buildSeatGrid(SHOW_CONFIG, new Set(), SHOW_LOOKUPS)
    render(
      <SeatGrid
        seatsByRow={seatsByRow}
        config={SHOW_CONFIG}
        selected={new Set()}
        onToggleSeat={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Seat A1, VIP, booked' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Seat A5, VIP, available' })).toBeEnabled()
  })
})
