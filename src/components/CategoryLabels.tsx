import type { ShowConfig } from '../types/booking'

interface CategoryLabelsProps {
  config: ShowConfig
}

export function CategoryLabels({ config }: CategoryLabelsProps) {
  return (
    <aside className="category-labels" aria-label="Seat categories">
      {config.seatCategories.map((category) => (
        <div key={category.name} className="category-labels__item">
          <span
            className="category-labels__swatch"
            style={{ borderColor: category.colors.border }}
            aria-hidden="true"
          />
          <span style={{ color: category.colors.label }}>
            {category.name} · ₹{category.price}
          </span>
        </div>
      ))}
    </aside>
  )
}
