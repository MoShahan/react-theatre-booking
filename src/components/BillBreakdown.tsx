import { formatINR } from '../lib/format'
import type { OrderSummary, ShowConfig } from '../types/booking'

interface BillBreakdownProps {
  config: ShowConfig
  summary: OrderSummary
}

export function BillBreakdown({ config, summary }: BillBreakdownProps) {
  const hasSelection = summary.selectedSeats.length > 0
  const appliedPromo = config.promoCodes.find(
    (promo) => promo.code === summary.appliedPromoCode,
  )

  return (
    <dl className="order-summary__breakdown">
      <div className="order-summary__section">
        <dt>Seat cost</dt>
        <dd>
          {hasSelection ? (
            <ul className="order-summary__category-lines">
              {summary.categoryCosts.map((line) => (
                <li key={line.categoryName}>
                  <span>
                    {line.categoryName} × {line.count}
                  </span>
                  <span>{formatINR(line.total)}</span>
                </li>
              ))}
            </ul>
          ) : (
            formatINR(0)
          )}
        </dd>
      </div>

      {summary.promoApplied && appliedPromo ? (
        <div>
          <dt>Promo discount ({appliedPromo.code})</dt>
          <dd className="order-summary__discount">
            −{formatINR(summary.promoDiscount)}
          </dd>
        </div>
      ) : null}

      <div>
        <dt>Discounted seat cost</dt>
        <dd>{formatINR(summary.discountedSeatCost)}</dd>
      </div>

      <div>
        <dt>GST ({config.gstPercent}%)</dt>
        <dd>{formatINR(summary.gst)}</dd>
      </div>

      <div>
        <dt>Convenience fee</dt>
        <dd className={summary.feeWaived ? 'order-summary__waived' : undefined}>
          {summary.feeWaived ? 'Waived' : formatINR(summary.convenienceFee)}
        </dd>
      </div>

      <div className="order-summary__total">
        <dt>Grand total</dt>
        <dd>{formatINR(summary.grandTotal)}</dd>
      </div>
    </dl>
  )
}
