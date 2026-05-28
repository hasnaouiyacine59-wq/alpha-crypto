import { useState, useEffect } from 'react'
import { searchPairs, fmt } from '../utils/api'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const TRENDING_QUERIES = ['PEPE', 'SHIB', 'DOGE', 'FLOKI', 'BONK', 'WIF', 'BRETT', 'MEME', 'TURBO', 'WOJAK']

export default function TrendingPage() {
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all(TRENDING_QUERIES.map(q => searchPairs(q).then(r => r.slice(0, 2)).catch(() => [])))
      .then(results => {
        const flat = results.flat().filter(Boolean)
        setPairs(flat.slice(0, 30))
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔥</span>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Trending Tokens</h1>
          <p className="text-sm text-text-muted">Most popular tokens right now across all chains</p>
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
                <th>#</th>
                <th>Token</th>
                <th className="text-right">Price</th>
                <th className="text-right">1h</th>
                <th className="text-right">6h</th>
                <th className="text-right">24h</th>
                <th className="text-right">Volume 24h</th>
                <th className="text-right">Liquidity</th>
                <th className="text-right">FDV</th>
                <th>DEX</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, i) => {
                const c1h = parseFloat(pair.priceChange?.h1 || 0)
                const c6h = parseFloat(pair.priceChange?.h6 || 0)
                const c24h = parseFloat(pair.priceChange?.h24 || 0)
                return (
                  <tr key={pair.pairAddress} className="cursor-pointer">
                    <td className="text-text-muted">{i + 1}</td>
                    <td>
                      <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`} className="flex items-center gap-2 hover:text-accent-blue transition-colors">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 flex items-center justify-center text-xs font-bold text-accent-blue">
                          {pair.baseToken?.symbol?.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-text-primary text-sm">{pair.baseToken?.symbol}</div>
                          <div className="text-xs text-text-muted">{pair.chainId}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="text-right font-mono text-text-primary">{fmt.price(parseFloat(pair.priceUsd || 0))}</td>
                    <td className={clsx('text-right font-mono text-xs', c1h >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(c1h)}</td>
                    <td className={clsx('text-right font-mono text-xs', c6h >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(c6h)}</td>
                    <td className={clsx('text-right font-mono text-xs', c24h >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(c24h)}</td>
                    <td className="text-right text-text-secondary text-sm">{fmt.usd(parseFloat(pair.volume?.h24 || 0))}</td>
                    <td className="text-right text-text-secondary text-sm">{fmt.usd(parseFloat(pair.liquidity?.usd || 0))}</td>
                    <td className="text-right text-text-secondary text-sm">{fmt.usd(parseFloat(pair.fdv || 0))}</td>
                    <td><span className="tag-blue">{pair.dexId}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
