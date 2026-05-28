import { useApp } from '../context/AppContext'
import { fmt } from '../utils/api'
import clsx from 'clsx'

export default function TrendingBar({ items = [] }) {
  const { trending } = useApp()
  const data = items.length ? items : trending

  if (!data.length) return (
    <div className="h-8 border-b border-border/60 flex items-center px-4 gap-4" style={{ background: 'rgba(14,12,26,0.8)' }}>
      {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-3 w-20 rounded" />)}
    </div>
  )

  const doubled = [...data, ...data]

  return (
    <div className="h-8 border-b border-border/60 overflow-hidden flex items-center" style={{ background: 'rgba(14,12,26,0.9)' }}>
      <div className="shrink-0 px-3 h-full flex items-center gap-1.5 border-r border-border/60">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-glow-pulse" style={{ boxShadow: '0 0 6px #a855f7' }} />
        <span className="text-xs font-bold text-gradient">LIVE</span>
      </div>
      <div className="ticker-wrap flex-1">
        <div className="ticker-content">
          {doubled.map((item, i) => {
            const coin = item.item || item
            const change = coin.data?.price_change_percentage_24h?.usd ?? coin.price_change_percentage_24h ?? 0
            const isPos = change >= 0
            return (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 text-xs whitespace-nowrap cursor-pointer hover:text-text-primary transition-colors group">
                <span className="text-text-muted">#{coin.market_cap_rank || i + 1}</span>
                <span className="font-semibold text-text-secondary group-hover:text-accent-purple transition-colors">{coin.symbol?.toUpperCase()}</span>
                <span className={clsx('font-mono font-medium', isPos ? 'text-accent-green' : 'text-accent-red')}>
                  {fmt.pct(change)}
                </span>
                <span className="text-border/60">·</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
