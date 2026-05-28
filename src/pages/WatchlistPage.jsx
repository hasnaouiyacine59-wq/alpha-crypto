import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { fmt } from '../utils/api'
import clsx from 'clsx'

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist } = useApp()

  if (!watchlist.length) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-5xl">⭐</div>
      <div className="text-lg font-semibold text-text-primary">Your watchlist is empty</div>
      <div className="text-sm text-text-muted">Star any pair from the chart page to add it here.</div>
      <Link to="/" className="btn-primary">Explore Pairs</Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">⭐</span>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Watchlist</h1>
          <p className="text-sm text-text-muted">{watchlist.length} saved pair{watchlist.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Token / Pair</th>
              <th>Chain</th>
              <th className="text-right">Price</th>
              <th className="text-right">24h Change</th>
              <th className="text-right">Volume 24h</th>
              <th className="text-right">Liquidity</th>
              <th>DEX</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(pair => {
              const change = parseFloat(pair.priceChange?.h24 || 0)
              return (
                <tr key={pair.pairAddress}>
                  <td>
                    <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`} className="flex items-center gap-2 hover:text-accent-blue transition-colors">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-yellow/20 to-accent-orange/20 flex items-center justify-center text-xs font-bold text-accent-yellow">
                        {pair.baseToken?.symbol?.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-text-primary">{pair.baseToken?.symbol}/{pair.quoteToken?.symbol}</div>
                        <div className="text-xs text-text-muted">{pair.baseToken?.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td><span className="text-xs bg-bg-tertiary text-text-secondary px-2 py-0.5 rounded border border-border">{pair.chainId}</span></td>
                  <td className="text-right font-mono text-sm text-text-primary">{fmt.price(parseFloat(pair.priceUsd || 0))}</td>
                  <td className={clsx('text-right font-mono text-xs', change >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(change)}</td>
                  <td className="text-right text-sm text-text-secondary">{fmt.usd(parseFloat(pair.volume?.h24 || 0))}</td>
                  <td className="text-right text-sm text-text-secondary">{fmt.usd(parseFloat(pair.liquidity?.usd || 0))}</td>
                  <td><span className="tag-blue">{pair.dexId}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`} className="btn-secondary py-1 px-2 text-xs">Chart</Link>
                      <button onClick={() => toggleWatchlist(pair)} className="p-1.5 rounded hover:bg-red-500/10 text-text-muted hover:text-accent-red transition-colors" title="Remove">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
