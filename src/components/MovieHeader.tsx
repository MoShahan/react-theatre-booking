import type { ShowConfig } from '../types/booking'

interface MovieHeaderProps {
  config: ShowConfig
}

export function MovieHeader({ config }: MovieHeaderProps) {
  return (
    <header className="movie-header">
      <h1>{config.movie}</h1>
      <p className="movie-meta">
        {config.show} · {config.venue}
      </p>
    </header>
  )
}
