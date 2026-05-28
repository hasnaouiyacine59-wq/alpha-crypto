import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/api'
import clsx from 'clsx'

// Trending ticker bar below navbar
export default function TrendingBar({ items = [] }) {
  const { trending } = useApp()
  const data = items.length ? items : trending

  if (!data.length) return (
    <div className="h-8 bg-bg-secondary border-b border-border flex items-center px-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton h-3 w-20 rounded" />
      ))}
    </div>
  )

  const doubled = [...data, ...data]

  return (
    <div className="h-8 bg-bg-secondary border-b border-border overflow-hidden flex items-center">
      <div className="shrink-0 px-3 text-xs font-semibold text-accent-blue border-r border-border h-full flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse-slow" />
        TRENDING
      </div>
      <div className="ticker-wrap flex-1">
        <div className="ticker-content">
          {doubled.map((item, i) => {
            const coin = item.item || item
            const change = coin.data?.price_change_percentage_24h?.usd ?? coin.price_change_percentage_24h ?? 0
            const isPos = change >= 0
            return (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 text-xs whitespace-nowrap cursor-pointer hover:text-text-primary transition-colors">
                <span className="text-text-muted">#{coin.market_cap_rank || i + 1}</span>
                <span className="font-medium text-text-primary">{coin.symbol?.toUpperCase()}</span>
                <span className={clsx('font-mono', isPos ? 'text-accent-green' : 'text-accent-red')}>
                  {fmt.pct(change)}
                </span>
                <span className="text-border">|</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
