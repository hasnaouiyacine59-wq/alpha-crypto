import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false)
        setShowChains(false)
        setShowWallet(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentChain = CHAIN_LIST.find(c => c.key === chain)

  const handleSelectPair = (pair) => {
    setQuery('')
    setShowSearch(false)
    navigate(`/pair/${pair.chainId}/${pair.pairAddress}`)
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary border-b border-border">
      <div className="flex items-center h-14 px-4 gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent-blue flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M12 2L4 7v5c0 5.25 3.4 10.15 8 11.35C16.6 22.15 20 17.25 20 12V7L12 2z" fill="white" opacity="0.9"/>
              <path d="M9 12l2 2 4-4" stroke="#0d0e12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-base text-text-primary tracking-tight">
            Alpha<span className="text-accent-blue">Crypto</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/trending" className="nav-link">Trending</Link>
          <Link to="/new-pairs" className="nav-link">New Pairs</Link>
          <Link to="/watchlist" className="nav-link">Watchlist</Link>
          <Link to="/portfolio" className="nav-link">Portfolio</Link>
        </div>

        {/* Global stats */}
        {globalStats && (
          <div className="hidden lg:flex items-center gap-4 ml-2 text-xs text-text-muted">
            <span>MCap: <span className="text-text-secondary">{fmt.usd(globalStats.total_market_cap?.usd)}</span></span>
            <span>24h Vol: <span className="text-text-secondary">{fmt.usd(globalStats.total_volume?.usd)}</span></span>
            <span>BTC Dom: <span className="text-text-secondary">{globalStats.market_cap_percentage?.btc?.toFixed(1)}%</span></span>
          </div>
        )}

        <div className="flex-1" />

        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 w-64">
            <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-full"
              placeholder="Search token or pair..."
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSearch(true) }}
              onFocus={() => setShowSearch(true)}
            />
            {loading && <div className="w-3 h-3 border border-accent-blue border-t-transparent rounded-full animate-spin shrink-0" />}
          </div>

          {showSearch && results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 w-96 card shadow-2xl z-50 max-h-80 overflow-y-auto animate-slide-in">
              {results.map((pair) => (
                <button
                  key={pair.pairAddress}
                  onClick={() => handleSelectPair(pair)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-bg-hover transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-bold text-accent-blue shrink-0">
                    {pair.baseToken?.symbol?.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{pair.baseToken?.symbol}</span>
                      <span className="text-xs text-text-muted">/ {pair.quoteToken?.symbol}</span>
                      <span className="text-xs text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">{pair.dexId}</span>
                    </div>
                    <div className="text-xs text-text-muted truncate">{pair.baseToken?.name}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono text-text-primary">{fmt.price(parseFloat(pair.priceUsd))}</div>
                    <div className={clsx('text-xs', parseFloat(pair.priceChange?.h24) >= 0 ? 'text-accent-green' : 'text-accent-red')}>
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
          <button
            onClick={() => setShowChains(!showChains)}
            className="flex items-center gap-2 bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm hover:border-accent-blue transition-colors"
          >
            <span>{currentChain?.icon}</span>
            <span className="hidden sm:block text-text-secondary">{currentChain?.name}</span>
            <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showChains && (
            <div className="absolute top-full mt-1 right-0 w-52 card shadow-2xl z-50 py-1 animate-slide-in">
              {CHAIN_LIST.map(c => (
                <button
                  key={c.key}
                  onClick={() => { setChain(c.key); setShowChains(false) }}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-bg-hover transition-colors',
                    chain === c.key && 'bg-bg-hover'
                  )}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="text-text-primary">{c.name}</span>
                  {chain === c.key && (
                    <svg className="w-4 h-4 text-accent-blue ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wallet */}
        {wallet ? (
          <div className="relative">
            <button
              onClick={() => setShowWallet(!showWallet)}
              className="flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/30 rounded-lg px-3 py-1.5 text-sm text-accent-blue hover:bg-accent-blue/20 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="font-mono">{fmt.addr(wallet)}</span>
            </button>
            {showWallet && (
              <div className="absolute top-full mt-1 right-0 w-48 card shadow-2xl z-50 py-1 animate-slide-in">
                <Link to="/portfolio" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-bg-hover text-text-primary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Portfolio
                </Link>
                <button onClick={disconnectWallet} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-bg-hover text-accent-red">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="hidden sm:block">Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  )
}
