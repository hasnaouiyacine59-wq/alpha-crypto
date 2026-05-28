import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getNewPairs, searchPairs, fmt } from '../utils/api'
import { CHAIN_LIST } from '../utils/chains'
import AdBanner from '../components/AdBanner'
import clsx from 'clsx'

export default function NewPairsPage() {
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [chainFilter, setChainFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    // Fetch new pairs via multiple queries
    const queries = ['new', 'token', 'launch', 'inu', 'ai', 'pepe']
    Promise.all(queries.map(q => searchPairs(q).then(r => r.slice(0, 5)).catch(() => [])))
      .then(results => {
        const flat = results.flat().filter(Boolean)
        // Sort by newest (lowest liquidity = newer)
        const sorted = flat.sort((a, b) => parseFloat(a.liquidity?.usd || 0) - parseFloat(b.liquidity?.usd || 0))
        setPairs(sorted.slice(0, 40))
        setLoading(false)
      })
  }, [])

  const filtered = chainFilter === 'all' ? pairs : pairs.filter(p => p.chainId === chainFilter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <AdBanner slot="leaderboard" className="mb-6" />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🆕</span>
          <div>
            <h1 className="text-xl font-bold text-text-primary">New Pairs</h1>
            <p className="text-sm text-text-muted">Recently listed token pairs across all DEXs</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setChainFilter('all')}
            className={clsx('px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              chainFilter === 'all' ? 'bg-accent-blue text-white border-accent-blue' : 'border-border text-text-muted hover:text-text-primary'
            )}
          >All</button>
          {CHAIN_LIST.slice(0, 5).map(c => (
            <button
              key={c.key}
              onClick={() => setChainFilter(c.key)}
              className={clsx('px-3 py-1 rounded-full text-xs font-medium transition-colors border',
                chainFilter === c.key ? 'bg-accent-blue text-white border-accent-blue' : 'border-border text-text-muted hover:text-text-primary'
              )}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : (
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
                <th className="text-right">Txns 24h</th>
                <th>DEX</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pair) => {
                const change = parseFloat(pair.priceChange?.h24 || 0)
                const txns = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0)
                return (
                  <tr key={pair.pairAddress}>
                    <td>
                      <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`} className="flex items-center gap-2 hover:text-accent-blue transition-colors">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-green">
                          {pair.baseToken?.symbol?.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-text-primary">{pair.baseToken?.symbol}/{pair.quoteToken?.symbol}</div>
                          <div className="text-xs text-text-muted truncate max-w-[120px]">{pair.baseToken?.name}</div>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span className="text-xs bg-bg-tertiary text-text-secondary px-2 py-0.5 rounded border border-border">{pair.chainId}</span>
                    </td>
                    <td className="text-right font-mono text-sm text-text-primary">{fmt.price(parseFloat(pair.priceUsd || 0))}</td>
                    <td className={clsx('text-right font-mono text-xs', change >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(change)}</td>
                    <td className="text-right text-sm text-text-secondary">{fmt.usd(parseFloat(pair.volume?.h24 || 0))}</td>
                    <td className="text-right text-sm text-text-secondary">{fmt.usd(parseFloat(pair.liquidity?.usd || 0))}</td>
                    <td className="text-right text-sm text-text-secondary">{txns.toLocaleString()}</td>
                    <td><span className="tag-blue">{pair.dexId}</span></td>
                    <td>
                      <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`} className="btn-secondary py-1 px-2 text-xs">
                        Chart →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <AdBanner slot="leaderboard" className="mt-6" />
    </div>
  )
}
