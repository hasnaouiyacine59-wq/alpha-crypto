import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, fmt } from '../utils/api'
import { CHAIN_LIST } from '../utils/chains'
import { useApp } from '../context/AppContext'
import PairCard from '../components/PairCard'
import Typewriter from '../components/Typewriter'
import AdBanner from '../components/AdBanner'
import clsx from 'clsx'

export default function HomePage() {
  const { chain, setChain, trending } = useApp()
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('volume')
  const [line1Done, setLine1Done] = useState(false)
  const [line2Done, setLine2Done] = useState(false)

  useEffect(() => {
    setLoading(true)
    const queries = ['WETH', 'PEPE', 'SHIB', 'ARB', 'MATIC', 'AVAX', 'LINK', 'UNI', 'AAVE', 'DOGE']
    Promise.all(queries.map(q => searchPairs(q).then(r => r[0]).catch(() => null)))
      .then(results => { setPairs(results.filter(Boolean)); setLoading(false) })
  }, [chain])

  const sorted = [...pairs].sort((a, b) => {
    if (sortBy === 'volume') return parseFloat(b.volume?.h24 || 0) - parseFloat(a.volume?.h24 || 0)
    if (sortBy === 'liquidity') return parseFloat(b.liquidity?.usd || 0) - parseFloat(a.liquidity?.usd || 0)
    if (sortBy === 'change') return parseFloat(b.priceChange?.h24 || 0) - parseFloat(a.priceChange?.h24 || 0)
    return 0
  })

  return (
    <div className="relative">
      {/* Background orbs */}
      <div className="orb orb-purple w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-60" />
      <div className="orb orb-indigo w-[400px] h-[400px] top-96 -left-32 opacity-40" />
      <div className="orb orb-purple w-[300px] h-[300px] top-96 -right-20 opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 py-10 space-y-12">

        {/* Ad banner — top */}
        <AdBanner className="mt-2" />

        {/* Hero */}
        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 border border-accent-purple/30 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" style={{ boxShadow: '0 0 6px #a855f7' }} />
            Real-time DEX Analytics · 8+ Chains · 50+ DEXs
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight min-h-[2.5em]">
            <Typewriter
              text="Track Every Token"
              speed={50}
              className="text-text-primary block"
              onDone={() => setLine1Done(true)}
            />
            {line1Done && (
              <Typewriter
                text="on Every Chain"
                speed={50}
                className="text-gradient block"
                onDone={() => setLine2Done(true)}
              />
            )}
          </h1>

          <div className="min-h-[3.5rem]">
            {line2Done && (
              <p className="text-text-muted text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
                <Typewriter
                  text="Real-time charts, security analysis, portfolio tracking and token swap — all in one place."
                  speed={18}
                />
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/trending" className="btn-primary text-base px-6 py-3">
              🔥 Explore Trending
            </Link>
            <Link to="/new-pairs" className="btn-secondary text-base px-6 py-3">
              🆕 New Pairs
            </Link>
          </div>

          {/* Chain pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {CHAIN_LIST.map(c => (
              <button key={c.key} onClick={() => setChain(c.key)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                  chain === c.key
                    ? 'text-accent-purple border-accent-purple/50 bg-purple-500/10'
                    : 'border-border text-text-muted hover:border-accent-purple/30 hover:text-text-secondary bg-bg-card'
                )}
                style={chain === c.key ? { boxShadow: '0 0 12px rgba(168,85,247,0.2)' } : {}}>
                <span>{c.icon}</span>{c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Chains', value: '8+', icon: '🔗', color: 'text-accent-purple' },
            { label: 'DEX Protocols', value: '50+', icon: '⚡', color: 'text-accent-indigo' },
            { label: 'Tokens Tracked', value: '100K+', icon: '📊', color: 'text-accent-cyan' },
            { label: 'Daily Traders', value: '50K+', icon: '👥', color: 'text-accent-pink' },
          ].map(s => (
            <div key={s.label} className="card-glow p-5 flex items-center gap-4 neon-hover">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className={clsx('text-2xl font-bold', s.color)}>{s.value}</div>
                <div className="text-xs text-text-muted mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending tokens */}
        {trending.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                🔥 <span className="text-gradient">Trending Now</span>
              </h2>
              <Link to="/trending" className="text-xs text-accent-purple hover:text-accent-violet transition-colors font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {trending.slice(0, 6).map((item, i) => {
                const coin = item.item || item
                const change = coin.data?.price_change_percentage_24h?.usd ?? 0
                const isPos = change >= 0
                return (
                  <div key={i} className="card neon-hover p-4 cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-gradient">#{i + 1}</span>
                      {coin.thumb && <img src={coin.thumb} alt={coin.symbol} className="w-5 h-5 rounded-full ml-auto" />}
                    </div>
                    <div className="text-sm font-bold text-text-primary">{coin.symbol?.toUpperCase()}</div>
                    <div className="text-xs text-text-muted truncate mt-0.5">{coin.name}</div>
                    <div className={clsx('text-xs font-semibold mt-2', isPos ? 'text-accent-green' : 'text-accent-red')}>
                      {fmt.pct(change)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Ad banner — mid page */}
        <AdBanner />

        {/* Hot pairs */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-text-primary">
              ⚡ <span className="text-gradient">Hot Pairs</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Sort:</span>
              {['volume', 'liquidity', 'change'].map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={clsx('px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all',
                    sortBy === s
                      ? 'text-white border border-accent-purple/50'
                      : 'bg-bg-card text-text-muted hover:text-text-primary border border-border'
                  )}
                  style={sortBy === s ? { background: 'linear-gradient(135deg,#a855f7,#6366f1)' } : {}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sorted.map(pair => <PairCard key={pair.pairAddress} pair={pair} />)}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-center mb-2">
            <span className="text-gradient">Everything You Need</span>
          </h2>
          <p className="text-text-muted text-center mb-10">to trade smarter on every chain</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '📈', title: 'Real-Time Charts', desc: 'Candlestick charts with 1-block precision, multiple timeframes, and full indicator suite.' },
              { icon: '🛡️', title: 'Security Analysis', desc: 'Instant rug check, honeypot detection, contract verification, and tax analysis.' },
              { icon: '🌐', title: 'Multi-Chain', desc: 'Track tokens across Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, and more.' },
              { icon: '💼', title: 'Portfolio Tracking', desc: 'Connect your wallet to see all holdings, PnL, and token values in one place.' },
              { icon: '⭐', title: 'Watchlist', desc: 'Save your favorite pairs and monitor them from a single dashboard.' },
              { icon: '🔄', title: 'Built-in Swap', desc: 'Swap tokens directly from the chart page without leaving the platform.' },
            ].map(f => (
              <div key={f.title} className="card neon-hover p-6 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <div className="font-bold text-text-primary mb-2">{f.title}</div>
                <div className="text-sm text-text-muted leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
