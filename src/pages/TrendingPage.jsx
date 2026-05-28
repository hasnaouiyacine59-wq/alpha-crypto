import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTrendingCoins, searchPairs, fmt } from '../utils/api'
import { useApp } from '../context/AppContext'
import { CHAIN_LIST } from '../utils/chains'
import AdBanner from '../components/AdBanner'
import clsx from 'clsx'

const SORT_OPTIONS = ['rank', 'change', 'volume', 'liquidity']

export default function TrendingPage() {
  const { toggleWatchlist, isWatchlisted } = useApp()
  const [pairs, setPairs] = useState([])
  const [trendingCoins, setTrendingCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('volume')
  const [sortDir, setSortDir] = useState('desc')
  const [chainFilter, setChainFilter] = useState('all')
  const [tab, setTab] = useState('pairs') // pairs | coins

  // Fetch CoinGecko trending coins
  useEffect(() => {
    getTrendingCoins().then(coins => setTrendingCoins(coins)).catch(() => {})
  }, [])

  // Fetch trending pairs from DexScreener
  useEffect(() => {
    setLoading(true)
    const queries = ['PEPE', 'SHIB', 'DOGE', 'FLOKI', 'BONK', 'WIF', 'BRETT', 'MEME', 'TURBO', 'WOJAK', 'TRUMP', 'POPCAT', 'MOG', 'NEIRO', 'PNUT']
    Promise.all(queries.map(q =>
      searchPairs(q).then(r => r[0] || null).catch(() => null)
    )).then(results => {
      setPairs(results.filter(Boolean))
      setLoading(false)
    })
  }, [])

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const filtered = pairs.filter(p => chainFilter === 'all' || p.chainId === chainFilter)

  const sorted = [...filtered].sort((a, b) => {
    let va, vb
    if (sortBy === 'change') { va = parseFloat(a.priceChange?.h24 || 0); vb = parseFloat(b.priceChange?.h24 || 0) }
    else if (sortBy === 'volume') { va = parseFloat(a.volume?.h24 || 0); vb = parseFloat(b.volume?.h24 || 0) }
    else if (sortBy === 'liquidity') { va = parseFloat(a.liquidity?.usd || 0); vb = parseFloat(b.liquidity?.usd || 0) }
    else return 0
    return sortDir === 'desc' ? vb - va : va - vb
  })

  const SortTh = ({ col, label, right }) => (
    <th className={clsx('cursor-pointer select-none hover:text-accent-purple transition-colors', right && 'text-right')}
      onClick={() => handleSort(col)}>
      <span className="inline-flex items-center gap-1">
        {right && <span className="flex-1" />}
        {label}
        {sortBy === col && <span className="text-accent-purple">{sortDir === 'desc' ? '↓' : '↑'}</span>}
      </span>
    </th>
  )

  return (
    <div className="relative">
      <div className="orb orb-purple w-96 h-96 -top-20 right-0 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 relative">

        {/* Ad banner — top */}
        <AdBanner slot="leaderboard" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🔥 <span className="text-gradient">Trending</span>
            </h1>
            <p className="text-sm text-text-muted mt-1">Most popular tokens right now across all chains</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-bg-tertiary rounded-xl p-1 border border-border">
            {[{ key: 'pairs', label: '⚡ Pairs' }, { key: 'coins', label: '🪙 Coins' }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.key ? 'text-white' : 'text-text-muted hover:text-text-primary'
                )}
                style={tab === t.key ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)' } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {tab === 'pairs' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setChainFilter('all')}
              className={clsx('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                chainFilter === 'all' ? 'text-white border-accent-purple/50' : 'border-border text-text-muted hover:border-accent-purple/30'
              )}
              style={chainFilter === 'all' ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)' } : {}}>
              All Chains
            </button>
            {CHAIN_LIST.slice(0, 6).map(c => (
              <button key={c.key} onClick={() => setChainFilter(c.key)}
                className={clsx('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5',
                  chainFilter === c.key ? 'text-white border-accent-purple/50' : 'border-border text-text-muted hover:border-accent-purple/30 bg-bg-card'
                )}
                style={chainFilter === c.key ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)' } : {}}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Ad banner — shown once data is loaded */}
        {tab === 'pairs' && !loading && sorted.length > 0 && (
          <AdBanner slot="billboard" />
        )}

        {/* Pairs table */}
        {tab === 'pairs' && (
          loading ? (
            <div className="space-y-2">
              {[...Array(12)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="card p-16 text-center text-text-muted">No pairs found for this chain.</div>
          ) : (
            <div className="card-glow overflow-hidden rounded-2xl">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-10">#</th>
                    <th>Token / Pair</th>
                    <th className="text-right">Price</th>
                    <th className="text-right cursor-pointer hover:text-accent-purple" onClick={() => handleSort('change')}>
                      24h {sortBy === 'change' && <span className="text-accent-purple">{sortDir === 'desc' ? '↓' : '↑'}</span>}
                    </th>
                    <th className="text-right">1h</th>
                    <th className="text-right">6h</th>
                    <th className="text-right cursor-pointer hover:text-accent-purple" onClick={() => handleSort('volume')}>
                      Volume {sortBy === 'volume' && <span className="text-accent-purple">{sortDir === 'desc' ? '↓' : '↑'}</span>}
                    </th>
                    <th className="text-right cursor-pointer hover:text-accent-purple" onClick={() => handleSort('liquidity')}>
                      Liquidity {sortBy === 'liquidity' && <span className="text-accent-purple">{sortDir === 'desc' ? '↓' : '↑'}</span>}
                    </th>
                    <th className="text-right">FDV</th>
                    <th className="text-right">Txns 24h</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((pair, i) => {
                    const c1h  = parseFloat(pair.priceChange?.h1  || 0)
                    const c6h  = parseFloat(pair.priceChange?.h6  || 0)
                    const c24h = parseFloat(pair.priceChange?.h24 || 0)
                    const txns = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0)
                    const wl   = isWatchlisted(pair.pairAddress)
                    return (
                      <tr key={pair.pairAddress} className="group">
                        <td className="text-text-muted font-mono text-xs">{i + 1}</td>
                        <td>
                          <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`}
                            className="flex items-center gap-3 hover:text-accent-purple transition-colors">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                              {pair.baseToken?.symbol?.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-text-primary group-hover:text-accent-purple transition-colors">
                                {pair.baseToken?.symbol}
                                <span className="text-text-muted font-normal text-xs ml-1">/{pair.quoteToken?.symbol}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="tag-purple text-xs">{pair.dexId}</span>
                                <span className="text-xs text-text-muted">{pair.chainId}</span>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="text-right font-mono text-sm font-semibold text-text-primary">
                          {fmt.price(parseFloat(pair.priceUsd || 0))}
                        </td>
                        <td className="text-right">
                          <span className={clsx('font-mono text-sm font-semibold px-2 py-0.5 rounded-lg',
                            c24h >= 0 ? 'text-accent-green bg-green-500/10' : 'text-accent-red bg-red-500/10')}>
                            {fmt.pct(c24h)}
                          </span>
                        </td>
                        <td className={clsx('text-right font-mono text-xs', c1h >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(c1h)}</td>
                        <td className={clsx('text-right font-mono text-xs', c6h >= 0 ? 'text-accent-green' : 'text-accent-red')}>{fmt.pct(c6h)}</td>
                        <td className="text-right text-sm text-text-secondary font-medium">{fmt.usd(parseFloat(pair.volume?.h24 || 0))}</td>
                        <td className="text-right text-sm text-text-secondary">{fmt.usd(parseFloat(pair.liquidity?.usd || 0))}</td>
                        <td className="text-right text-sm text-text-muted">{fmt.usd(parseFloat(pair.fdv || 0))}</td>
                        <td className="text-right text-sm text-text-muted font-mono">{txns.toLocaleString()}</td>
                        <td>
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => toggleWatchlist(pair)}
                              className={clsx('p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100',
                                wl ? 'text-accent-yellow opacity-100' : 'text-text-muted hover:text-accent-yellow'
                              )}>
                              <svg className="w-3.5 h-3.5" fill={wl ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                            <Link to={`/pair/${pair.chainId}/${pair.pairAddress}`}
                              className="btn-secondary py-1 px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Chart →
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* CoinGecko trending coins grid */}
        {tab === 'coins' && (
          trendingCoins.length === 0 ? (
            <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingCoins.map((item, i) => {
                const coin = item.item
                const change = coin.data?.price_change_percentage_24h?.usd ?? 0
                const isPos = change >= 0
                const price = coin.data?.price ?? '—'
                return (
                  <div key={coin.id} className="card-glow neon-hover p-5 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)' }} />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        {coin.thumb
                          ? <img src={coin.thumb} alt={coin.symbol} className="w-10 h-10 rounded-full" />
                          : <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                              style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                              {coin.symbol?.slice(0, 2).toUpperCase()}
                            </div>
                        }
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', fontSize: '9px' }}>
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text-primary">{coin.symbol?.toUpperCase()}</div>
                        <div className="text-xs text-text-muted truncate">{coin.name}</div>
                      </div>
                      <div className={clsx('text-sm font-bold px-2 py-1 rounded-lg',
                        isPos ? 'text-accent-green bg-green-500/10' : 'text-accent-red bg-red-500/10')}>
                        {fmt.pct(change)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-bg-tertiary rounded-xl p-2.5">
                        <div className="text-xs text-text-muted">Price</div>
                        <div className="text-sm font-mono font-semibold text-text-primary mt-0.5">
                          {typeof price === 'number' ? fmt.price(price) : price}
                        </div>
                      </div>
                      <div className="bg-bg-tertiary rounded-xl p-2.5">
                        <div className="text-xs text-text-muted">Mkt Cap Rank</div>
                        <div className="text-sm font-bold text-gradient mt-0.5">#{coin.market_cap_rank || '—'}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}
