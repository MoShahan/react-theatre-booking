import type { ShowLookups } from '../lib/lookups'
import type { OrderSummary, ShowConfig } from '../types/booking'
import { BillBreakdown } from './BillBreakdown'
import { PromoCodeInput } from './PromoCodeInput'

interface OrderSummaryPanelProps {
  config: ShowConfig
  lookups: ShowLookups
  summary: OrderSummary
  activePromoCode: string | null
  promoError: string | null
  onConfirm: () => void
  onApplyPromo: (code: string) => void
  onRemovePromo: () => void
}

export function OrderSummaryPanel({
  config,
  lookups,
  summary,
  activePromoCode,
  promoError,
  onConfirm,
  onApplyPromo,
  onRemovePromo,
}: OrderSummaryPanelProps) {
  const hasSelection = summary.selectedSeats.length > 0

  return (
    <aside className="order-summary" aria-label="Order summary">
      <h2>Order Summary</h2>

      <PromoCodeInput
        promoCodes={config.promoCodes}
        activePromoCode={activePromoCode}
        promoError={promoError}
        onApply={onApplyPromo}
        onRemove={onRemovePromo}
      />

      {!hasSelection ? (
        <p className="order-summary__empty">Select seats to see pricing</p>
      ) : null}

      <BillBreakdown config={config} lookups={lookups} summary={summary} />

      <button
        type="button"
        className="order-summary__cta"
        disabled={!hasSelection}
        onClick={onConfirm}
      >
        Confirm Booking
      </button>
    </aside>
  )
}
