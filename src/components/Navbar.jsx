import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useSearch } from '../hooks/useSearch'
import { CHAIN_LIST } from '../utils/chains'
import { fmt } from '../utils/api'
import clsx from 'clsx'

export default function Navbar() {
  const { chain, setChain, wallet, connectWallet, disconnectWallet, globalStats } = useApp()
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showChains, setShowChains] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const { results, loading } = useSearch(query)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false); setShowChains(false); setShowWallet(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentChain = CHAIN_LIST.find(c => c.key === chain)
  const isActive = (path) => location.pathname === path

  const handleSelectPair = (pair) => {
    setQuery(''); setShowSearch(false)
    navigate(`/pair/${pair.chainId}/${pair.pairAddress}`)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60" style={{ background: 'rgba(8,7,15,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center h-14 px-4 gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', boxShadow: '0 0 16px rgba(168,85,247,0.5)' }}>
            <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5">
              <path d="M10 28 L18 14 L22 22 L26 18 L30 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="30" cy="28" r="2" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight">
            <span className="text-gradient">Alpha</span>
            <span className="text-text-primary">Crypto</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-0.5 ml-3">
          {[
            { to: '/', label: 'Home' },
            { to: '/trending', label: '🔥 Trending' },
            { to: '/new-pairs', label: '🆕 New Pairs' },
            { to: '/watchlist', label: '⭐ Watchlist' },
            { to: '/portfolio', label: '💼 Portfolio' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className={clsx(
              'px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive(to)
                ? 'text-accent-purple bg-purple-500/10'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
            )}>
              {label}
            </Link>
          ))}
        </div>

        {/* Global stats */}
        {globalStats && (
          <div className="hidden xl:flex items-center gap-4 ml-2 text-xs">
            {[
              { label: 'MCap', val: fmt.usd(globalStats.total_market_cap?.usd) },
              { label: 'Vol', val: fmt.usd(globalStats.total_volume?.usd) },
              { label: 'BTC Dom', val: `${globalStats.market_cap_percentage?.btc?.toFixed(1)}%` },
            ].map(s => (
              <span key={s.label} className="text-text-muted">
                {s.label}: <span className="text-text-secondary font-medium">{s.val}</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className={clsx(
            'flex items-center gap-2 rounded-xl px-3 py-1.5 w-60 transition-all border',
            showSearch ? 'border-accent-purple bg-bg-tertiary' : 'border-border bg-bg-tertiary hover:border-border-light'
          )} style={showSearch ? { boxShadow: '0 0 0 3px rgba(168,85,247,0.12)' } : {}}>
            <svg className="w-3.5 h-3.5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full"
              placeholder="Search token or pair..."
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSearch(true) }}
              onFocus={() => setShowSearch(true)}
            />
            {loading && <div className="w-3 h-3 border border-accent-purple border-t-transparent rounded-full animate-spin shrink-0" />}
          </div>

          {showSearch && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-96 card-glow shadow-2xl z-50 max-h-80 overflow-y-auto animate-slide-in rounded-2xl">
              {results.map((pair) => (
                <button key={pair.pairAddress} onClick={() => handleSelectPair(pair)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-500/5 transition-colors text-left border-b border-border/40 last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)' }}>
                    {pair.baseToken?.symbol?.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">{pair.baseToken?.symbol}</span>
                      <span className="text-xs text-text-muted">/ {pair.quoteToken?.symbol}</span>
                      <span className="tag-purple">{pair.dexId}</span>
                    </div>
                    <div className="text-xs text-text-muted truncate">{pair.baseToken?.name}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono text-text-primary">{fmt.price(parseFloat(pair.priceUsd))}</div>
                    <div className={clsx('text-xs font-medium', parseFloat(pair.priceChange?.h24) >= 0 ? 'text-accent-green' : 'text-accent-red')}>
                      {fmt.pct(parseFloat(pair.priceChange?.h24))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chain selector */}
        <div className="relative">
          <button onClick={() => setShowChains(!showChains)}
            className="flex items-center gap-2 bg-bg-tertiary border border-border rounded-xl px-3 py-1.5 text-sm hover:border-accent-purple/50 transition-all neon-hover">
            <span className="text-base">{currentChain?.icon}</span>
            <span className="hidden sm:block text-text-secondary text-xs font-medium">{currentChain?.name}</span>
            <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showChains && (
            <div className="absolute top-full mt-2 right-0 w-52 card-glow shadow-2xl z-50 py-1.5 animate-slide-in rounded-2xl">
              {CHAIN_LIST.map(c => (
                <button key={c.key} onClick={() => { setChain(c.key); setShowChains(false) }}
                  className={clsx('w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-purple-500/5 transition-colors',
                    chain === c.key && 'bg-purple-500/8')}>
                  <span className="text-base">{c.icon}</span>
                  <span className="text-text-primary flex-1 text-left">{c.name}</span>
                  {chain === c.key && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wallet */}
        {wallet ? (
          <div className="relative">
            <button onClick={() => setShowWallet(!showWallet)}
              className="flex items-center gap-2 border border-accent-purple/30 rounded-xl px-3 py-1.5 text-sm text-accent-purple hover:bg-purple-500/10 transition-all"
              style={{ background: 'rgba(168,85,247,0.08)' }}>
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="font-mono text-xs">{fmt.addr(wallet)}</span>
            </button>
            {showWallet && (
              <div className="absolute top-full mt-2 right-0 w-48 card-glow shadow-2xl z-50 py-1.5 animate-slide-in rounded-2xl">
                <Link to="/portfolio" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-purple-500/5 text-text-primary transition-colors">
                  <svg className="w-4 h-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Portfolio
                </Link>
                <button onClick={disconnectWallet} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-500/5 text-accent-red transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="hidden sm:block">Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  )
}
