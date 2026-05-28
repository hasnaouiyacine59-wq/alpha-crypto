import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/api'
import clsx from 'clsx'

// Left sidebar: token info panel
export default function TokenInfoPanel({ pair }) {
  const { toggleWatchlist, isWatchlisted } = useApp()
  const [tab, setTab] = useState('info') // info | security | tokenomics

  if (!pair) return (
    <div className="p-4 space-y-3">
      {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}
    </div>
  )

  const base = pair.baseToken
  const quote = pair.quoteToken
  const price = parseFloat(pair.priceUsd || 0)
  const change24h = parseFloat(pair.priceChange?.h24 || 0)
  const change6h = parseFloat(pair.priceChange?.h6 || 0)
  const change1h = parseFloat(pair.priceChange?.h1 || 0)
  const vol24h = parseFloat(pair.volume?.h24 || 0)
  const liq = parseFloat(pair.liquidity?.usd || 0)
  const mcap = parseFloat(pair.fdv || 0)
  const txns = pair.txns?.h24
  const watchlisted = isWatchlisted(pair.pairAddress)

  // Simulated ATH multiplier
  const athX = (Math.random() * 50 + 2).toFixed(1)
  const currentX = (Math.random() * 5 + 0.5).toFixed(1)

  const statRows = [
    { label: 'Price USD', value: fmt.price(price), mono: true },
    { label: 'Price Native', value: `${parseFloat(pair.priceNative || 0).toFixed(8)} ${quote?.symbol}`, mono: true },
    { label: '24h Change', value: fmt.pct(change24h), color: change24h >= 0 ? 'text-accent-green' : 'text-accent-red' },
    { label: '6h Change', value: fmt.pct(change6h), color: change6h >= 0 ? 'text-accent-green' : 'text-accent-red' },
    { label: '1h Change', value: fmt.pct(change1h), color: change1h >= 0 ? 'text-accent-green' : 'text-accent-red' },
    { label: '24h Volume', value: fmt.usd(vol24h) },
    { label: 'Liquidity', value: fmt.usd(liq) },
    { label: 'FDV / MCap', value: fmt.usd(mcap) },
    { label: 'Buys (24h)', value: txns?.buys?.toLocaleString() || '—', color: 'text-accent-green' },
    { label: 'Sells (24h)', value: txns?.sells?.toLocaleString() || '—', color: 'text-accent-red' },
    { label: 'ATH', value: `${athX}x`, color: 'text-accent-yellow' },
    { label: 'Current', value: `${currentX}x`, color: 'text-text-secondary' },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Token header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm font-bold text-white shrink-0">
              {base?.symbol?.slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-text-primary">{base?.symbol}</div>
              <div className="text-xs text-text-muted truncate max-w-[120px]">{base?.name}</div>
            </div>
          </div>
          <button
            onClick={() => toggleWatchlist(pair)}
            className={clsx(
              'p-1.5 rounded-lg transition-colors',
              watchlisted ? 'text-accent-yellow bg-yellow-500/10' : 'text-text-muted hover:text-accent-yellow hover:bg-yellow-500/10'
            )}
            title={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <svg className="w-4 h-4" fill={watchlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-text-primary">{fmt.price(price)}</div>
          <div className={clsx('text-sm font-medium mt-0.5', change24h >= 0 ? 'text-accent-green' : 'text-accent-red')}>
            {fmt.pct(change24h)} (24h)
          </div>
        </div>

        {/* DEX + Chain badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="tag-blue">{pair.dexId}</span>
          <span className="text-xs bg-bg-tertiary text-text-secondary px-2 py-0.5 rounded border border-border">{pair.chainId}</span>
          <a
            href={`https://etherscan.io/address/${base?.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-blue hover:underline font-mono"
          >
            {fmt.addr(base?.address)}
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 space-y-1 border-b border-border">
        {statRows.map(row => (
          <div key={row.label} className="flex items-center justify-between py-1 px-1 rounded hover:bg-bg-tertiary/50 transition-colors">
            <span className="text-xs text-text-muted">{row.label}</span>
            <span className={clsx('text-xs font-medium', row.mono && 'font-mono', row.color || 'text-text-primary')}>
              {row.value || '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="p-3">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Links</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Explorer', href: `https://etherscan.io/token/${base?.address}` },
            { label: 'DexScreener', href: `https://dexscreener.com/${pair.chainId}/${pair.pairAddress}` },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-blue hover:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg transition-colors"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
