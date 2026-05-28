import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPairByAddress, getTokenPairs, fmt } from '../utils/api'
import { TIMEFRAMES } from '../utils/chains'
import PriceChart from '../components/PriceChart'
import TokenInfoPanel from '../components/TokenInfoPanel'
import TransactionHistory from '../components/TransactionHistory'
import SecurityPanel from '../components/SecurityPanel'
import TokenomicsPanel from '../components/TokenomicsPanel'
import SwapPanel from '../components/SwapPanel'
import AdBanner from '../components/AdBanner'
import clsx from 'clsx'

export default function PairPage() {
  const { chainId, pairAddress } = useParams()
  const [pair, setPair] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('5')
  const [rightTab, setRightTab] = useState('swap') // swap | security | tokenomics
  const [bottomTab, setBottomTab] = useState('txns') // txns | info

  useEffect(() => {
    setLoading(true)
    getPairByAddress(chainId, pairAddress)
      .then(p => { setPair(p); setLoading(false) })
      .catch(() => setLoading(false))
  }, [chainId, pairAddress])

  // Live price update simulation
  useEffect(() => {
    if (!pair) return
    const interval = setInterval(() => {
      setPair(prev => {
        if (!prev) return prev
        const change = (Math.random() - 0.5) * 0.002
        const newPrice = parseFloat(prev.priceUsd) * (1 + change)
        return { ...prev, priceUsd: newPrice.toString() }
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [pair?.pairAddress])

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted text-sm">Loading pair data...</span>
      </div>
    </div>
  )

  if (!pair) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-4xl">🔍</div>
      <div className="text-text-primary font-semibold">Pair not found</div>
      <div className="text-text-muted text-sm">The pair address may be invalid or not indexed yet.</div>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-88px)] overflow-hidden">
      {/* Left sidebar - token info */}
      <div className="w-64 shrink-0 border-r border-border overflow-y-auto hidden lg:block">
        <TokenInfoPanel pair={pair} />
      </div>

      {/* Center - chart + transactions */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chart toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg-secondary shrink-0">
          {/* Pair title */}
          <div className="flex items-center gap-2 mr-2">
            <span className="font-semibold text-text-primary">{pair.baseToken?.symbol}/{pair.quoteToken?.symbol}</span>
            <span className={clsx('text-sm font-medium', parseFloat(pair.priceChange?.h24) >= 0 ? 'text-accent-green' : 'text-accent-red')}>
              {fmt.pct(parseFloat(pair.priceChange?.h24))}
            </span>
          </div>

          {/* Timeframes */}
          <div className="flex items-center gap-0.5">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={clsx(
                  'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                  timeframe === tf.value ? 'bg-accent-blue text-white' : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Quick stats */}
          <div className="hidden xl:flex items-center gap-4 text-xs">
            {[
              { label: 'Price', value: fmt.price(parseFloat(pair.priceUsd)) },
              { label: 'Liq', value: fmt.usd(parseFloat(pair.liquidity?.usd)) },
              { label: 'Vol 24h', value: fmt.usd(parseFloat(pair.volume?.h24)) },
              { label: 'FDV', value: fmt.usd(parseFloat(pair.fdv)) },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="text-text-muted">{s.label}:</span>
                <span className="text-text-primary font-medium font-mono">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0 overflow-hidden bg-bg-card">
          <PriceChart pairAddress={pairAddress} chainId={chainId} symbol={pair.baseToken?.symbol} timeframe={timeframe} />
        </div>

        {/* Bottom tabs */}
        <div className="h-64 shrink-0 border-t border-border flex flex-col">
          <div className="flex items-center gap-1 px-3 pt-2 border-b border-border shrink-0">
            {[
              { key: 'txns', label: 'Transactions' },
              { key: 'info', label: 'Token Info' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setBottomTab(t.key)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-t transition-colors',
                  bottomTab === t.key ? 'text-text-primary border-b-2 border-accent-blue' : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {bottomTab === 'txns' ? (
              <TransactionHistory pair={pair} />
            ) : (
              <div className="p-4 overflow-y-auto h-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Contract', value: fmt.addr(pair.baseToken?.address) },
                    { label: 'Pair', value: fmt.addr(pair.pairAddress) },
                    { label: 'DEX', value: pair.dexId },
                    { label: 'Chain', value: pair.chainId },
                  ].map(item => (
                    <div key={item.label} className="bg-bg-tertiary rounded-lg p-2.5">
                      <div className="text-xs text-text-muted">{item.label}</div>
                      <div className="text-xs font-mono text-text-primary mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 shrink-0 border-l border-border flex flex-col hidden md:flex">
        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          {[
            { key: 'swap', label: 'Swap' },
            { key: 'security', label: 'Security' },
            { key: 'tokenomics', label: 'Tokenomics' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setRightTab(t.key)}
              className={clsx(
                'flex-1 py-2.5 text-xs font-medium transition-colors',
                rightTab === t.key
                  ? 'text-text-primary border-b-2 border-accent-blue bg-bg-secondary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {rightTab === 'swap' && <SwapPanel pair={pair} />}
          {rightTab === 'security' && (
            <div className="p-4"><SecurityPanel pair={pair} /></div>
          )}
          {rightTab === 'tokenomics' && (
            <div className="p-4"><TokenomicsPanel pair={pair} /></div>
          )}
          <div className="p-3 mt-auto">
            <AdBanner slot="rectangle" className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
