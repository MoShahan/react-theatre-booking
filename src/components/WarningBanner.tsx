type WarningVariant = 'warning' | 'info'

interface WarningBannerProps {
  message: string
  variant?: WarningVariant
}

export function WarningBanner({
  message,
  variant = 'warning',
}: WarningBannerProps) {
  return (
    <div className={`warning-banner warning-banner--${variant}`} role="alert">
      <span className="warning-banner__icon" aria-hidden="true">
        ⚠
      </span>
      <p>{message}</p>
    </div>
  )
}
