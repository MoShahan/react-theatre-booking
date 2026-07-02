import type { ShowConfig } from '../types/booking'
import { buildShowLookups } from '../lib/lookups'

/** Static show data: layout, pricing tiers, pre-booked seats, fees, and promo rules. */
export const SHOW_CONFIG: ShowConfig = {
  movie: 'Avengers: Endgame',
  show: 'Saturday, 7:00 PM',
  venue: 'PVR Cinemas, Bangalore',
  rows: 8,
  cols: 10,
  seatCategories: [
    {
      name: 'VIP',
      rows: ['A', 'B'],
      price: 500,
      colors: {
        border: '#c4b5fd',
        fill: '#7c3aed',
        label: '#7c3aed',
      },
    },
    {
      name: 'Premium',
      rows: ['C', 'D', 'E'],
      price: 300,
      colors: {
        border: '#86efac',
        fill: '#16a34a',
        label: '#16a34a',
      },
    },
    {
      name: 'General',
      rows: ['F', 'G', 'H'],
      price: 100,
      colors: {
        border: '#93c5fd',
        fill: '#2563eb',
        label: '#2563eb',
      },
    },
  ],
  bookedSeats: [
    'A1',
    'A2',
    'B5',
    'C3',
    'C4',
    'D7',
    'E1',
    'F2',
    'F3',
    'G8',
    'H1',
    'H10',
  ],
  maxSeats: 6,
  convenienceFee: 49,
  convenienceFeeWaiverThreshold: 1000,
  gstPercent: 18,
  promoCodes: [
    {
      code: 'SUPER10',
      type: 'percentage',
      value: 10,
      conditions: {
        minOrderValue: 500,
        requiredCategory: null,
        requireAllSeats: false,
      },
      description: '10% off on orders above ₹500',
    },
    {
      code: 'VIPFLAT100',
      type: 'flat',
      value: 100,
      conditions: {
        minOrderValue: 800,
        requiredCategory: 'VIP',
        requireAllSeats: true,
      },
      description: '₹100 off on orders above ₹800 – all seats must be VIP',
    },
    {
      code: 'FIRST5',
      type: 'percentage',
      value: 5,
      conditions: {
        minOrderValue: 0,
        requiredCategory: null,
        requireAllSeats: false,
        firstOrderOnly: true,
      },
      description: '5% off on your first order',
    },
    {
      code: 'PREMIUM20',
      type: 'percentage',
      value: 20,
      conditions: {
        minOrderValue: 0,
        requiredCategory: null,
        requireAllSeats: false,
        excludedCategory: 'General',
      },
      description: '20% off when no General seats are selected',
    },
  ],
}

export const SHOW_LOOKUPS = buildShowLookups(SHOW_CONFIG)
