import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, getTrendingCoins, fmt } from '../utils/api'
import { CHAIN_LIST } from '../utils/chains'
import { useApp } from '../context/AppContext'
import PairCard from '../components/PairCard'
import clsx from 'clsx'

const FEATURED_PAIRS = [
  { query: 'WETH', chain: 'ethereum' },
  { query: 'PEPE', chain: 'ethereum' },
  { query: 'SHIB', chain: 'ethereum' },
  { query: 'CAKE', chain: 'bsc' },
]

export default function HomePage() {
  const { chain, setChain, trending } = useApp()
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('volume') // volume | liquidity | change

  useEffect(() => {
    setLoading(true)
    const queries = ['WETH', 'PEPE', 'SHIB', 'ARB', 'MATIC', 'AVAX', 'LINK', 'UNI', 'AAVE', 'DOGE']
    Promise.all(queries.map(q => searchPairs(q).then(r => r[0]).catch(() => null)))
      .then(results => {
        const valid = results.filter(Boolean)
        setPairs(valid)
        setLoading(false)
      })
  }, [chain])

  const sorted = [...pairs].sort((a, b) => {
    if (sortBy === 'volume') return parseFloat(b.volume?.h24 || 0) - parseFloat(a.volume?.h24 || 0)
    if (sortBy === 'liquidity') return parseFloat(b.liquidity?.usd || 0) - parseFloat(a.liquidity?.usd || 0)
    if (sortBy === 'change') return parseFloat(b.priceChange?.h24 || 0) - parseFloat(a.priceChange?.h24 || 0)
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <div className="text-center py-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5 text-xs text-accent-blue font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          Real-time DEX Analytics
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
          Track Every Token on<br />
          <span className="text-accent-blue">Every Chain</span>
        </h1>
        <p className="text-text-muted max-w-xl mx-auto">
          Real-time charts, trading history, token security analysis, and portfolio tracking across 8+ blockchains and 50+ DEXs.
        </p>

        {/* Chain pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {CHAIN_LIST.map(c => (
            <button
              key={c.key}
              onClick={() => setChain(c.key)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                chain === c.key
                  ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                  : 'border-border bg-bg-card text-text-secondary hover:border-border-light'
              )}
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Chains Supported', value: '8+', icon: '🔗', color: 'text-accent-blue' },
          { label: 'DEX Protocols', value: '50+', icon: '⚡', color: 'text-accent-purple' },
          { label: 'Tokens Tracked', value: '100K+', icon: '📊', color: 'text-accent-green' },
          { label: 'Daily Traders', value: '50K+', icon: '👥', color: 'text-accent-yellow' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className={clsx('text-xl font-bold', stat.color)}>{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trending tokens */}
      {trending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              🔥 Trending Now
            </h2>
            <Link to="/trending" className="text-xs text-accent-blue hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {trending.slice(0, 6).map((item, i) => {
              const coin = item.item || item
              const change = coin.data?.price_change_percentage_24h?.usd ?? 0
              const isPos = change >= 0
              return (
                <div key={i} className="card p-3 hover:border-border-light transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-text-muted">#{i + 1}</span>
                    {coin.thumb && (
                      <img src={coin.thumb} alt={coin.symbol} className="w-5 h-5 rounded-full" />
                    )}
                  </div>
                  <div className="text-sm font-semibold text-text-primary">{coin.symbol?.toUpperCase()}</div>
                  <div className="text-xs text-text-muted truncate">{coin.name}</div>
                  <div className={clsx('text-xs font-medium mt-1', isPos ? 'text-accent-green' : 'text-accent-red')}>
                    {fmt.pct(change)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Hot pairs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Hot Pairs</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Sort by:</span>
            {['volume', 'liquidity', 'change'].map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={clsx(
                  'px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors',
                  sortBy === s ? 'bg-accent-blue text-white' : 'bg-bg-card text-text-muted hover:text-text-primary border border-border'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-4 space-y-3">
                <div className="skeleton h-10 rounded" />
                <div className="skeleton h-6 rounded w-2/3" />
                <div className="skeleton h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map(pair => (
              <PairCard key={pair.pairAddress} pair={pair} />
            ))}
          </div>
        )}
      </div>

      {/* Features section */}
      <div className="py-8">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Everything You Need to Trade Smarter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '📈',
              title: 'Real-Time Charts',
              desc: 'Candlestick charts with 1-block precision, multiple timeframes, and full indicator suite.'
            },
            {
              icon: '🛡️',
              title: 'Security Analysis',
              desc: 'Instant rug check, honeypot detection, contract verification, and tax analysis.'
            },
            {
              icon: '🌐',
              title: 'Multi-Chain',
              desc: 'Track tokens across Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, and more.'
            },
            {
              icon: '💼',
              title: 'Portfolio Tracking',
              desc: 'Connect your wallet to see all holdings, PnL, and token values in one place.'
            },
            {
              icon: '🔔',
              title: 'Watchlist & Alerts',
              desc: 'Save your favorite pairs and get notified on price movements.'
            },
            {
              icon: '🔄',
              title: 'Built-in Swap',
              desc: 'Swap tokens directly from the chart page without leaving the platform.'
            },
          ].map(f => (
            <div key={f.title} className="card p-5 hover:border-border-light transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-text-primary mb-1">{f.title}</div>
              <div className="text-sm text-text-muted">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
