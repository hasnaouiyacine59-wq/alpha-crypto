import { Link } from 'react-router-dom'
import { fmt } from '../utils/api'
import { useApp } from '../context/AppContext'
import clsx from 'clsx'

export default function PairCard({ pair }) {
  const { toggleWatchlist, isWatchlisted } = useApp()
  const change = parseFloat(pair.priceChange?.h24 || 0)
  const isPos = change >= 0
  const watchlisted = isWatchlisted(pair.pairAddress)

  return (
    <div className="card neon-hover transition-all duration-200 group relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-4">
          <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`} className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', boxShadow: '0 0 12px rgba(168,85,247,0.3)' }}>
              {pair.baseToken?.symbol?.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-text-primary text-sm group-hover:text-accent-purple transition-colors">
                {pair.baseToken?.symbol}
                <span className="text-text-muted font-normal text-xs ml-1">/{pair.quoteToken?.symbol}</span>
              </div>
              <div className="text-xs text-text-muted truncate">{pair.baseToken?.name}</div>
            </div>
          </Link>
          <button onClick={() => toggleWatchlist(pair)}
            className={clsx('p-1.5 rounded-lg transition-all shrink-0',
              watchlisted ? 'text-accent-yellow' : 'text-text-muted hover:text-accent-yellow'
            )}>
            <svg className="w-3.5 h-3.5" fill={watchlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-xl font-bold font-mono text-text-primary">{fmt.price(parseFloat(pair.priceUsd || 0))}</div>
            <div className={clsx('text-sm font-semibold mt-0.5 flex items-center gap-1',
              isPos ? 'text-accent-green' : 'text-accent-red')}>
              {isPos ? '▲' : '▼'} {fmt.pct(change)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted">Vol 24h</div>
            <div className="text-sm font-semibold text-text-secondary">{fmt.usd(parseFloat(pair.volume?.h24 || 0))}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
          <span className="tag-purple">{pair.dexId}</span>
          <span className="text-xs text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-lg border border-border/50">{pair.chainId}</span>
          <span className="ml-auto text-xs text-text-muted">{fmt.usd(parseFloat(pair.liquidity?.usd || 0))}</span>
        </div>
      </div>
    </div>
  )
}
