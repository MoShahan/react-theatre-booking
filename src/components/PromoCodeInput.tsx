import type { PromoCode } from '../types/booking'

interface PromoCodeInputProps {
  promoCodes: PromoCode[]
  activePromoCode: string | null
  promoError: string | null
  onApply: (code: string) => void
  onRemove: () => void
}

export function PromoCodeInput({
  promoCodes,
  activePromoCode,
  promoError,
  onApply,
  onRemove,
}: PromoCodeInputProps) {
  return (
    <div className="promo-code" aria-label="Promo code">
      <div className="promo-code__header">
        <h3 className="promo-code__label">Available promos</h3>
        {activePromoCode ? (
          <button
            type="button"
            className="promo-code__remove"
            onClick={onRemove}
          >
            Remove
          </button>
        ) : null}
      </div>

      <ul className="promo-code__list">
        {promoCodes.map((promo) => {
          const isApplied = activePromoCode === promo.code

          return (
            <li
              key={promo.code}
              className={`promo-code__item${isApplied ? ' promo-code__item--applied' : ''}`}
            >
              <div className="promo-code__item-content">
                <span className="promo-code__item-code">{promo.code}</span>
                <span className="promo-code__item-description">
                  {promo.description}
                </span>
              </div>
              <button
                type="button"
                className="promo-code__button"
                disabled={Boolean(activePromoCode)}
                onClick={() => onApply(promo.code)}
              >
                {isApplied ? 'Applied' : 'Apply'}
              </button>
            </li>
          )
        })}
      </ul>

      {promoError ? (
        <p className="promo-code__error" role="alert">
          {promoError}
        </p>
      ) : null}
    </div>
  )
}
